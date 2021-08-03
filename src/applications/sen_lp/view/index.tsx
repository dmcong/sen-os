import { Row, Col, Tabs } from '@senswap/sen-ui'

import PoolWatcher from './poolWatcher'
import LptWatcher from './lptWatcher'
import AllPools from './allPools'
import MyPools from './myPools'
import NewPool from './newPool'

const View = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Tabs style={{ marginTop: -14 }} tabBarExtraContent={<NewPool />}>
          <Tabs.TabPane key="all" tab="All Pools">
            <AllPools />
          </Tabs.TabPane>
          <Tabs.TabPane key="my-pools" tab="My Pools">
            <MyPools />
          </Tabs.TabPane>
        </Tabs>
      </Col>
      <Col span={24} />
      <PoolWatcher />
      <LptWatcher />
    </Row>
  )
}

export default View
