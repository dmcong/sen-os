import { Fragment, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { utils } from '@senswap/sen-js'
import numeral from 'numeral'

import {
  Row,
  Col,
  Card,
  Avatar,
  Tooltip,
  Divider,
  Space,
  Icon,
  Typography,
} from '@senswap/sen-ui'
import PriceChange from '@/sen_wallet/view/components/priceChange'
import Actions from '@/sen_wallet/view/solCard/actions'

import { useSenOs } from 'helpers/senos'
import { getCGK } from '@/sen_wallet/controller/cgk.controller'

const Sol = () => {
  const [visible, setVisible] = useState(false)
  const [icon, setIcon] = useState('#')
  const [price, setPrice] = useState(0)
  const [priceChange, setPriceChange] = useState(0)
  const dispatch = useDispatch()

  const {
    senos: {
      wallet: { lamports },
    },
  } = useSenOs()
  const balance = utils.undecimalize(lamports, 9)
  useEffect(() => {
    ;(async () => {
      const { error, payload } = await dispatch(getCGK('solana'))
      if (error) return
      const {
        solana: { icon, price, priceChange },
      } = payload
      setIcon(icon)
      setPrice(price)
      setPriceChange(priceChange)
    })()
  }, [dispatch])

  return (
    <Fragment>
      <Card
        bodyStyle={{ padding: '8px 12px', cursor: 'pointer' }}
        onClick={() => setVisible(true)}
        bordered={false}
        hoverable
      >
        <Row gutter={[12, 8]} align="middle" wrap={false}>
          <Col flex="auto">
            <Space style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
              <Avatar src={icon} size={22}>
                <Icon name="diamond-outline" />
              </Avatar>
              <Tooltip title={`${balance} SOL`}>
                <Typography.Text>
                  {numeral(balance).format('0,0.[00]')}{' '}
                </Typography.Text>
                <Typography.Text type="secondary">SOL</Typography.Text>
              </Tooltip>
              <Divider type="vertical" style={{ margin: 0 }} />
              <PriceChange value={priceChange} />
              <Typography.Text>${price}</Typography.Text>
            </Space>
          </Col>
          <Col>
            <Icon name="arrow-forward-outline" />
          </Col>
        </Row>
      </Card>
      <Actions visible={visible} onClose={() => setVisible(false)} />
    </Fragment>
  )
}

export default Sol
