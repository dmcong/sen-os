import { useCallback, useMemo, useState } from 'react'
import { utils } from '@senswap/sen-js'
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
import PoolAvatar from '../poolAvatar'
import PoolName from '../poolName'

import { useSelector } from 'react-redux'
import { AppState } from '@/sen_lp/model'

let timeoutId: ReturnType<typeof setTimeout>

/**
 * Single amount input
 */
const LPT = ({
  lptAddress,
  onChange,
}: {
  lptAddress: string
  onChange: (value: bigint) => void
}) => {
  const [lpt, setLPT] = useState('')
  const [error, setError] = useState('')
  const lpts = useSelector((state: AppState) => state.lpts)

  const { amount, pool } = lpts[lptAddress]

  const balance = useMemo(() => {
    if (!amount) return '0'
    return utils.undecimalize(amount, 9) || '0'
  }, [amount])

  const onLPT = useCallback(
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
      setLPT(val)
      // Return amount
      if (!parseFloat(val)) return onChange(BigInt(0))
      return onChange(utils.decimalize(val, 9))
    },
    [balance, onChange],
  )

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
              placeholder="Amount of LPT"
              value={lpt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onLPT(e.target.value || '')
              }
              size="small"
              bordered={false}
              prefix={
                <Space
                  style={{
                    marginLeft: -7,
                    marginRight: 7,
                    fontSize: 11,
                    lineHeight: 1,
                  }}
                >
                  <PoolAvatar poolAddress={pool} size={24} />
                  <Typography.Text>
                    <PoolName poolAddress={pool} />
                  </Typography.Text>
                  <Divider type="vertical" style={{ margin: 0 }} />
                </Space>
              }
              suffix={
                <Button
                  type="text"
                  style={{ marginRight: -7 }}
                  size="small"
                  onClick={() => onLPT(balance)}
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
          Available: {numeral(balance).format('0,0.[0000]')} LPT
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default LPT
