import { useSelector } from 'react-redux'

import { Row, Col } from '@senswap/sen-ui'
import LazyLoad from 'react-lazyload'

import PoolCard from './poolCard'
import { AppState } from '@/sen_lp/model'

const AllPools = () => {
  const pools = useSelector((state: AppState) => state.pools)

  const onLPT = () => {}

  return (
    <Row gutter={[12, 12]}>
      {Object.keys(pools).map((poolAddress, i) => (
        <Col span={24} key={poolAddress + i}>
          <LazyLoad height={88} overflow>
            <PoolCard
              data={{ address: poolAddress, ...pools[poolAddress] }}
              onClick={onLPT}
            />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default AllPools
