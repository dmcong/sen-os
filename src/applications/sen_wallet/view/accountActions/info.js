import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import ssjs from 'senswapjs'
import numeral from 'numeral'

import {
  Row,
  Col,
  Card,
  Typography,
  Icon,
  Space,
  Divider,
  Avatar,
} from 'sen-kit'
import PriceChange from '@/sen_wallet/view/components/priceChange'

import { getCGK } from '@/sen_wallet/controller/cgk.controller'
import { getMint } from '@/sen_wallet/controller/mints.controller'

const Info = ({ accountData, reset }) => {
  const [icon, setIcon] = useState('#')
  const [price, setPrice] = useState(0)
  const [priceChange, setPriceChange] = useState(0)
  const [decimals, setDecimals] = useState(0)
  const dispatch = useDispatch()

  const { mint, amount, ticket, symbol } = accountData
  const balance = ssjs.undecimalize(amount, decimals)
  useEffect(() => {
    ;(async () => {
      const { error, payload } = await dispatch(getMint({ address: mint }))
      if (error) return
      const {
        [mint]: { decimals },
      } = payload
      setDecimals(decimals)
    })()
  }, [dispatch, mint])
  useEffect(() => {
    ;(async () => {
      const { error, payload } = await dispatch(getCGK(ticket))
      if (error) return
      const {
        [ticket]: { icon, price, priceChange },
      } = payload
      setIcon(icon)
      setPrice(price)
      setPriceChange(priceChange)
    })()
  }, [ticket, dispatch])
  useEffect(() => {
    return () => {
      setIcon('#')
      setPrice(0)
      setPriceChange(0)
      setDecimals(0)
    }
  }, [reset])

  return (
    <Card bordered={false}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Text type="secondary" style={{ margin: 0 }}>
            Your Balance
          </Typography.Text>
        </Col>
        <Col span={24}>
          <Space size={12}>
            <Typography.Title level={3} style={{ margin: 0 }}>
              {numeral(balance).format('0,0.[0000]')}
            </Typography.Title>
            <Avatar size={20} src={icon}>
              <Icon name="diamond-outline" />
            </Avatar>
            <Typography.Title level={3} type="secondary" style={{ margin: 0 }}>
              {symbol || 'TOKEN'}
            </Typography.Title>
          </Space>
        </Col>
        <Col span={24}>
          <Space>
            <PriceChange value={priceChange} />
            <Divider type="vertical" />
            <Typography.Text>${price}</Typography.Text>
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

Info.defaultProps = {
  reset: false,
  accountData: {},
}

Info.propTypes = {
  reset: PropTypes.bool,
  accountData: PropTypes.object,
}

export default Info
