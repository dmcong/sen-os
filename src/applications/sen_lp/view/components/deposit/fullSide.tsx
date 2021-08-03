import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { account, MintData, Swap, utils } from '@senswap/sen-js'

import { Row, Col, Button } from '@senswap/sen-ui'
import LPT from './lpt'
import Amount from '../amount'

import { useSenOs } from 'helpers/senos'
import util from 'helpers/util'
import { AppState } from '@/sen_lp/model'

/**
 * Main
 */
const FullSide = ({
  poolAddress,
  onClose = () => {},
}: {
  poolAddress: string
  onClose?: () => void
}) => {
  const [amounts, setAmounts] = useState<bigint[]>([])
  const [lpt, setLPT] = useState('')
  const [mintLPTData, setMintLPTData] = useState<MintData>()
  const pools = useSelector((state: AppState) => state.pools)

  const {
    senos: {
      wallet: { address: walletAddress },
      notify,
    },
  } = useSenOs()
  const { mint_s, mint_a, mint_b, reserve_s, reserve_a, reserve_b, mint_lpt } =
    pools[poolAddress]
  const mintAddresses = [mint_s, mint_a, mint_b]
  const { supply: reserve_lpt } = mintLPTData || {}

  const onAmounts = (i: number, amount: bigint) => {
    let newAmounts = [...amounts]
    newAmounts[i] = amount
    return setAmounts(newAmounts)
  }

  const fetchData = useCallback(async () => {
    const { splt } = window.senos
    try {
      const mintLPTData = await splt.getMintData(mint_lpt)
      setMintLPTData(mintLPTData)
    } catch (er) {}
  }, [mint_lpt])

  const isValid = useMemo(() => {
    for (const amount of amounts) if (amount) return true
    return false
  }, [amounts])

  const extractSrcAddresses = useCallback(async () => {
    return await Promise.all(
      [mint_s, mint_a, mint_b].map((mintAddress) =>
        account.deriveAssociatedAddress(walletAddress, mintAddress),
      ),
    )
  }, [mint_s, mint_a, mint_b, walletAddress])

  const estimateLPT = useCallback(() => {
    if (!isValid || !reserve_lpt) return setLPT('')
    const { lpt } = Swap.oracle.rake(
      amounts[0] || BigInt(0),
      amounts[1] || BigInt(0),
      amounts[2] || BigInt(0),
      reserve_s,
      reserve_b,
      reserve_a,
      reserve_lpt,
    )
    return setLPT(utils.undecimalize(lpt, 9))
  }, [isValid, amounts, reserve_s, reserve_b, reserve_a, reserve_lpt])

  const onDeposit = async () => {
    if (!isValid) return setLPT('')
    const { swap, wallet } = window.senos
    const [srcSAddress, srcAAddress, srcBAddress] = await extractSrcAddresses()
    try {
      const { txId } = await swap.addLiquidity(
        amounts[0] || BigInt(0),
        amounts[1] || BigInt(0),
        amounts[2] || BigInt(0),
        poolAddress,
        srcSAddress,
        srcAAddress,
        srcBAddress,
        wallet,
      )
      onClose()
      return notify({
        type: 'success',
        description: 'Deposit liquidity successfully. Click to view details.',
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
    } catch (er) {
      return notify({ type: 'error', description: er.message })
    }
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])
  useEffect(() => {
    estimateLPT()
  }, [estimateLPT])

  return (
    <Row gutter={[16, 16]}>
      {mintAddresses.map((mintAddress, i) => (
        <Col key={i} span={24}>
          <Amount
            mintAddress={mintAddress}
            onChange={(amount) => onAmounts(i, amount)}
          />
        </Col>
      ))}
      <Col span={24}>
        <LPT value={lpt} />
      </Col>
      <Col span={24}>
        <Button type="primary" onClick={onDeposit} disabled={!isValid} block>
          Deposit
        </Button>
      </Col>
    </Row>
  )
}

export default FullSide
