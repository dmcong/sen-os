import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import numeral from 'numeral'

import {
  Row,
  Col,
  Input,
  Typography,
  Button,
  Card,
  Tooltip,
  Space,
  Icon,
} from '@senswap/sen-ui'
import Selection from '@/sen_swap/view/selection'

import { AppDispatch, AppState } from '@/sen_swap/model'
import { updateBidData } from '@/sen_swap/controller/bid.controller'
import { SelectionInfo } from '../selection/mintSelection'

let timeoutId: ReturnType<typeof setTimeout>

const Bid = () => {
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')
  const [selectionInfo, setSelectionInfo] = useState<SelectionInfo>({
    pools: [],
  })
  const dispatch = useDispatch<AppDispatch>()
  const accounts = useSelector((state: AppState) => state.accounts)

  // Compute account data
  const accountData = useMemo(() => {
    const { address } = selectionInfo.mintInfo || {}
    return Object.keys(accounts)
      .map((key) => accounts[key])
      .find(({ mint: mintAddress }) => mintAddress === address)
  }, [accounts, selectionInfo])
  // Compute human-readable balance
  const balance = useMemo(() => {
    const { decimals } = selectionInfo.mintInfo || {}
    if (!accountData || !decimals) return 0
    const { amount } = accountData
    return utils.undecimalize(amount, decimals)
  }, [accountData, selectionInfo])

  // Handle errors
  const onError = (er: string) => {
    if (timeoutId) clearTimeout(timeoutId)
    setError(er)
    timeoutId = setTimeout(() => setError(''), 500)
  }
  // Handle amount
  const onAmount = (val: string) => {
    const reg = /^-?\d*(\.\d*)?$/
    if (!reg.test(val)) return onError('Invalid character')
    return setAmount(val)
  }
  // All in :)))
  const onMax = () => onAmount(balance.toString())

  // Return data to store
  useEffect(() => {
    dispatch(updateBidData({ amount, accountData, ...selectionInfo }))
  }, [amount, accountData, selectionInfo, dispatch])

  return (
    <Row gutter={[4, 4]}>
      <Col span={24} style={{ fontSize: 11 }}>
        <Typography.Text type="secondary">From</Typography.Text>
      </Col>
      <Col span={24}>
        <Card bordered={false} bodyStyle={{ padding: 4 }}>
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
              placeholder="0"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onAmount(e.target.value || '')
              }
              prefix={
                <Selection value={selectionInfo} onChange={setSelectionInfo} />
              }
              suffix={
                <Button
                  type="text"
                  size="small"
                  style={{ fontSize: 11, marginRight: -7 }}
                  onClick={onMax}
                >
                  MAX
                </Button>
              }
              bordered={false}
            />
          </Tooltip>
        </Card>
      </Col>
      <Col span={24}>
        <Row gutter={[4, 4]} wrap={false} style={{ fontSize: 11 }}>
          <Col flex="auto">
            <Typography.Text type="secondary">Price:</Typography.Text>
          </Col>
          <Col>
            <Typography.Text type="secondary">
              Available: {numeral(balance || 0).format('0,0.[00]')}{' '}
              {selectionInfo.mintInfo?.symbol || 'TOKEN'}
            </Typography.Text>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default Bid
