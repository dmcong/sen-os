import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'
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
import { useSenOs } from 'helpers/senos'

let timeoutId: ReturnType<typeof setTimeout>

const Ask = () => {
  const [error, setError] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const askData = useSelector((state: AppState) => state.ask)
  const settings = useSelector((state: AppState) => state.settings)

  const {
    senos: { accounts },
  } = useSenOs()

  // Compoute selection info
  const selectionInfo: SelectionInfo = useMemo(
    () => ({
      mintInfo: askData.mintInfo,
      poolAddress: askData.poolAddress,
      poolAddresses: askData.poolAddresses,
    }),
    [askData],
  )
  // Compute human-readable balance
  const balance = useMemo((): string => {
    if (!account.isAddress(askData.accountAddress)) return '0'
    const accountAddress = askData.accountAddress as string
    const { amount } = accounts[accountAddress] || {}
    const { decimals } = askData.mintInfo || {}
    if (!amount || !decimals) return '0'
    return utils.undecimalize(amount, decimals)
  }, [accounts, askData])
  // Handle amount
  const onAmount = (val: string) => {
    const onError = (er: string) => {
      if (timeoutId) clearTimeout(timeoutId)
      setError(er)
      timeoutId = setTimeout(() => setError(''), 500)
    }
    const reg = /^\d*(\.\d*)?$/
    if (!reg.test(val)) return onError('Invalid character')
    return dispatch(updateAskData({ amount: val, prioritized: true }))
  }
  // Update ask data
  const onSelectionInfo = (selectionInfo: SelectionInfo) => {
    // Compute account data
    const { address } = selectionInfo.mintInfo || {}
    const accountAddress = Object.keys(accounts).find(
      (key) => accounts[key].mint === address,
    )
    dispatch(updateAskData({ accountAddress, ...selectionInfo }))
  }

  useEffect(() => {
    if (!settings.advanced) dispatch(updateAskData({ poolAddress: undefined }))
  }, [settings, dispatch])

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
              value={askData.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onAmount(e.target.value || '')
              }
              prefix={
                <Selection value={selectionInfo} onChange={onSelectionInfo} />
              }
              bordered={false}
            />
          </Tooltip>
        </Card>
      </Col>
      <Col span={24}>
        <Row gutter={[4, 4]} justify="end" style={{ fontSize: 11 }}>
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

export default Ask
