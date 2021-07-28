import { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Swap } from '@senswap/sen-js'

import { Row, Col, Button, Icon } from '@senswap/sen-ui'
import AccountWatcher from './accountWatcher'
import PoolWatcher from './poolWatcher'
import Settings from './settings'
import Bid from './bid'
import Ask from './ask'
import Review from './review'

import { AppDispatch, AppState } from '../model'
import { updateBidData } from '../controller/bid.controller'
import { updateAskData } from '../controller/ask.controller'
import { ExpandedPoolData } from './selection/mintSelection'

const oracle = Swap.oracle

const View = () => {
  const [visibleReview, setVisibleReview] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)

  const onSwitch = () => {
    dispatch(updateBidData({ ...askData, amount: '' }))
    dispatch(updateAskData({ ...bidData, amount: '' }))
  }

  const findRouting = useCallback(async () => {
    const bidPools = bidData.poolData ? [bidData.poolData] : bidData.pools
    const askPools = askData.poolData ? [askData.poolData] : askData.pools
    // First attempt: Find a direct pool
    const directPool = findDirectPool(bidPools, askPools)
    if (directPool) console.log(directPool)
    // Second attempt: Find max-reserve pool for each token
    const optimalRoute = findOptimalRoute(bidPools, askPools)
    console.log(optimalRoute)
  }, [bidData, askData])
  const findDirectPool = (
    bidPools: ExpandedPoolData[],
    askPools: ExpandedPoolData[],
  ): ExpandedPoolData | null => {
    for (const { address: bidPoolAddress } of bidPools) {
      for (const data of askPools) {
        const { address: askPoolAddress } = data
        if (bidPoolAddress === askPoolAddress) return data
      }
    }
    return null
  }
  const findOptimalRoute = (
    bidPools: ExpandedPoolData[],
    askPools: ExpandedPoolData[],
  ): ExpandedPoolData[] => {
    return []
  }

  useEffect(() => {
    findRouting()
  }, [findRouting])

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
        <Button type="primary" onClick={() => setVisibleReview(true)} block>
          Review & Swap
        </Button>
        <Review
          visible={visibleReview}
          onClose={() => setVisibleReview(false)}
        />
      </Col>
      <AccountWatcher />
      <PoolWatcher />
    </Row>
  )
}

export default View
