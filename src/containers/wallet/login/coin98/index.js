import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Coin98Wallet } from 'senswapjs';

import {
  Row, Col, Button, Typography, Icons,
  Avatar, Space,
} from 'sen-kit';

import COIN98 from 'static/images/coin98.png';
import { connectWallet } from 'store/wallet.reducer';


class Coin98 extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
    }
  }

  connect = async () => {
    const { connectWallet, setError } = this.props;
    const { coin98 } = window;
    if (!coin98) return console.log('Coin98 Wallet is not installed. If this is the first time you install Coin98 wallet, please restart your browser to finish the setup.');
    this.setState({ loading: true });
    const wallet = new Coin98Wallet();
    const { error } = await connectWallet(wallet);
    if (error) setError(error.message);
    return this.setState({ loading: false });
  }

  render() {
    const { loading } = this.state;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space align="baseline">
          <Avatar src={COIN98} />
          <Typography.Title level={5}>Coin98 Wallet</Typography.Title>
        </Space>
      </Col>
      <Col span={24}>
        <Typography.Text>Coin98 Wallet Extension is a variant of Coin98 Wallet for Chrome extension. You can <Typography.Link href="https://chrome.google.com/webstore/detail/coin98-wallet/aeachknmefphepccionboohckonoeemg?hl=en" target="_blank" rel="noopener">click here to install.</Typography.Link></Typography.Text>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={this.connect}
          icon={<Icons.HiLockOpen className="anticon" />}
          loading={loading}
          block
        >Connect Coin98 Wallet</Button>
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
)(Coin98));