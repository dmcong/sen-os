import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { KeystoreWallet } from 'senswapjs';

import { Row, Col, Space, Icon, Button, Typography, Input } from 'sen-kit';

import NewKeyStore from './newKeystore';
import { connectWallet } from 'store/wallet.reducer';
import { notify } from 'store/ui.reducer';


class KeyStore extends Component {
  constructor() {
    super();

    this.state = {
      password: '',
      filename: '',
      keystore: {},
      visible: false,
    }

    this.file = createRef();
  }

  onUpload = () => {
    return this.file.current.click();
  }

  onKeystore = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => this.setState({
      filename: file.name,
      keystore: JSON.parse(reader.result)
    });
  }

  onPassword = (e) => {
    const password = e.target.value || '';
    return this.setState({ password });
  }

  connect = async () => {
    const { password, keystore } = this.state;
    const { notify, connectWallet } = this.props;
    if (!keystore) return notify({ type: 'warning', description: 'Please upload your keystore' });
    if (!password) return notify({ type: 'warning', description: 'Please enter your password to unlock your wallet' });
    const wallet = new KeystoreWallet(keystore, password);
    const { error } = await connectWallet(wallet);
    if (error) return notify({ type: 'error', description: error.message });
  }

  onOpen = () => this.setState({ visible: true });
  onClose = () => this.setState({ visible: false });

  render() {
    const { visible, password, filename } = this.state;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space align="center">
          <Icon name="document-lock" />
          <Typography.Text>Keystore</Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <Typography.Text>This keystore format is compatible with <Typography.Link href="https://solflare.com" target="_blank" rel="noopener">SolFlare</Typography.Link> keystore.</Typography.Text>
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <Input
          placeholder="Filename"
          value={filename}
          suffix={<Button
            type="text"
            icon={<Icon name="cloud-upload" />}
            style={{ marginRight: -8 }}
            onClick={this.onUpload}
          >Upload</Button>}
          readOnly
        />
        <input
          ref={this.file}
          type="file"
          accept="application/json"
          onChange={this.onKeystore}
          style={{ display: 'none' }}
        />
      </Col>
      <Col xs={{ span: 24 }} md={{ span: 12 }}>
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={this.onPassword}
          suffix={<Button
            type="primary"
            onClick={this.connect}
            icon={<Icon name="lock-open" />}
            style={{ marginRight: -8 }}
          />}
        />
      </Col>
      <Col span={24} style={{ marginTop: -8 }}>
        <Typography.Link onClick={this.onOpen}>
          <Space>
            <Icon name="add-circle-outline" />
            <span>Create a keystore</span>
          </Space>
        </Typography.Link>
      </Col>
      <NewKeyStore visible={visible} onClose={this.onClose} />
    </Row >
  }
}

const mapStateToProps = state => ({
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  connectWallet,
  notify,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyStore));