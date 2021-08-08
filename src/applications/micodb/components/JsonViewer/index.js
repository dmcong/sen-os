import {
  Row,
  Col,
  Card,
} from '@senswap/sen-ui'
import ReactJson from 'react-json-view'

export default function JsonViewer(props) {
  return (
    <Card bordered={true} style={{ marginBottom: '14px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          {props.jsonData && (
            <ReactJson
              src={props.jsonData}
              iconStyle="square"
              theme="ashes"
              collapseStringsAfterLength={20}
              displayDataTypes={false}
              displayObjectSize={false}
              name={false}
              style={{ background: 'none' }}
            />
          )}
        </Col>
      </Row>
    </Card>
  )
}
