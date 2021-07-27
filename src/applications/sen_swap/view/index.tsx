import { Row, Col, Button, Icon } from '@senswap/sen-ui'
import AccountWatcher from './accountWatcher'
import PoolWatcher from './poolWatcher'
import Bid from './bid'
import Ask from './ask'
import { useState } from 'react'

const View = () => {
  const [bidValue, setBidValue] = useState({ amount: '' })
  const [askValue, setAskValue] = useState('')

  console.log(bidValue)

  return (
    <Row gutter={[8, 12]} justify="center">
      <Col span={24}>
        <Bid value={bidValue} onChange={setBidValue} />
      </Col>
      <Col>
        <Button icon={<Icon name="git-compare-outline" />} />
      </Col>
      <Col span={24}>
        <Ask value={askValue} onChange={setAskValue} />
      </Col>
      <Col span={24} style={{ height: 8 }} /> {/* Safe sapce */}
      <Col span={24}>
        <Button type="primary" block>
          Review & Swap
        </Button>
      </Col>
      <AccountWatcher />
      <PoolWatcher />
    </Row>
  )
}

export default View
