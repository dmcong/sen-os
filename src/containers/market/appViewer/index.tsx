import { useParams } from 'react-router-dom'

import { Row, Col } from 'sen-kit'
import HeroPanel from './heroPanel'
import Description from './description'

const AppViewer = () => {
  const { appName } = useParams<{ appName: string }>()

  return (
    <Row gutter={[16, 16]}>
      <Col xs={{ span: 24 }} md={{ span: 8 }}>
        <HeroPanel appName={appName} />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 16 }}>
        <Description appName={appName} />
      </Col>
    </Row>
  )
}

export default AppViewer
