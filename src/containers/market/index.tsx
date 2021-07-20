import { useHistory } from 'react-router-dom'

import { Row, Col } from 'sen-kit'
import Search from './search'
import HeroPanel from './heroPanel'
import CategoryCard from './categoryCard'
import Community from './community'
import Foundation from './foundation'

const Market = () => {
  const history = useHistory()
  const categories = ['Swap', 'Fun', 'Pokemon', 'Tu Phan']

  const onSearch = (keyword: string) => {
    if (!keyword) return
    const subRoute = encodeURI(keyword.toLowerCase())
    return history.push(`/market?search=${subRoute}`)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Search />
      </Col>
      <Col span={24} /> {/* Spacing */}
      <Col span={24}>
        <HeroPanel />
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]}>
          {categories.map((category, i) => (
            <Col
              key={i}
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              xl={{ span: 6 }}
            >
              <CategoryCard
                category={category}
                onClick={() => onSearch(category)}
              />
            </Col>
          ))}
        </Row>
      </Col>
      <Col span={24} style={{ height: 32 }} /> {/* Spacing */}
      <Col span={24}>
        <Community />
      </Col>
      <Col span={24} style={{ height: 32 }} /> {/* Spacing */}
      <Col span={24}>
        <Foundation />
      </Col>
    </Row>
  )
}

export default Market
