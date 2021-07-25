import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { utils, DEFAULT_EMPTY_ADDRESS } from '@senswap/sen-js'
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
} from '@senswap/sen-ui'
import PriceChange from '@/sen_wallet/view/components/priceChange'

import { getCGK } from '@/sen_wallet/controller/cgk.controller'
import { getMint } from '@/sen_wallet/controller/mints.controller'

const Info = ({ data }) => {
  const [price, setPrice] = useState(0)
  const [priceChange, setPriceChange] = useState(0)
  const [decimals, setDecimals] = useState(0)
  const dispatch = useDispatch()

  const { logoURI, symbol, extensions, mint, amount } = data
  const balance = utils.undecimalize(amount, decimals)

  useEffect(() => {
    ;(async () => {
      if (mint === DEFAULT_EMPTY_ADDRESS) return setDecimals(9)
      const { error, payload } = await dispatch(getMint({ address: mint }))
      if (error) return setDecimals(0)
      const {
        [mint]: { decimals },
      } = payload
      setDecimals(decimals)
    })()
  }, [dispatch, mint])
  useEffect(() => {
    ;(async () => {
      const ticket = extensions?.coingeckoId
      if (!ticket) return
      const { error, payload } = await dispatch(getCGK(ticket))
      if (error) return
      const {
        [ticket]: { price, priceChange },
      } = payload
      setPrice(price)
      setPriceChange(priceChange)
    })()
  }, [extensions, dispatch])

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
            <Avatar size={20} src={logoURI}>
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
  data: {},
}

Info.propTypes = {
  data: PropTypes.object,
}

export default Info
