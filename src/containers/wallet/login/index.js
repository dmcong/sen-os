import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { Row, Col, Modal, Icon, Tooltip, Switch, Divider, Animate } from 'sen-kit';

import Coin98 from './coin98';
import Keystore from './keystore';
import SecretKey from './secretKey';
import { closeWallet } from 'store/wallet.reducer';


class Login extends Component {
  constructor() {
    super();

    this.state = {
      advance: false,
    }
  }

  onAdvance = (checked) => {
    const advance = checked || false;
    return this.setState({ advance });
  }

  render() {
    const { wallet: { visible }, closeWallet } = this.props;
    const { advance } = this.state;

    return <Modal
      visible={visible}
      onCancel={closeWallet}
      closeIcon={<Icon name="close" />}
      footer={null}
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Coin98 />
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]} align="middle">
            <Col flex="auto">
              <Divider plain orientation="left">Other methods</Divider>
            </Col>
            <Col>
              <Tooltip title="Caution! These methods is not recommended due to lack of cryptographical protection. By switching the button, you agree that you will use this function at your own risk.">
                <Switch
                  color="primary"
                  size="small"
                  checked={advance}
                  onChange={this.onAdvance}
                  checkedChildren={<Icon name="warning" />}
                  unCheckedChildren={<Icon name="help-circle" />}
                />
              </Tooltip>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Animate transitionName="fade">
            {advance ? <Row gutter={[16, 16]}>
              <Col span={24}>
                <Keystore />
              </Col>
              <Col span={24} style={{ height: 16 }} /> {/* Safe space */}
              <Col span={24}>
                <SecretKey />
              </Col>
            </Row> : null}
          </Animate>
        </Col>
      </Row>
    </Modal>
  }
}

const mapStateToProps = state => ({
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  closeWallet,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Login));