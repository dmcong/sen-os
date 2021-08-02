import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { PoolData } from '@senswap/sen-js'

import { Row, Col, Modal, Icon } from '@senswap/sen-ui'
import LazyLoad from 'react-lazyload'
import PoolCard from './poolCard'

import config from '@/sen_lp/config'
import { AppState } from '@/sen_lp/model'
import Search from '../components/search'
import { useSenOs } from 'helpers/senos'
import Deposit from '../components/deposit'

const KEYSIZE = 3

const AllPools = () => {
  const [keyword, setKeyword] = useState('')
  const [searchedPools, setSearchedPools] = useState<
    Array<PoolData & { address: string }> | undefined
  >()
  const [activePoolAddress, setActivePoolAddress] = useState('')
  const pools = useSelector((state: AppState) => state.pools)
  const {
    senos: { tokenProvider },
  } = useSenOs()
  const {
    sol: { senAddress },
  } = config

  const sortedPools = useMemo(
    () =>
      Object.keys(pools)
        .map((address) => ({ address, ...pools[address] }))
        .filter(({ mint_s }) => mint_s === senAddress)
        .sort(({ reserve_s: firstRs }, { reserve_s: secondRs }) => {
          if (firstRs > secondRs) return -1
          if (firstRs < secondRs) return 1
          return 0
        }),
    [pools, senAddress],
  )

  const onSearch = useCallback(async () => {
    if (!keyword || keyword.length < KEYSIZE) return setSearchedPools(undefined)
    const tokenInfos = await tokenProvider.find(keyword)
    if (!tokenInfos) return setSearchedPools(undefined)
    const mintAddress = tokenInfos.map(({ address }) => address)
    const searchedPools = sortedPools.filter((data) => {
      const { mint_s, mint_a, mint_b } = data
      if (mintAddress.includes(mint_s)) return true
      if (mintAddress.includes(mint_a)) return true
      if (mintAddress.includes(mint_b)) return true
      return false
    })
    return setSearchedPools(searchedPools)
  }, [keyword, sortedPools, tokenProvider])

  useEffect(() => {
    onSearch()
  }, [onSearch])

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Search onChange={setKeyword} value={keyword} />
      </Col>
      {(searchedPools || sortedPools).map((poolData, i) => (
        <Col span={24} key={poolData.address + i}>
          <LazyLoad height={80} overflow>
            <PoolCard
              data={poolData}
              onClick={() => setActivePoolAddress(poolData.address)}
            />
          </LazyLoad>
        </Col>
      ))}
      <Modal
        visible={activePoolAddress}
        onCancel={() => setActivePoolAddress('')}
        closeIcon={<Icon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Deposit poolAddress={activePoolAddress} />
      </Modal>
    </Row>
  )
}

export default AllPools
