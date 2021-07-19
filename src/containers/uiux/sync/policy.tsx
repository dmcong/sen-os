import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { Row, Col, Button, Typography, Card } from 'sen-kit'
import ReactJson from 'react-json-view'

import PDB from 'helpers/pdb'
import { RootState } from 'store'

const Policy = ({
  value = false,
  onChange = () => {},
}: Partial<{ value: boolean; onChange: (value: boolean) => void }>) => {
  const [data, setData] = useState<object>({})
  const { address } = useSelector((state: RootState) => state.wallet)

  useEffect(() => {
    ;(async () => {
      if (!value) return setData({})
      const pdb = new PDB(address)
      const d = await pdb._getAll()
      return setData(d)
    })()
  }, [value, address])

  const store = (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <ReactJson
          src={data}
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
  )

  const policy = (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Why should I create a backup?</Typography.Title>
        <ul style={{ paddingLeft: 16 }}>
          <li>
            <Typography.Text type="secondary">
              Because SenSwap never collects your data, so the data is locally available.
            </Typography.Text>
          </li>
          <li>
            <Typography.Text type="secondary">
              You can move data in the current device to a new one.
            </Typography.Text>
          </li>
          <li>
            <Typography.Text type="secondary">
              Restore data in case your device is broken or suddenly lost.
            </Typography.Text>
          </li>
        </ul>
      </Col>
      <Col span={24}>
        <Typography.Title level={5}>What is IPFS?</Typography.Title>
        <ul style={{ paddingLeft: 16 }}>
          <li>
            <Typography.Text type="secondary">
              IPFS is a decentralized database. By high availability, data can be fetched via an
              internet connection.
            </Typography.Text>
          </li>
          <li>
            <Typography.Text type="secondary">
              Everyone can publicly access data on it, and even your stored data.
            </Typography.Text>
          </li>
        </ul>
      </Col>
      <Col span={24}>
        <Typography.Title level={5} type="danger">
          Be aware of privacy!
        </Typography.Title>
        <ul style={{ paddingLeft: 16 }}>
          <li>
            <Typography.Text type="secondary">
              Make sure that no sensitive data is in the store.
            </Typography.Text>
          </li>
          <li>
            <Typography.Text type="secondary">
              It's rarely happened, but there is a little chance of losing your data on IPFS.
            </Typography.Text>
          </li>
        </ul>
      </Col>
      <Col span={24}>
        <Button onClick={() => onChange(true)} block>
          Click here to review the data first
        </Button>
      </Col>
    </Row>
  )

  return (
    <Card bordered={false} bodyStyle={{ maxHeight: 512, overflow: 'scroll' }}>
      {value ? store : policy}
    </Card>
  )
}

export default Policy
