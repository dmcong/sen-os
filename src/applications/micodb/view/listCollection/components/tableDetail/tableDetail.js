import { useState } from 'react'
import { Row, Col, Icon, Button, Tabs, Spin } from '@senswap/sen-ui'
import Header from './components/header'
import Documents from './components/documents'
import Schema from './components/schema'
import ListAPI from './components/listAPI'
import { loadCollection } from '@/micodb/controller/collection.controller'
import { useDispatch } from 'react-redux'

function HeaderAction(props) {
  const dispatch = useDispatch()
  const { collection } = props
  const [isLoading, setIsLoading] = useState(false)

  async function handleReload() {
    setIsLoading(true)
    await dispatch(loadCollection({ collectionName: collection, force: true }))
    setIsLoading(false)
  }
  
  return (
    <Row gutter={[8, 8]} justify="end" align="middle" wrap={false}>
      <Col>
        <Button
          type="text"
          shape="circle"
          size="small"
          icon={isLoading ? <Spin size="small" /> : <Icon name="reload" />}
          onClick={() => handleReload()}
        />
      </Col>
    </Row>
  )
}
export default function TableDetail(prop) {
  const { name } = prop
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Header name={name} />
      </Col>
      <Col span={24}>
        <Tabs
          tabBarExtraContent={<HeaderAction collection={name}></HeaderAction>}
        >
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
