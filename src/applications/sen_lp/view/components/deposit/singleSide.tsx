import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import numeral from 'numeral'
import { TokenInfo } from '@solana/spl-token-registry'

import {
  Row,
  Col,
  Input,
  Card,
  Select,
  Button,
  Space,
  Typography,
  Icon,
  Tooltip,
} from '@senswap/sen-ui'
import MintAvatar from '@/sen_lp/view/components/mintAvatar'

import config from '@/sen_lp/config'
import { AppState } from '@/sen_lp/model'
import { account, AccountData, MintData, Swap, utils } from '@senswap/sen-js'
import { useSenOs } from 'helpers/senos'
import LPT from './lpt'
import util from 'helpers/util'

let timeoutId: ReturnType<typeof setTimeout>

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
  const [amount, setAmount] = useState('')
  const [lpt, setLPT] = useState('')
  const [error, setError] = useState('')
  const [activeMintAddress, setActiveMintAddress] = useState(senAddress)
  const [accountData, setAccountData] = useState<AccountData>()
  const [mintData, setMintData] = useState<MintData>()
  const [mintLPTData, setMintLPTData] = useState<MintData>()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
  const pools = useSelector((state: AppState) => state.pools)
  const {
    senos: {
      wallet: { address: walletAddress },
      tokenProvider,
      notify,
    },
  } = useSenOs()

  const { mint_s, mint_a, mint_b, reserve_s, reserve_a, reserve_b, mint_lpt } =
    pools[poolAddress]
  const { symbol } = tokenInfo || {}
  const { decimals } = mintData || {}
  const { supply: reserve_lpt } = mintLPTData || {}

  const balance = useMemo(() => {
    const { amount } = accountData || {}
    if (!amount || !decimals) return '0'
    return utils.undecimalize(amount, decimals) || '0'
  }, [accountData, decimals])

  const onAmount = useCallback(
    (val: string) => {
      const onError = (er: string) => {
        if (timeoutId) clearTimeout(timeoutId)
        setError(er)
        timeoutId = setTimeout(() => setError(''), 500)
      }
      const reg = /^\d*(\.\d*)?$/
      if (!reg.test(val)) return onError('Invalid character')
      if (parseFloat(val) > parseFloat(balance))
        return onError('Not enough balance')
      return setAmount(val)
    },
    [balance],
  )

  const fetchData = useCallback(async () => {
    const { splt } = window.senos
    try {
      const associatedAddress = await account.deriveAssociatedAddress(
        walletAddress,
        activeMintAddress,
        splt.spltProgramId.toBase58(),
        splt.splataProgramId.toBase58(),
      )
      const accountData = await splt.getAccountData(associatedAddress)
      setAccountData(accountData)
    } catch (er) {}
    try {
      const mintData = await splt.getMintData(activeMintAddress)
      setMintData(mintData)
    } catch (er) {}
    try {
      const tokenInfo = await tokenProvider.findByAddress(activeMintAddress)
      setTokenInfo(tokenInfo)
    } catch (er) {}
    try {
      const mintLPTData = await splt.getMintData(mint_lpt)
      setMintLPTData(mintLPTData)
    } catch (er) {}
  }, [activeMintAddress, tokenProvider, mint_lpt, walletAddress])

  const extractDeltas = useCallback(() => {
    let deltaS = BigInt(0)
    let deltaA = BigInt(0)
    let deltaB = BigInt(0)
    if (!amount || !decimals) return [deltaS, deltaA, deltaB]
    if (activeMintAddress === mint_s)
      deltaS = utils.decimalize(amount, decimals)
    else if (activeMintAddress === mint_a)
      deltaA = utils.decimalize(amount, decimals)
    else if (activeMintAddress === mint_b)
      deltaB = utils.decimalize(amount, decimals)
    return [deltaS, deltaA, deltaB]
  }, [mint_s, mint_a, mint_b, activeMintAddress, amount, decimals])

  const extractSrcAddresses = useCallback(async () => {
    const { splt } = window.senos
    return await Promise.all(
      [mint_s, mint_a, mint_b].map((mintAddress) =>
        account.deriveAssociatedAddress(
          walletAddress,
          mintAddress,
          splt.spltProgramId.toBase58(),
          splt.splataProgramId.toBase58(),
        ),
      ),
    )
  }, [mint_s, mint_a, mint_b, walletAddress])

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
    const { swap, wallet } = window.senos
    const [srcSAddress, srcAAddress, srcBAddress] = await extractSrcAddresses()
    try {
      const { txId } = await swap.addLiquidity(
        deltaS,
        deltaA,
        deltaB,
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
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Card bodyStyle={{ padding: 8 }} bordered={false}>
          <Tooltip
            title={
              <Space>
                <Icon name="warning" />
                {error}
              </Space>
            }
            visible={error}
          >
            <Input
              placeholder="Amount"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onAmount(e.target.value || '')
              }
              size="small"
              bordered={false}
              prefix={
                <Select
                  style={{ marginLeft: -16, marginRight: 7, width: 110 }}
                  onChange={setActiveMintAddress}
                  value={activeMintAddress}
                  bordered={false}
                  suffixIcon={<Icon name="chevron-down-outline" />}
                  size="small"
                >
                  <Select.Option value={mint_s}>
                    <MintAvatar mintAddress={mint_s} />
                  </Select.Option>
                  <Select.Option value={mint_a}>
                    <MintAvatar mintAddress={mint_a} />
                  </Select.Option>
                  <Select.Option value={mint_b}>
                    <MintAvatar mintAddress={mint_b} />
                  </Select.Option>
                </Select>
              }
              suffix={
                <Button
                  type="text"
                  style={{ marginRight: -7 }}
                  size="small"
                  onClick={() => onAmount(balance)}
                >
                  MAX
                </Button>
              }
            />
          </Tooltip>
        </Card>
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]} justify="end">
          <Col>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              Available: {numeral(balance).format('0,0.[0000]')}{' '}
              {symbol || 'TOKEN'}
            </Typography.Text>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <LPT value={lpt} />
      </Col>
      <Col span={24} style={{ height: 8 }} />
      <Col span={24}>
        <Button type="primary" onClick={onDeposit} disabled={!lpt} block>
          Deposit
        </Button>
      </Col>
    </Row>
  )
}

export default SingleSide
