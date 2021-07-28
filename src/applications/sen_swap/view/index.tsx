import { useDispatch, useSelector } from 'react-redux'
import { Swap } from '@senswap/sen-js'

import { Row, Col, Button, Icon } from '@senswap/sen-ui'
import AccountWatcher from './accountWatcher'
import PoolWatcher from './poolWatcher'
import Bid from './bid'
import Ask from './ask'
import Settings from './settings'

import { AppDispatch, AppState } from '../model'
import { updateBidData } from '../controller/bid.controller'
import { updateAskData } from '../controller/ask.controller'

const View = () => {
  const dispatch = useDispatch<AppDispatch>()
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)

  const oracle = Swap.oracle

  const onSwitch = () => {
    dispatch(updateBidData({ ...askData, amount: '' }))
    dispatch(updateAskData({ ...bidData, amount: '' }))
  }

  return (
    <Row gutter={[8, 8]}>
      <Col span={24} style={{ marginTop: -8 }}>
        <Row gutter={[8, 8]} justify="end">
          <Col>
            <Settings />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Bid />
      </Col>
      <Col span={24}>
        <Row gutter={[8, 8]} justify="center">
          <Col>
            <Button
              size="small"
              icon={<Icon name="git-compare-outline" />}
              onClick={onSwitch}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Ask />
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
