import { useCallback, useEffect, useMemo, useState } from 'react'
import numeral from 'numeral'
import { TokenInfo } from '@solana/spl-token-registry'
import { account, AccountData, MintData, utils } from '@senswap/sen-js'

import { Row, Col, Card, Select, Typography, Icon } from '@senswap/sen-ui'
import MintAvatar from './mintAvatar'

import { useSenOs } from 'helpers/senos'
import { useSelector } from 'react-redux'
import { AppState } from '../model'

const Mint = ({
  mintAddresses,
  value = 'Select',
  onChange,
}: {
  mintAddresses: string[]
  value?: string
  onChange: (mintAddress: string) => void
}) => {
  const [accountData, setAccountData] = useState<AccountData>()
  const [mintData, setMintData] = useState<MintData>()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
  const {
    main: { address: payerAddress },
  } = useSelector((state: AppState) => state)
  const {
    senos: { tokenProvider },
  } = useSenOs()

  const { symbol, name } = tokenInfo || {}
  const { decimals } = mintData || {}

  const balance = useMemo(() => {
    const { amount } = accountData || {}
    if (!amount || !decimals) return '0'
    return utils.undecimalize(amount, decimals) || '0'
  }, [accountData, decimals])

  const fetchData = useCallback(async () => {
    const { splt } = window.senos
    if (!value || !account.isAddress(value)) {
      setAccountData(undefined)
      setMintData(undefined)
      setTokenInfo(undefined)
    } else {
      try {
        const associatedAddress = await account.deriveAssociatedAddress(
          payerAddress,
          value,
          splt.spltProgramId.toBase58(),
          splt.splataProgramId.toBase58(),
        )
        const accountData = await splt.getAccountData(associatedAddress)
        setAccountData(accountData)
      } catch (er) {}
      try {
        const mintData = await splt.getMintData(value)
        setMintData(mintData)
      } catch (er) {}
      try {
        const tokenInfo = await tokenProvider.findByAddress(value)
        setTokenInfo(tokenInfo)
      } catch (er) {}
    }
  }, [value, tokenProvider, payerAddress])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Row gutter={[4, 4]}>
      <Col span={24}>
        <Card bodyStyle={{ padding: 8 }} bordered={false}>
          <Row gutter={[4, 4]} wrap={false}>
            <Col>
              <Select
                onChange={onChange}
                value={value}
                bordered={false}
                suffixIcon={<Icon name="chevron-down-outline" />}
                size="small"
                style={{ marginLeft: -4 }}
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
              <Typography.Text>{name ? '10' : '0'}</Typography.Text>
            </Col>
            <Col>
              <Typography.Text type="secondary">{name || ''}</Typography.Text>
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

export default Mint
