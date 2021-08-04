import PropTypes from 'prop-types'

import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Icon,
  Space,
} from '@senswap/sen-ui'
import { useSenOs } from 'helpers/senos'
import util from 'helpers/util'

const Close = ({ data, onChange }) => {
  const {
    senos: { notify },
  } = useSenOs()
  const { address, amount } = data

  const close = async () => {
    try {
      const { splt, wallet } = window.senos
      const { txId } = await splt.closeAccount(address, wallet)
      await notify({
        type: 'success',
        description: `Close ${
          address.substring(0, 6) +
          '...' +
          address.substring(address.length - 6, address.length)
        } successfully. Click to view details.`,
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
      // await dispatch(deleteAccount({ address }))
      return onChange(txId)
    } catch (er) {
      return notify({ type: 'error', description: er.message })
    }
  }

  return (
    <Card bordered={false}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Space>
            <Icon name="alert-circle-outline" />
            <Typography.Text>
              Please transfer out all tokens in this account before closing!
            </Typography.Text>
          </Space>
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={close} disabled={amount} block>
            Close Account
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

Close.defaultProps = {
  data: {},
  onChange: () => {},
}

Close.propTypes = {
  data: PropTypes.object,
  onChange: PropTypes.func,
}

export default Close
