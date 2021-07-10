import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Modal, Button, Icon } from 'sen-kit';

const Transfer = (props) => {
  const { visible, onClose, accountData } = props;
  return <Modal
    visible={visible}
    onCancel={onClose}
    closeIcon={<Icon name="close" />}
    footer={null}
  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
          {JSON.stringify(accountData)}
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          block
        >Transfer</Button>
      </Col>
    </Row>
  </Modal>
}

Transfer.defaultProps = {
  accountData: {},
  visible: false,
  onClose: () => { }
}

Transfer.propTypes = {
  accountData: PropTypes.object,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
}

export default Transfer;