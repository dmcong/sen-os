import { useCallback, useEffect, useState } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'
import { Routing, utils } from '@senswap/sen-js'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Modal, Icon, Typography, Button } from '@senswap/sen-ui'
import Hop, { HopData } from './hop'

import { useSenOs } from 'helpers/senos'
import util from 'helpers/util'
import configs from '@/sen_swap/config'
import { AppDispatch, AppState } from '@/sen_swap/model'
import { curve, DECIMALS, inverseCurve } from './util'
import { updateAskData } from '@/sen_swap/controller/ask.controller'
import { updateBidData } from '@/sen_swap/controller/bid.controller'
import { ExtendedPoolData } from '../selection/mintSelection'

const Review = ({
  route,
  visible = false,
  onClose = () => {},
}: {
  route: ExtendedPoolData[]
  visible: boolean
  onClose: () => void
}) => {
  const [hops, setHops] = useState<HopData[]>([])
  const [bidAmounts, setBidAmounts] = useState<string[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)
  const { slippage } = useSelector((state: AppState) => state.settings)
  const {
    senos: { tokenProvider, notify },
  } = useSenOs()

  /**
   * Parse hops
   */
  const parseHops = useCallback(async () => {
    if (route.length === 1) {
      const hop: HopData = {
        poolData: route[0],
        srcMintInfo: bidData.mintInfo as TokenInfo,
        dstMintInfo: askData.mintInfo as TokenInfo,
      }
      setHops([hop])
    }
    if (route.length === 2) {
      const middleMintInfo = await tokenProvider.findByAddress(route[0].mint_s)
      const firstHop: HopData = {
        poolData: route[0],
        srcMintInfo: bidData.mintInfo as TokenInfo,
        dstMintInfo: middleMintInfo as TokenInfo,
      }
      const secondHop: HopData = {
        poolData: route[1],
        srcMintInfo: middleMintInfo as TokenInfo,
        dstMintInfo: askData.mintInfo as TokenInfo,
      }
      setHops([firstHop, secondHop])
    }
  }, [route, bidData, askData, tokenProvider])

  /**
   * Infer amounts
   */
  const isValidAmount = (amount: string) => {
    if (!amount || !Number(amount)) return false
    return true
  }
  const inferAmmount = useCallback(async () => {
    if (hops.length === 1) {
      if (bidData.priority > askData.priority) {
        const amount = !isValidAmount(bidData.amount)
          ? bidData.amount
          : curve(bidData.amount, hops[0])
        setBidAmounts([bidData.amount])
        return dispatch(updateAskData({ amount }))
      }
      if (bidData.priority < askData.priority) {
        const amount = !isValidAmount(askData.amount)
          ? askData.amount
          : inverseCurve(askData.amount, hops[0])
        setBidAmounts([amount])
        return dispatch(updateBidData({ amount }))
      }
    }
    if (hops.length === 2) {
      if (bidData.priority > askData.priority) {
        const middleAmount = !isValidAmount(bidData.amount)
          ? bidData.amount
          : curve(bidData.amount, hops[0])
        const amount = curve(middleAmount, hops[1])
        setBidAmounts([bidData.amount, middleAmount])
        return dispatch(updateAskData({ amount }))
      }
      if (bidData.priority < askData.priority) {
        const middleAmount = !isValidAmount(askData.amount)
          ? askData.amount
          : inverseCurve(askData.amount, hops[1])
        const amount = inverseCurve(middleAmount, hops[0])
        setBidAmounts([amount, middleAmount])
        return dispatch(updateBidData({ amount }))
      }
    }
  }, [hops, bidData, askData, dispatch])

  /**
   * Swap function
   */
  const swapOrRoute = useCallback(async () => {
    const {
      sol: { routingAddress, swapAddress, spltAddress, splataAddress, node },
    } = configs
    const routing = new Routing(
      routingAddress,
      swapAddress,
      spltAddress,
      splataAddress,
      node,
    )
    const { wallet } = window.senos
    const {
      dstMintInfo: { decimals: bidDecimals },
    } = hops[0]
    const amount = utils.decimalize(bidData.amount, bidDecimals)
    if (hops.length === 1) {
      const {
        srcMintInfo: { address: srcMintAddress },
        dstMintInfo: { address: dstMintAddress },
        poolData: { address: poolAddress },
      } = hops[0]
      const limit =
        (amount * (DECIMALS - BigInt(slippage * 10 ** 9))) / DECIMALS
      return await routing.swap(
        amount,
        limit,
        poolAddress,
        srcMintAddress,
        dstMintAddress,
        wallet,
      )
    }
    if (hops.length === 2) {
      const {
        srcMintInfo: { address: srcMintAddress },
        dstMintInfo: { decimals: middleDecimals },
        poolData: { address: firstPoolAddress },
      } = hops[0]
      const {
        dstMintInfo: { address: dstMintAddress },
        poolData: { address: secondPoolAddress },
      } = hops[1]
      const firstLimit =
        (amount * (DECIMALS - BigInt(slippage * 10 ** 9))) / DECIMALS
      const middleAmount = utils.decimalize(
        curve(bidData.amount, hops[1]),
        middleDecimals,
      )
      const secondLimit =
        (middleAmount * (DECIMALS - BigInt(slippage * 10 ** 9))) / DECIMALS
      return await routing.route(
        amount,
        firstLimit,
        firstPoolAddress,
        srcMintAddress,
        secondLimit,
        secondPoolAddress,
        dstMintAddress,
        wallet,
      )
    }
    throw new Error('Invalid swap type')
  }, [hops, bidData, slippage])

  const onSwap = async () => {
    try {
      const { txId } = await swapOrRoute()
      notify({
        type: 'success',
        description: `Swap successfully. Click to view details.`,
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
      return onClose()
    } catch (er) {
      return notify({
        type: 'error',
        description: er.message || 'An error occurred',
      })
    }
  }

  useEffect(() => {
    parseHops()
  }, [parseHops])

  useEffect(() => {
    inferAmmount()
  }, [inferAmmount])

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      closeIcon={<Icon name="close" />}
      footer={null}
      destroyOnClose={true}
      centered={true}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={5}>Review & Swap</Typography.Title>
        </Col>
        {hops.map((hop, index) => (
          <Col span={24} key={index}>
            <Hop bidAmount={bidAmounts[index]} data={hop} />
          </Col>
        ))}
        <Col span={24}>
          <Button type="primary" onClick={onSwap} block>
            Swap
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default Review
