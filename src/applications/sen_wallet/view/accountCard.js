import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import ssjs from 'senswapjs'
import numeral from 'numeral'

import {
  Row,
  Col,
  Card,
  Avatar,
  Icon,
  Typography,
  Divider,
  Space,
  Button,
} from 'sen-kit'
import PriceChange from '@/sen_wallet/view/components/priceChange'

import { getCGK } from '@/sen_wallet/controller/cgk.controller'
import { getMint } from '@/sen_wallet/controller/mints.controller'

const AccountCard = ({ data, onClick }) => {
  const [icon, setIcon] = useState('#')
  const [price, setPrice] = useState(0)
  const [priceChange, setPriceChange] = useState(0)
  const [decimals, setDecimals] = useState(0)
  const dispatch = useDispatch()

  const { ticket, name, amount, symbol, mint } = data
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

  const onSend = (e) => {
    e.stopPropagation()
    return onClick()
  }

  return (
    <Card bodyStyle={{ padding: `16px 12px` }} bordered={false} hoverable>
      <Row gutter={[12, 16]} align="middle" wrap={false}>
        <Col>
          <Avatar src={icon} size={32}>
            <Icon name="diamond-outline" />
          </Avatar>
        </Col>
        <Col flex="auto">
          <Space direction="vertical" size={0}>
            <Space style={{ whiteSpace: 'nowrap' }}>
              <Typography.Text>
                {numeral(balance).format('0,0.[00]')}{' '}
              </Typography.Text>
              <Typography.Text type="secondary">
                {symbol || 'TOKEN'}
              </Typography.Text>
            </Space>
            <Space style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
              <Typography.Text>{name || mint.substring(0, 6)}</Typography.Text>
              <Divider type="vertical" style={{ margin: 0 }} />
              <PriceChange value={priceChange} />
              <Typography.Text>${price}</Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Button
            type="text"
            className="contained"
            icon={<Icon name="send" />}
            onClick={onSend}
          />
        </Col>
      </Row>
    </Card>
  )
}

AccountCard.defaultProps = {
  onClick: () => {},
}

AccountCard.propTypes = {
  data: PropTypes.object.isRequired,
  onClick: PropTypes.func,
}

export default AccountCard
