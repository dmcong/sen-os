import { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, PoolData } from '@senswap/sen-js'

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

/**
 * Search a direct pool
 * @param bidPools
 * @param askPools
 * @returns
 */
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
/**
 * Search an optimal route
 * @param bidMintAddress
 * @param bidPools
 * @param askMintAddress
 * @param askPools
 * @returns
 */
const findOptimalRoute = (
  bidMintAddress: string,
  bidPools: ExpandedPoolData[],
  askMintAddress: string,
  askPools: ExpandedPoolData[],
): ExpandedPoolData[] => {
  const indexBidPool = findMaxPoolIndex(bidMintAddress, bidPools)
  const bidPool = bidPools[indexBidPool]
  const indexAskPool = findMaxPoolIndex(askMintAddress, askPools)
  const askPool = askPools[indexAskPool]
  return [bidPool, askPool]
}
// Find max pool in terms of multiplying reserve_x and reserve_s
const findMaxPoolIndex = (mintAddress: string, pools: PoolData[]): number => {
  return pools
    .map(({ mint_a, reserve_a, mint_b, reserve_b, reserve_s }, index) => {
      let point = BigInt(0)
      if (mint_a === mintAddress) point = reserve_a * reserve_s
      if (mint_b === mintAddress) point = reserve_b * reserve_s
      return { index, point }
    })
    .sort(({ point: firstPoint }, { point: secondPoint }) => {
      if (firstPoint < secondPoint) return 1
      if (firstPoint > secondPoint) return -1
      return 0
    })[0].index
}

const View = () => {
  const [visibleReview, setVisibleReview] = useState(false)
  const [route, setRoute] = useState<PoolData[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const bidData = useSelector((state: AppState) => state.bid)
  const askData = useSelector((state: AppState) => state.ask)

  /**
   * Switch tokens
   */
  const onSwitch = useCallback(async () => {
    const { amount: bidAmount, priority: bidPriority, ...bidRest } = bidData
    const { amount: askAmount, priority: askPriority, ...askRest } = askData
    const amount = bidPriority > askPriority ? bidAmount : askAmount
    const updateData = bidPriority > askPriority ? updateAskData : updateBidData
    await dispatch(updateBidData({ ...askRest, amount: '', reset: true }))
    await dispatch(updateAskData({ ...bidRest, amount: '', reset: true }))
    await dispatch(updateData({ amount, prioritized: true }))
  }, [dispatch, askData, bidData])

  /**
   * Find optimals route
   */
  const findRoute = useCallback(async () => {
    const { address: bidMintAddress } = bidData.mintInfo || {}
    const bidPools = bidData.poolData ? [bidData.poolData] : bidData.pools
    const { address: askMintAddress } = askData.mintInfo || {}
    const askPools = askData.poolData ? [askData.poolData] : askData.pools
    // Validation
    if (
      !bidMintAddress ||
      !account.isAddress(bidMintAddress) ||
      !askMintAddress ||
      !account.isAddress(askMintAddress) ||
      !bidPools.length ||
      !askPools.length
    )
      return console.warn('Cannot find available tokens, pools')
    // First attempt: Find a direct pool
    const directPool = findDirectPool(bidPools, askPools)
    if (directPool) return setRoute([directPool])
    // Second attempt: Find max-reserve pool for each token
    const optimalRoute = findOptimalRoute(
      bidMintAddress,
      bidPools,
      askMintAddress,
      askPools,
    )
    return setRoute(optimalRoute)
  }, [bidData, askData])

  useEffect(() => {
    findRoute()
  }, [findRoute])

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
        <Button
          type="primary"
          onClick={() => setVisibleReview(true)}
          disabled={!route.length || !bidData.amount || !askData.amount}
          block
        >
          Review & Swap
        </Button>
        <Review
          route={route}
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
