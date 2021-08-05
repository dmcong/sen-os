import { useCallback, useEffect, useMemo, useState } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'
import { account, AccountData, MintData, utils } from '@senswap/sen-js'
import numeral from 'numeral'

import {
  Row,
  Col,
  Input,
  Card,
  Typography,
  Tooltip,
  Space,
  Icon,
  Button,
  Divider,
} from '@senswap/sen-ui'

import { useSenOs } from 'helpers/senos'
import MintAvatar from './mintAvatar'

let timeoutId: ReturnType<typeof setTimeout>

/**
 * Single amount input
 */
const Amount = ({
  mintAddress,
  onChange,
}: {
  mintAddress: string
  onChange: (value: bigint) => void
}) => {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [accountData, setAccountData] = useState<AccountData>()
  const [mintData, setMintData] = useState<MintData>()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()

  const {
    senos: {
      wallet: { address: walletAddress },
      tokenProvider,
    },
  } = useSenOs()

  const { decimals } = mintData || {}
  const { symbol } = tokenInfo || {}

  const balance = useMemo(() => {
    const { amount } = accountData || {}
    if (!amount || !decimals) return '0'
    return utils.undecimalize(amount, decimals) || '0'
  }, [accountData, decimals])

  const onAmount = useCallback(
    async (val: string) => {
      const onError = (er: string) => {
        if (timeoutId) clearTimeout(timeoutId)
        setError(er)
        timeoutId = setTimeout(() => setError(''), 500)
      }
      const reg = /^\d*(\.\d*)?$/
      if (!reg.test(val)) return onError('Invalid character')
      if (parseFloat(val) > parseFloat(balance))
        return onError('Not enough balance')
      setAmount(val)
      // Return amount
      if (!decimals || !parseFloat(val)) return onChange(BigInt(0))
      return onChange(utils.decimalize(val, decimals))
    },
    [balance, decimals, onChange],
  )

  const fetchData = useCallback(async () => {
    const { splt } = window.senos
    try {
      const associatedAddress = await account.deriveAssociatedAddress(
        walletAddress,
        mintAddress,
        splt.spltProgramId.toBase58(),
        splt.splataProgramId.toBase58(),
      )
      const accountData = await splt.getAccountData(associatedAddress)
      setAccountData(accountData)
    } catch (er) {}
    try {
      const mintData = await splt.getMintData(mintAddress)
      setMintData(mintData)
    } catch (er) {}
    try {
      const tokenInfo = await tokenProvider.findByAddress(mintAddress)
      setTokenInfo(tokenInfo)
    } catch (er) {}
  }, [mintAddress, tokenProvider, walletAddress])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Row gutter={[4, 4]} justify="end">
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
              placeholder={`Amount of ${symbol || 'TOKEN'}`}
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onAmount(e.target.value || '')
              }
              size="small"
              bordered={false}
              prefix={
                <Space
                  style={{ marginLeft: -4, marginRight: 7, lineHeight: 1 }}
                >
                  <MintAvatar mintAddress={mintAddress} />
                  <Divider type="vertical" style={{ margin: 0 }} />
                </Space>
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
      <Col>
        <Typography.Text style={{ fontSize: 11 }} type="secondary">
          Available: {numeral(balance).format('0,0.[0000]')} {symbol || 'TOKEN'}
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default Amount
