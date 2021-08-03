import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { Row, Col, Button } from '@senswap/sen-ui'
import AmountSelect from '../amountSelect'

import config from '@/sen_lp/config'
import { AppState } from '@/sen_lp/model'
import { MintData, Swap, utils } from '@senswap/sen-js'
import { useSenOs } from 'helpers/senos'
import LPT from './lpt'
import util from 'helpers/util'

const SingleSide = ({
  poolAddress,
  onClose = () => {},
}: {
  poolAddress: string
  onClose?: () => void
}) => {
  const {
    sol: { senAddress },
  } = config
  const [amount, setAmount] = useState(BigInt(0))
  const [lpt, setLPT] = useState('')
  const [activeMintAddress, setActiveMintAddress] = useState(senAddress)
  const [mintData, setMintData] = useState<MintData>()
  const [mintLPTData, setMintLPTData] = useState<MintData>()
  const pools = useSelector((state: AppState) => state.pools)
  const {
    senos: { notify },
  } = useSenOs()

  const { mint_s, mint_a, mint_b, reserve_s, reserve_a, reserve_b, mint_lpt } =
    pools[poolAddress]
  const { decimals } = mintData || {}
  const { supply: reserve_lpt } = mintLPTData || {}

  const onData = ({
    amount,
    mintAddress,
  }: {
    amount: bigint
    mintAddress: string
  }) => {
    setAmount(amount)
    setActiveMintAddress(mintAddress)
  }

  const fetchData = useCallback(async () => {
    const { splt } = window.senos
    try {
      const mintData = await splt.getMintData(activeMintAddress)
      setMintData(mintData)
    } catch (er) {}
    try {
      const mintLPTData = await splt.getMintData(mint_lpt)
      setMintLPTData(mintLPTData)
    } catch (er) {}
  }, [activeMintAddress, mint_lpt])

  const extractDeltas = useCallback(() => {
    let deltaS = BigInt(0)
    let deltaA = BigInt(0)
    let deltaB = BigInt(0)
    if (!amount || !decimals) return [deltaS, deltaA, deltaB]
    if (activeMintAddress === mint_s) deltaS = amount
    else if (activeMintAddress === mint_a) deltaA = amount
    else if (activeMintAddress === mint_b) deltaB = amount
    return [deltaS, deltaA, deltaB]
  }, [mint_s, mint_a, mint_b, activeMintAddress, amount, decimals])

  const estimateLPT = useCallback(() => {
    if (!amount || !decimals || !reserve_lpt) return setLPT('')
    const [deltaS, deltaA, deltaB] = extractDeltas()
    const { lpt } = Swap.oracle.rake(
      deltaS,
      deltaA,
      deltaB,
      reserve_s,
      reserve_b,
      reserve_a,
      reserve_lpt,
    )
    return setLPT(utils.undecimalize(lpt, 9))
  }, [
    amount,
    decimals,
    reserve_s,
    reserve_b,
    reserve_a,
    reserve_lpt,
    extractDeltas,
  ])

  const onDeposit = async () => {
    if (!amount || !decimals || !reserve_lpt) return setLPT('')
    const [deltaS, deltaA, deltaB] = extractDeltas()
    const { routing, wallet } = window.senos
    try {
      const { txId } = await routing.addLiquidity(
        deltaS,
        deltaA,
        deltaB,
        poolAddress,
        wallet,
      )
      onClose()
      return notify({
        type: 'success',
        description: 'Deposit liquidity successfully. Click to view details.',
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
    } catch (er) {
      return notify({
        type: 'error',
        description: er.message,
      })
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
      <Col span={24}>
        <AmountSelect
          mintAddresses={[mint_s, mint_a, mint_b]}
          onChange={onData}
        />
      </Col>
      <Col span={24}>
        <LPT value={lpt} />
      </Col>
      <Col span={24}>
        <Button type="primary" onClick={onDeposit} disabled={!lpt} block>
          Deposit
        </Button>
      </Col>
    </Row>
  )
}

export default SingleSide
