import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { utils } from '@senswap/sen-js'
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
} from '@senswap/sen-ui'
import PriceChange from '@/sen_wallet/view/components/priceChange'

import { getCGK } from '@/sen_wallet/controller/cgk.controller'
import { getMint } from '@/sen_wallet/controller/mints.controller'

const AccountCard = ({ data, onClick }) => {
  const [price, setPrice] = useState(0)
  const [priceChange, setPriceChange] = useState(0)
  const [decimals, setDecimals] = useState(0)
  const dispatch = useDispatch()

  const { logoURI, extensions, name, amount, symbol, mint } = data
  const balance = utils.undecimalize(amount, decimals)
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

  const onSend = (e) => {
    e.stopPropagation()
    return onClick()
  }

  return (
    <Card bodyStyle={{ padding: `16px 12px` }} bordered={false} hoverable>
      <Row gutter={[12, 16]} align="middle" wrap={false}>
        <Col>
          <Avatar src={logoURI} size={32}>
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
              <Typography.Text>
                ${numeral(price).format('0,0.[000]')}
              </Typography.Text>
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
