import { useCallback, useEffect, useMemo, useState } from 'react'
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
  Divider,
} from '@senswap/sen-ui'
import MintAvatar from '@/sen_lp/view/components/mintAvatar'

import { account, AccountData, MintData, utils } from '@senswap/sen-js'
import { useSenOs } from 'helpers/senos'

let timeoutId: ReturnType<typeof setTimeout>

const AmountSelect = ({
  mintAddresses,
  onChange,
  defaultMintAddress,
}: {
  mintAddresses: string[]
  onChange: ({
    amount,
    mintAddress,
  }: {
    amount: bigint
    mintAddress: string
  }) => void
  defaultMintAddress?: string
}) => {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [activeMintAddress, setActiveMintAddress] = useState<string>(
    defaultMintAddress || 'Select',
  )
  const [accountData, setAccountData] = useState<AccountData>()
  const [mintData, setMintData] = useState<MintData>()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
  const {
    senos: {
      wallet: { address: walletAddress },
      tokenProvider,
    },
  } = useSenOs()

  const { symbol } = tokenInfo || {}
  const { decimals } = mintData || {}

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
      await setAmount(val)
      // Return amount
      if (!activeMintAddress || !account.isAddress(activeMintAddress)) return
      if (!decimals || !parseFloat(val))
        return onChange({ amount: BigInt(0), mintAddress: activeMintAddress })
      return onChange({
        amount: utils.decimalize(val, decimals),
        mintAddress: activeMintAddress,
      })
    },
    [balance, onChange, decimals, activeMintAddress],
  )

  const onSelect = useCallback(
    async (mintAddress) => {
      await setActiveMintAddress(mintAddress)
      // Return amount
      if (!decimals || !parseFloat(amount))
        return onChange({ amount: BigInt(0), mintAddress })
      return onChange({
        amount: utils.decimalize(amount, decimals),
        mintAddress,
      })
    },
    [onChange, decimals, amount],
  )

  const fetchData = useCallback(async () => {
    const { splt } = window.senos
    if (!activeMintAddress || !account.isAddress(activeMintAddress)) {
      setAccountData(undefined)
      setMintData(undefined)
      setTokenInfo(undefined)
    } else {
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
    }
  }, [activeMintAddress, tokenProvider, walletAddress])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Row gutter={[4, 4]}>
      <Col span={24}>
        <Card bodyStyle={{ padding: 8 }} bordered={false}>
          <Row gutter={[0, 0]} wrap={false}>
            <Col>
              <Select
                onChange={onSelect}
                value={activeMintAddress || ''}
                bordered={false}
                suffixIcon={<Divider type="vertical" style={{ margin: 0 }} />}
                size="small"
                style={{ marginLeft: -4, marginRight: -12 }}
              >
                <Select.Option value={'Select'}>
                  <MintAvatar
                    mintAddress={'Select'}
                    icon={<Icon name="help-outline" />}
                  />
                </Select.Option>
                {mintAddresses.map((mintAddress, i) => (
                  <Select.Option key={mintAddress + i} value={mintAddress}>
                    <MintAvatar mintAddress={mintAddress} />
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col flex="auto">
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
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Row gutter={[4, 4]} justify="end">
          <Col>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              Available: {numeral(balance).format('0,0.[0000]')}{' '}
              {symbol || 'TOKEN'}
            </Typography.Text>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default AmountSelect
