import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'
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
import { useSenOs } from 'helpers/senos'

let timeoutId: ReturnType<typeof setTimeout>

const Bid = () => {
  const [error, setError] = useState('')
  const dispatch = useDispatch<AppDispatch>()
  const bidData = useSelector((state: AppState) => state.bid)
  const settings = useSelector((state: AppState) => state.settings)

  const {
    senos: { accounts },
  } = useSenOs()

  // Compoute selection info
  const selectionInfo: SelectionInfo = useMemo(
    () => ({
      mintInfo: bidData.mintInfo,
      poolAddress: bidData.poolAddress,
      poolAddresses: bidData.poolAddresses,
    }),
    [bidData],
  )
  // Compute human-readable balance
  const balance = useMemo((): string => {
    if (!account.isAddress(bidData.accountAddress)) return '0'
    const accountAddress = bidData.accountAddress as string
    const { amount } = accounts[accountAddress] || {}
    const { decimals } = bidData.mintInfo || {}
    if (!amount || !decimals) return '0'
    return utils.undecimalize(amount, decimals)
  }, [accounts, bidData.accountAddress, bidData.mintInfo])
  // Handle amount
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
      return dispatch(updateBidData({ amount: val, prioritized: true }))
    },
    [balance, dispatch],
  )
  // All in :)))
  const onMax = () => onAmount(balance.toString())
  // Update bid data
  const onSelectionInfo = (val: SelectionInfo) => {
    const { address } = val.mintInfo || {}
    const accountAddress = Object.keys(accounts).find(
      (key) => accounts[key].mint === address,
    )
    dispatch(updateBidData({ accountAddress, ...val }))
  }

  useEffect(() => {
    if (!settings.advanced) dispatch(updateBidData({ poolAddress: undefined }))
  }, [settings, dispatch])

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
              value={bidData.amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onAmount(e.target.value || '')
              }
              prefix={
                <Selection value={selectionInfo} onChange={onSelectionInfo} />
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

export default Bid
