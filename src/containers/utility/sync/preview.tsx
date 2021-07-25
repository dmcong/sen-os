import { Row, Col, Card } from '@senswap/sen-ui'
import ReactJson from 'react-json-view'

const Preview = ({ value = {} }: { value: object }) => {
  return (
    <Card bordered={false} bodyStyle={{ maxHeight: 512, overflow: 'scroll' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ReactJson
            src={value}
            theme="flat"
            style={{ background: 'transparent', fontSize: 12 }}
            iconStyle="circle"
            displayDataTypes={false}
            displayObjectSize={false}
            enableClipboard={false}
            indentWidth={2}
          />
        </Col>
      </Row>
    </Card>
  )
}

export default Preview
