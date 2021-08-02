import { useSelector } from 'react-redux'

import { Row, Col } from '@senswap/sen-ui'
import LazyLoad from 'react-lazyload'

import LPTCard from './lptCard'
import { AppState } from '@/sen_lp/model'

const MyPools = () => {
  const lpts = useSelector((state: AppState) => state.lpts)

  const onLPT = () => {}

  return (
    <Row gutter={[12, 12]}>
      {Object.keys(lpts).map((lptAddress, i) => (
        <Col span={24} key={lptAddress + i}>
          <LazyLoad height={88} overflow>
            <LPTCard data={lpts[lptAddress]} onClick={onLPT} />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default MyPools
