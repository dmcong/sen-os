import React, { Component } from 'react';
import PropTypes from 'prop-types';
import fileDownload from 'js-file-download';
import ssjs from 'senswapjs';

import {
  Row, Col, Icons, Button, Typography,
  Input, Modal,
} from 'sen-kit';


class NewKeyStore extends Component {
  constructor() {
    super();

    this.state = {
      password: '',
      keystore: {},
      visible: false,
      visiblePassword: false,
    }
  }

  onPassword = (e) => {
    const password = e.target.value || '';
    const keystore = ssjs.gen(password);
    return this.setState({ password, keystore });
  }

  onVisiblePassword = () => {
    const { visiblePassword } = this.state;
    return this.setState({ visiblePassword: !visiblePassword });
  }

  onDownload = () => {
    const { onClose } = this.props;
    const { keystore } = this.state;
    fileDownload(JSON.stringify(keystore), `senwallet-keystore-${keystore.publicKey}.json`);
    return onClose();
  }

  render() {
    const { visible, onClose } = this.props;
    const { visiblePassword, password, keystore } = this.state;

    return <Modal
      visible={visible}
      onCancel={onClose}
      closeIcon={<Icons.HiX className="anticon" />}
      footer={null}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title>New Keystore</Typography.Title>
          <Typography.Text>The password is used to encrypt your keystore. You will need this password to unlock your keystore later.</Typography.Text>
        </Col>
        <Col span={24} style={{ height: 16 }} />
        <Col span={24}>
          <Input
            label="Password"
            type={visiblePassword ? 'text' : 'password'}
            value={password}
            onChange={this.onPassword}
            suffix={<Button
              type="text"
              onClick={this.onVisiblePassword}
              style={{ marginRight: -8 }}
              icon={visiblePassword ? <Icons.HiEyeOff className="anticon" /> : <Icons.HiEye className="anticon" />}
            />}
          />
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]} justify="end">
            <Col>
              <Button
                type="primary"
                icon={<Icons.HiDownload className="anticon" />}
                onClick={this.onDownload}
                disabled={!keystore || !keystore.publicKey}
              >Download</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal >
  }
}

NewKeyStore.defaultProps = {
  visible: false,
  onClose: 'small',
}

NewKeyStore.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
}

export default NewKeyStore;