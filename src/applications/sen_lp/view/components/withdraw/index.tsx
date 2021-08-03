import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { MintData, utils } from '@senswap/sen-js'

import { Row, Col, Typography, Button } from '@senswap/sen-ui'
import LPT from './lpt'
import Info from './info'

import { AppState } from '@/sen_lp/model'
import { useSenOs } from 'helpers/senos'
import util from 'helpers/util'

const Withdraw = ({
  lptAddress,
  onClose = () => {},
}: {
  lptAddress: string
  onClose?: () => void
}) => {
  const [lpt, setLPT] = useState<bigint>(BigInt(0))
  const [mintLPTData, setMintLPTData] = useState<MintData>()
  const [amounts, setAmounts] = useState<string[]>([])
  const [decimals, setDecimals] = useState<number[]>([0, 0, 0])
  const lpts = useSelector((state: AppState) => state.lpts)
  const pools = useSelector((state: AppState) => state.pools)

  const {
    senos: { notify },
  } = useSenOs()
  const { pool } = lpts[lptAddress]
  const { mint_s, mint_a, mint_b, mint_lpt, reserve_s, reserve_a, reserve_b } =
    pools[pool]
  const mintAddresses = [mint_s, mint_a, mint_b]
  const { supply } = mintLPTData || {}

  const fetchData = useCallback(async () => {
    const { splt } = window.senos
    try {
      const mintLPTData = await splt.getMintData(mint_lpt)
      setMintLPTData(mintLPTData)
    } catch (er) {}
    try {
      const { decimals: decimalsS } = await splt.getMintData(mint_s)
      const { decimals: decimalsA } = await splt.getMintData(mint_a)
      const { decimals: decimalsB } = await splt.getMintData(mint_b)
      setDecimals([decimalsS, decimalsA, decimalsB])
    } catch (er) {}
  }, [mint_s, mint_a, mint_b, mint_lpt])

  const onWithdraw = async () => {
    if (!lpt) return
    const { routing, wallet } = window.senos
    try {
      const { txId } = await routing.removeLiquidity(lpt, pool, wallet)
      onClose()
      return notify({
        type: 'success',
        description: 'Withdraw liquidity successfully. Click to view details.',
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
    } catch (er) {
      return notify({ type: 'error', description: er.message })
    }
  }

  useEffect(() => {
    if (!supply) {
      setAmounts([])
    } else {
      const precision = BigInt(1000000000)
      const ratio = (lpt * precision) / supply
      const deltas = [
        (reserve_s * ratio) / precision,
        (reserve_a * ratio) / precision,
        (reserve_b * ratio) / precision,
      ]
      const amounts = deltas.map((delta, i) =>
        utils.undecimalize(delta, decimals[i]),
      )
      setAmounts(amounts)
    }
  }, [reserve_s, reserve_a, reserve_b, lpt, supply, decimals])
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Withdraw Liquidity</Typography.Title>
      </Col>
      <Col span={24}>
        <LPT lptAddress={lptAddress} onChange={setLPT} />
      </Col>
      <Col span={24}>
        <Info mintAddresses={mintAddresses} amounts={amounts} />
      </Col>
      <Col span={24}>
        <Button type="primary" onClick={onWithdraw} disabled={!lpt} block>
          Withdraw
        </Button>
      </Col>
    </Row>
  )
}

export default Withdraw
