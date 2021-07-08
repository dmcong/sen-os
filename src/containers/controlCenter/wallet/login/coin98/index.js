import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { Coin98Wallet } from 'senswapjs';

import { Row, Col, Button, Typography, Icon, Avatar, Space } from 'sen-kit';

import COIN98 from 'static/images/coin98.png';
import { connectWallet } from 'store/wallet.reducer';
import { notify } from 'store/ui.reducer';


class Coin98 extends Component {

  connect = async () => {
    const { connectWallet, notify } = this.props;
    const { coin98 } = window;
    if (!coin98) return notify({
      type: 'warning',
      description: 'Coin98 Wallet is not installed. If this is the first time you install Coin98 wallet, please restart your browser to finish the setup.'
    });
    const wallet = new Coin98Wallet();
    const { error } = await connectWallet(wallet);
    if (error) return notify({ type: 'error', description: error.message });
  }

  render() {
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
          icon={<Icon name="lock-open" />}
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
  notify,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Coin98));