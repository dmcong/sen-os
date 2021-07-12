import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Modal, Icon } from 'sen-kit';
import Header from './header';
import Transfer from './transfer';


const Interaction = ({ visible, onClose, accountData }) => {

  console.log(accountData)
  const { ticket, mint, symbol, name } = accountData;

  return <Modal
    visible={visible}
    onCancel={onClose}
    closeIcon={<Icon name="close" />}
    footer={null}
    forceRender={true}
  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Header
          mintAddress={mint}
          ticket={ticket}
          symbol={symbol}
          name={name}
        />
      </Col>
      <Col span={24} style={{ height: 16 }} />
      <Col span={24}>
        <Transfer accountData={accountData} reset={visible} />
      </Col>
    </Row>
  </Modal>
}

Interaction.defaultProps = {
  accountData: {},
  visible: false,
  onClose: () => { }
}

Interaction.propTypes = {
  accountData: PropTypes.object,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
}

export default Interaction;