import { Row, Col, Tabs } from '@senswap/sen-ui'
import { useSelector } from 'react-redux'

import { TableCard, HeaderAction } from './components'


export default function ListTable() {
  const listCollection = useSelector(state => state.main.listCollection)
  console.log("listCollection",listCollection)
  return (
    <Tabs
      style={{ marginTop: -14, overflow: 'unset' }}
      tabBarExtraContent={<HeaderAction></HeaderAction>}
    >
      <Tabs.TabPane key="all" tab="All Collection">
        <Row gutter={[16, 12]} justify="center">
          {listCollection.map((collection) => {
            return (
              <Col span={24} key={collection}>
                <TableCard name={collection}></TableCard>
              </Col>
            )
          })}
        </Row>
      </Tabs.TabPane>
    </Tabs>
  )
}
