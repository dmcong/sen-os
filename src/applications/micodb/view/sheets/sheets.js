import React from 'react'
import { Row, Col, Tabs } from '@senswap/sen-ui'
import Header from './components/header'
import SheetCard from './components/sheetCard'

const sheets = ['daily-reports', 'summaries', 'pools']
export default function Sheets() {
  return (
    <Tabs style={{ marginTop: -14 }} tabBarExtraContent={<Header></Header>}>
      <Tabs.TabPane key="all" tab="All Tables">
        <Row gutter={[16, 12]} justify="center">
          {sheets.map((name) => {
            return (
              <Col span={24}>
                <SheetCard name={name}></SheetCard>
              </Col>
            )
          })}
        </Row>
      </Tabs.TabPane>
    </Tabs>
  )
}
