import { useState } from 'react'

import { Row, Col, Button, Icon } from '@senswap/sen-ui'
import AccountWatcher from './accountWatcher'
import PoolWatcher from './poolWatcher'
import Bid from './bid'
import Ask from './ask'
import Settings from './settings'

const View = () => {
  const [settings, setSettings] = useState({ slippage: 0.001, advanced: false })
  const [bidValue, setBidValue] = useState({ amount: '' })
  const [askValue, setAskValue] = useState({ amount: '' })

  console.log('bid', bidValue)
  console.log('ask', askValue)
  console.log('settings', settings)

  return (
    <Row gutter={[8, 8]}>
      <Col span={24} style={{ marginTop: -8 }}>
        <Row gutter={[8, 8]} justify="end">
          <Col>
            <Settings value={settings} onChange={setSettings} />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Bid value={bidValue} onChange={setBidValue} />
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]} justify="center">
          <Col>
            <Button size="small" icon={<Icon name="git-compare-outline" />} />
          </Col>
        </Row>
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
