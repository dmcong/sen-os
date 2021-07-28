import { Swap } from '@senswap/sen-js'

import { Row, Col, Modal, Icon, Typography } from '@senswap/sen-ui'

import { AppState } from '@/sen_swap/model'

const oracle = Swap.oracle

const Review = ({
  visible = false,
  onClose = () => {},
}: {
  visible: boolean
  onClose: () => void
}) => {
  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      closeIcon={<Icon name="close" />}
      footer={null}
      destroyOnClose={true}
      centered={true}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={5}>Review & Swap</Typography.Title>
        </Col>
      </Row>
    </Modal>
  )
}

export default Review
