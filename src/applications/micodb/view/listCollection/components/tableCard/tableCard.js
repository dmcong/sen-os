import React from 'react'
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
import { TableDetail } from '../../components'
import { openGModal } from '@/micodb/controller/gmodal.controller'
import { loadCollection } from '@/micodb/controller/collection.controller'

export default function SheetCard(props) {
  const { name } = props
  const dispatch = useDispatch()

  return (
    <Fragment>
      <Card
        bodyStyle={{ padding: '8px 12px', cursor: 'pointer' }}
        onClick={() => {
          dispatch(loadCollection({ collectionName: name }))
          dispatch(openGModal({ dom: <TableDetail {...props}></TableDetail> }))
        }}
        bordered={false}
        hoverable
      >
        <Row gutter={[12, 8]} align="middle" wrap={false}>
          <Col flex="auto">
            <Space style={{ fontSize: 11, whiteSpace: 'nowrap' }}>
              <Avatar
                src={''}
                size={22}
                style={{ backgroundColor: '#F9575E', marginRight: 4 }}
              >
                {name.substring(0, 2).toUpperCase()}
              </Avatar>
              <Tooltip title={name}>
                <Typography.Text>{name}</Typography.Text>
              </Tooltip>
            </Space>
          </Col>
          <Col>
            <Icon name="arrow-forward-outline" />
          </Col>
        </Row>
      </Card>
    </Fragment>
  )
}
