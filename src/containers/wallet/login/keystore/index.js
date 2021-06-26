import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { KeystoreWallet } from 'senswapjs';

import { Row, Col, Space, Icons, Button, Typography, Input } from 'sen-kit';

import NewKeyStore from './newKeystore';
import { connectWallet } from 'store/wallet.reducer';


class KeyStore extends Component {
  constructor() {
    super();

    this.state = {
      password: '',
      filename: '',
      keystore: {},
      loading: false,
      visible: false,
    }
  }

  onUpload = () => {
    return document.getElementById('keystore-file').click();
  }

  onKeystore = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
      return this.setState({
        filename: file.name,
        keystore: JSON.parse(reader.result)
      });
    }
  }

  onPassword = (e) => {
    const password = e.target.value || '';
    return this.setState({ password });
  }

  connect = async () => {
    const { password, keystore } = this.state;
    const { setError, connectWallet } = this.props;
    if (!keystore) return setError('Please upload your keystore');
    if (!password) return setError('Please enter your password to unlock your wallet');
    const wallet = new KeystoreWallet(keystore, password);
    this.setState({ loading: true });
    const { error } = await connectWallet(wallet);
    if (error) setError(error.message);
    return this.setState({ loading: false });
  }

  onOpen = () => this.setState({ visible: true });
  onClose = () => this.setState({ visible: false });

  render() {
    const { loading, visible, password, filename } = this.state;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space align="center">
          <Icons.HiDocumentText className="anticon" />
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
            icon={<Icons.HiUpload className="anticon" />}
            style={{ marginRight: -8 }}
            onClick={this.onUpload}
          >Upload</Button>}
          readOnly
        />
        <input
          id="keystore-file"
          type="file"
          accept="application/json"
          onChange={this.onKeystore}
          style={{ "display": "none" }}
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
            icon={<Icons.HiLockOpen className="anticon" />}
            style={{ marginRight: -8 }}
            loading={loading}
          />}
        />
      </Col>
      <Col span={24} style={{ marginTop: -8 }}>
        <Space>
          <Icons.HiDocumentAdd color="#F9575E" className="anticon" />
          <Typography.Link onClick={this.onOpen}>Create a keystore</Typography.Link>
        </Space>
      </Col>
      <NewKeyStore
        visible={visible}
        onClose={this.onClose}
      />
    </Row >
  }
}

const mapStateToProps = state => ({
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  connectWallet,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyStore));