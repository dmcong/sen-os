import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Modal, Icon, Tabs } from 'sen-kit';
import Header from './header';
import Info from './info';
import Transfer from './transfer';
import Wrapper from './wrapper';

import mintConfig from '@/sen_wallet/config/mint.config';


const Interaction = ({ visible, onClose, accountData }) => {
  const { mint } = accountData;
  const { address: wsolAddress } = mintConfig.find(({ symbol }) => (symbol === 'WSOL')) || {};

  return <Modal
    visible={visible}
    onCancel={onClose}
    closeIcon={<Icon name="close" />}
    footer={null}
    destroyOnClose={true}
    centered={true}
  >
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Header accountData={accountData} reset={visible} />
      </Col>
      <Col span={24} />
      <Col span={24}>
        <Info accountData={accountData} reset={visible} />
      </Col>
      <Col span={24}>
        <Tabs>
          <Tabs.TabPane key="transfer" tab="Transfer">
            <Transfer
              accountData={accountData}
              reset={visible}
              onChange={onClose}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="wrapper" tab="Wrapper" disabled={mint !== wsolAddress}>
            <Wrapper
              accountData={accountData}
              reset={visible}
              onChange={onClose}
            />
          </Tabs.TabPane>
        </Tabs>
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