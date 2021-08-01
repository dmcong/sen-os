import { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, PoolData } from '@senswap/sen-js'

import { Row, Col, Button, Icon, Divider } from '@senswap/sen-ui'
import { SenTradeMark } from 'components/trademark'
import AccountWatcher from './accountWatcher'
import PoolWatcher from './poolWatcher'
import Settings from './settings'
import Bid from './bid'
import Ask from './ask'
import Review from './review'

import { AppDispatch, AppState } from '../model'
import { updateBidData } from '../controller/bid.controller'
import { updateAskData } from '../controller/ask.controller'
import { findDirectPool, findOptimalRoute } from '../helper/router'

export type ExtendedPoolData = PoolData & { address: string }

const View = () => {
  const [visibleReview, setVisibleReview] = useState(false)
  const [route, setRoute] = useState<string[]>([])
  const dispatch = useDispatch<AppDispatch>()
  const pools = useSelector((state: AppState) => state.pools)
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
  const parsePools = useCallback(
    (
      poolAddress: string | undefined,
      poolAddresses: string[],
    ): ExtendedPoolData[] => {
      return account.isAddress(poolAddress)
        ? [
            {
              address: poolAddress as string,
              ...pools[poolAddress as string],
            },
          ]
        : poolAddresses.map((address) => ({ address, ...pools[address] }))
    },
    [pools],
  )
  const findRoute = useCallback(async () => {
    const {
      poolAddress: bidPoolAddress,
      poolAddresses: bidPoolAddresses,
      mintInfo: bidMintInfo,
    } = bidData
    const { address: bidMintAddress } = bidMintInfo || {}
    const bidPools = parsePools(bidPoolAddress, bidPoolAddresses)
    const {
      poolAddress: askPoolAddress,
      poolAddresses: askPoolAddresses,
      mintInfo: askMintInfo,
    } = askData
    const { address: askMintAddress } = askMintInfo || {}
    const askPools = parsePools(askPoolAddress, askPoolAddresses)
    // Validation
    if (
      !account.isAddress(bidMintAddress) ||
      !account.isAddress(askMintAddress) ||
      !bidPools.length ||
      !askPools.length
    )
      return console.warn('Cannot find available tokens, pools')
    // First attempt: Find a direct pool
    const directPoolAddress = findDirectPool(
      bidMintAddress as string,
      bidPools,
      askMintAddress as string,
      askPools,
    )
    if (account.isAddress(directPoolAddress))
      return setRoute([directPoolAddress as string])
    // Second attempt: Find max-reserve pool for each token
    const optimalRoute = findOptimalRoute(
      bidMintAddress as string,
      bidPools,
      askMintAddress as string,
      askPools,
    )
    return setRoute(optimalRoute)
  }, [parsePools, bidData, askData])

  useEffect(() => {
    findRoute()
  }, [findRoute])

  return (
    <Row gutter={[8, 8]}>
      <Col span={24} style={{ marginTop: -8 }}>
        <Row gutter={[8, 8]} justify="end" align="middle" wrap={false}>
          <Col>
            <SenTradeMark />
          </Col>
          <Divider type="vertical" style={{ margin: 0 }} />
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
