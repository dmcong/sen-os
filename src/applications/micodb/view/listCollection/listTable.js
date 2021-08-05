import { Row, Col, Tabs } from '@senswap/sen-ui'

import { TableCard, HeaderAction } from './components'

const sheets = ['daily-reports', 'summaries', 'pools']

export default function ListTable() {
  return (
    <Tabs
      style={{ marginTop: -14, overflow: 'unset' }}
      tabBarExtraContent={<HeaderAction></HeaderAction>}
    >
      <Tabs.TabPane key="all" tab="All Tables">
        <Row gutter={[16, 12]} justify="center">
          {sheets.map((name) => {
            return (
              <Col span={24}>
                <TableCard name={name}></TableCard>
              </Col>
            )
          })}
        </Row>
      </Tabs.TabPane>
    </Tabs>
  )
}
