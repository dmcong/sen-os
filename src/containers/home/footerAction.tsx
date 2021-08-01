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
  Divider,
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
    <Row justify="end">
      <Col>
        <Space>
          <Space>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              Add more
            </Typography.Text>
            <Button
              type="text"
              className="contained"
              icon={<Icon name="add-outline" />}
              onClick={() => to('/market')}
              size="small"
            />
          </Space>
          <Divider type="vertical" />
          <Space>
            <Typography.Text type="secondary" style={{ fontSize: 11 }}>
              Drag to organize widgets
            </Typography.Text>
            <Switch
              size="small"
              checkedChildren={<Icon name="cog-outline" />}
              unCheckedChildren={<Icon name="cog-outline" />}
              checked={value}
              onChange={onChange}
            />
          </Space>
        </Space>
      </Col>
    </Row>
  )
}

export default FooterAction
