import { PoolData, utils } from '@senswap/sen-js'
import { useSelector } from 'react-redux'

import { Row, Col, Modal, Icon, Typography, Button } from '@senswap/sen-ui'
import Hop, { HopData } from './hop'

import { AppState } from '@/sen_swap/model'
import { useCallback, useEffect, useState } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'
import { useSenOs } from 'helpers/senos'
import { curve } from './util'

const Review = ({
  route,
  visible = false,
  onClose = () => {},
}: {
  route: PoolData[]
  visible: boolean
  onClose: () => void
}) => {
  const [hops, setHops] = useState<HopData[]>([])
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)
  const {
    senos: { tokenProvider },
  } = useSenOs()

  const parseHops = useCallback(async () => {
    if (route.length === 1) {
      const amount = utils.decimalize(
        bidData.amount,
        bidData.mintInfo?.decimals || 0,
      )
      const hop: HopData = {
        amount,
        poolData: route[0],
        srcMintInfo: bidData.mintInfo as TokenInfo,
        dstMintInfo: askData.mintInfo as TokenInfo,
      }
      setHops([hop])
    }
    if (route.length === 2) {
      const bidAmount = utils.decimalize(
        bidData.amount,
        bidData.mintInfo?.decimals || 0,
      )
      const middleMintInfo = await tokenProvider.findByAddress(route[0].mint_s)
      const firstHop: HopData = {
        amount: bidAmount,
        poolData: route[0],
        srcMintInfo: bidData.mintInfo as TokenInfo,
        dstMintInfo: middleMintInfo as TokenInfo,
      }
      const middleAmount = curve(firstHop)
      const secondHop: HopData = {
        amount: middleAmount,
        poolData: route[1],
        srcMintInfo: middleMintInfo as TokenInfo,
        dstMintInfo: askData.mintInfo as TokenInfo,
      }
      setHops([firstHop, secondHop])
    }
  }, [route, bidData, askData, tokenProvider])

  useEffect(() => {
    parseHops()
  }, [parseHops])

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
            <Hop data={hop} />
          </Col>
        ))}
        <Col span={24}>
          <Button type="primary" block>
            Swap
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default Review
