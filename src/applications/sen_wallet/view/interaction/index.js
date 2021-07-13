import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Modal, Icon, Typography } from 'sen-kit';
import Header from './header';
import Transfer from './transfer';
import Wrap from './wrap';

import mintConfig from '@/sen_wallet/config/mint.config';


const Interaction = ({ visible, onClose, accountData }) => {
  const { ticket, mint, symbol, name } = accountData;
  const { address: wsolAddress } = mintConfig.find(({ symbol }) => (symbol === 'WSOL')) || {};

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
      <Col span={24}>
        <Typography.Title
          type="secondary"
          level={5}
          style={{ margin: `8px 0px -8px 8px` }}
        >{symbol} Transfer</Typography.Title>
      </Col>
      <Col span={24}>
        <Transfer
          accountData={accountData}
          reset={visible}
          onChange={onClose}
        />
      </Col>
      {mint === wsolAddress ? <Fragment>
        <Col span={24}>
          <Typography.Title
            type="secondary"
            level={5}
            style={{ margin: `8px 0px -8px 8px` }}
          >{symbol} Wrapper</Typography.Title>
        </Col>
        <Col span={24}>
          <Wrap
            accountData={accountData}
            reset={visible}
            onChange={onClose}
          />
        </Col>
      </Fragment> : null}
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