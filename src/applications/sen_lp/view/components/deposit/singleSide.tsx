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
import { account, AccountData, MintData, utils } from '@senswap/sen-js'
import { useSenOs } from 'helpers/senos'

let timeoutId: ReturnType<typeof setTimeout>

const SingleSide = ({ poolAddress }: { poolAddress: string }) => {
  const {
    sol: { senAddress },
  } = config
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [activeMintAddress, setActiveMintAddress] = useState(senAddress)
  const [accountData, setAccountData] = useState<AccountData>()
  const [mintData, setMintData] = useState<MintData>()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
  const pools = useSelector((state: AppState) => state.pools)
  const {
    senos: {
      wallet: { address: walletAddress },
      tokenProvider,
    },
  } = useSenOs()

  const { mint_s, mint_a, mint_b } = pools[poolAddress]
  const { symbol } = tokenInfo || {}
  const balance = useMemo(() => {
    const { amount } = accountData || {}
    const { decimals } = mintData || {}
    if (!amount || !decimals) return '0'
    return utils.undecimalize(amount, decimals) || '0'
  }, [accountData, mintData])

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
  const onDeposit = () => {
    console.log(amount)
  }

  useEffect(() => {
    ;(async () => {
      const { splt } = window.senos
      const associatedAddress = await account.deriveAssociatedAddress(
        walletAddress,
        activeMintAddress,
        splt.spltProgramId.toBase58(),
        splt.splataProgramId.toBase58(),
      )
      const accountData = await splt.getAccountData(associatedAddress)
      const mintData = await splt.getMintData(activeMintAddress)
      const tokenInfo = await tokenProvider.findByAddress(activeMintAddress)
      setAccountData(accountData)
      setMintData(mintData)
      setTokenInfo(tokenInfo)
    })()
  }, [activeMintAddress, tokenProvider])

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
            <Space style={{ fontSize: 11 }}>
              <Typography.Text type="secondary">Available:</Typography.Text>
              <Typography.Text>
                {numeral(balance).format('0,0.[0000]')} {symbol || 'TOKEN'}
              </Typography.Text>
            </Space>
          </Col>
        </Row>
      </Col>
      <Col span={24} style={{ height: 8 }} />
      <Col span={24}>
        <Button type="primary" onClick={onDeposit} disabled={!amount} block>
          Deposit
        </Button>
      </Col>
    </Row>
  )
}

export default SingleSide
