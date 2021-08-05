import React from 'react'
import { Row, Col, Icon, Modal, Tabs } from '@senswap/sen-ui'
import Header from './components/header'
import Documents from './components/documents'
import Schema from './components/schema'
import ListAPI from './components/listAPI'

export default function TableDetail(prop) {
  const { name } = prop
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Header name={name} />
      </Col>
      <Col span={24}>
        <Tabs>
          <Tabs.TabPane key="documents" tab="Documents">
            <Documents collectionName={name}></Documents>
          </Tabs.TabPane>
          <Tabs.TabPane key="schema" tab="Schema">
            <Schema collectionName={name}></Schema>
          </Tabs.TabPane>
          <Tabs.TabPane key="api" tab="API">
            <ListAPI collectionName={name}></ListAPI>
          </Tabs.TabPane>
        </Tabs>
      </Col>
    </Row>
  )
}
