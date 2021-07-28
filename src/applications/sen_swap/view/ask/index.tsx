import React, { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import numeral from 'numeral'

import {
  Row,
  Col,
  Input,
  Typography,
  Card,
  Space,
  Tooltip,
  Icon,
} from '@senswap/sen-ui'
import Selection from '@/sen_swap/view/selection'

import { AppDispatch, AppState } from '@/sen_swap/model'
import { SelectionInfo } from '../selection/mintSelection'
import { updateAskData } from '@/sen_swap/controller/ask.controller'

let timeoutId: ReturnType<typeof setTimeout>

const Ask = () => {
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

  // Return data to store
  useEffect(() => {
    dispatch(updateAskData({ amount, accountData, ...selectionInfo }))
  }, [amount, accountData, selectionInfo, dispatch])

  return (
    <Row gutter={[4, 4]}>
      <Col span={24} style={{ fontSize: 11 }}>
        <Typography.Text type="secondary">To</Typography.Text>
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
          <Typography.Text type="secondary">
            Available: {numeral(balance || 0).format('0,0.[00]')}{' '}
            {selectionInfo.mintInfo?.symbol || 'TOKEN'}
          </Typography.Text>
        </Row>
      </Col>
    </Row>
  )
}

export default Ask
