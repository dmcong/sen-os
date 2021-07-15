import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import ssjs from 'senswapjs';

import { Row, Col, Brand, Button, Icon, Space } from 'sen-kit';
import Wallet from '../wallet';

import { toggleControlCenter } from 'store/ui.reducer';


class Navigation extends Component {

  to = async (route = '#') => {
    const { history, toggleControlCenter } = this.props;
    await toggleControlCenter(false);
    return history.push(route);
  }

  render() {
    const {
      ui: { infix, visibleControlCenter }, wallet: { address },
      toggleControlCenter
    } = this.props;

    return <Row gutter={[16, 16]} align="middle">
      <Col flex="auto">
        <Space size={infix === 'xs' ? 'small' : 'middle'}>
          <span style={{ marginLeft: -7 }}>
            <Brand size={32} lite={infix === 'xs'} />
          </span>
          <Button
            type="text"
            className="contained"
            onClick={() => this.to('/home')}
            icon={<Icon name="ellipse-outline" />}
          />
          <Button
            type="text"
            className="contained"
            onClick={() => toggleControlCenter(!visibleControlCenter)}
            icon={<Icon name={visibleControlCenter ? 'close-outline' : 'grid-outline'} />}
            disabled={!ssjs.isAddress(address)}
          />
          <Button
            type="text"
            className="contained"
            onClick={() => this.to('/market')}
            icon={<Icon name="storefront-outline" />}
          />
        </Space>
      </Col>
      <Col>
        <Wallet />
      </Col>
    </Row>
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleControlCenter,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation));