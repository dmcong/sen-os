import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { Row, Col, Divider, Icon, Button } from '@senswap/sen-ui'
import NewCollection from '@/micodb/view/newCollection'

import { disconnectDatabase } from '@/micodb/controller/main.controller'


export default function Header() {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Row gutter={[8, 8]} justify="end" align="middle" wrap={false}>
      <NewCollection isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Col>
        <Button
          type="primary"
          size="small"
          icon={<Icon name="add-outline" />}
          onClick={() => setIsOpen(true)}
        >
          New
        </Button>
      </Col>

      <Col>
        <Divider type="vertical" style={{ margin: 0, padding: 0 }} />
        <Button
          type="text"
          shape="circle"
          size="small"
          icon={<Icon name="power" />}
          onClick={() => dispatch(disconnectDatabase())}
        />
      </Col>
    </Row>
  )
}
