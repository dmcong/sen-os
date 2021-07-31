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

export type ExtendedPoolData = PoolData & { address: string }

/**
 * Search a direct pool
 * @param bidPools
 * @param askPools
 * @returns
 */
const findDirectPool = (
  bidPools: ExtendedPoolData[],
  askPools: ExtendedPoolData[],
): string | undefined => {
  for (const { address: bidPoolAddress } of bidPools) {
    for (const { address: askPoolAddress } of askPools) {
      if (bidPoolAddress === askPoolAddress) return bidPoolAddress
    }
  }
  return undefined
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
  bidPools: ExtendedPoolData[],
  askMintAddress: string,
  askPools: ExtendedPoolData[],
): string[] => {
  const indexBidPool = findMaxPoolIndex(bidMintAddress, bidPools)
  const { address: bidPoolAddress } = bidPools[indexBidPool]
  const indexAskPool = findMaxPoolIndex(askMintAddress, askPools)
  const { address: askPoolAddress } = askPools[indexAskPool]
  return [bidPoolAddress, askPoolAddress]
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
    const directPoolAddress = findDirectPool(bidPools, askPools)
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
