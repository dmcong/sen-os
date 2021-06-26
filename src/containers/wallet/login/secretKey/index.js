import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import ssjs, { SecretKeyWallet } from 'senswapjs';

import { Row, Col, Typography, Input, Icons, Button, Space } from 'sen-kit';

import { connectWallet } from 'store/wallet.reducer';


class SecretKey extends Component {
  constructor() {
    super();

    this.state = {
      secretKey: '',
    }
  }

  onSecretKey = (e) => {
    const secretKey = e.target.value || '';
    return this.setState({ secretKey });
  }

  connect = async () => {
    const { setError, connectWallet } = this.props;
    const { secretKey } = this.state;
    if (!secretKey) return setError('The secret key cannot be empty');
    const wallet = new SecretKeyWallet(secretKey);
    const { error } = await connectWallet(wallet);
    if (error) setError(error.message);
  }

  onGen = () => {
    const account = ssjs.createAccount();
    const secretKey = Buffer.from(account.secretKey).toString('hex');
    return this.setState({ secretKey });
  }

  render() {
    const { secretKey } = this.state;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space align="center">
          <Icons.HiKey className="anticon" />
          <Typography.Text>Secret Key</Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <Typography.Text>The secret key is a raw form of your wallet, then it's very unsecure and not recommended to use.</Typography.Text>
      </Col>
      <Col span={24}>
        <Input
          placeholder="Secret Key"
          variant="contained"
          onChange={this.onSecretKey}
          value={secretKey}
          suffix={<Button
            type="primary"
            onClick={this.connect}
            icon={<Icons.HiLockOpen className="anticon" />}
            style={{ marginRight: -8 }}
          />}
        />
      </Col>
      <Col span={24} style={{ marginTop: -8 }}>
        <Space>
          <Icons.HiDocumentAdd color="#F9575E" className="anticon" />
          <Typography.Link onClick={this.onGen}>Create a secret key</Typography.Link>
        </Space>
      </Col>
    </Row>
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
)(SecretKey));