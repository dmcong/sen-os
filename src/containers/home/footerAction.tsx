import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import {
  Row,
  Col,
  Space,
  Switch,
  Typography,
  Icon,
  Button,
} from '@senswap/sen-ui'

import { RootState } from 'store'

const FooterAction = ({
  value = false,
  onChange = () => {},
}: Partial<{ value: boolean; onChange: (value: boolean) => void }>) => {
  const { address } = useSelector((state: RootState) => state.wallet)
  const history = useHistory()

  const to = (route = '#') => history.push(route)

  if (!account.isAddress(address)) return null
  return (
    <Row justify="space-between" align="middle">
      <Col>
        <Space>
          <Button
            type="text"
            className="contained"
            icon={<Icon name="add-outline" />}
            onClick={() => to('/market')}
            size="small"
          />
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            Add more apps
          </Typography.Text>
        </Space>
      </Col>
      <Col>
        <Space>
          <Typography.Text type="secondary" style={{ fontSize: 11 }}>
            Drag to re-organize widgets!
          </Typography.Text>
          <Switch
            size="small"
            checkedChildren={<Icon name="cog-outline" />}
            unCheckedChildren={<Icon name="cog-outline" />}
            checked={value}
            onChange={onChange}
          />
        </Space>
      </Col>
    </Row>
  )
}

export default FooterAction
