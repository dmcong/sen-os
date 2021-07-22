import PropTypes from 'prop-types'

import {
  Row,
  Col,
  Button,
  Icon,
  Space,
  Popover,
  Typography,
  Switch,
} from 'sen-kit'

const Settings = ({ value, onChange }) => {
  const { hiddenZeros } = value
  const onHiddenZeros = (checked) =>
    onChange({ ...value, hiddenZeros: checked })
  return (
    <Popover
      content={
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Space size="large">
              <Switch
                size="small"
                checked={hiddenZeros}
                onChange={onHiddenZeros}
              />
              <Typography.Text>Hide zero balances</Typography.Text>
            </Space>
          </Col>
        </Row>
      }
      trigger="click"
      placement="topRight"
    >
      <Button type="text" shape="circle" icon={<Icon name="cog-outline" />} />
    </Popover>
  )
}

Settings.defaultProps = {
  value: {
    hiddenZeros: false,
  },
  onChange: () => {},
}

Settings.propTypes = {
  value: PropTypes.object,
  onChange: PropTypes.func,
}

export default Settings
