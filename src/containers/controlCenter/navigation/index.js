import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { Row, Col, Brand, Button, Icon, Space } from 'sen-kit';
import Wallet from '../wallet';

import { openControlCenter, closeControlCenter } from 'store/ui.reducer';


class Navigation extends Component {

  to = async (route = '#') => {
    const { history, closeControlCenter } = this.props;
    await closeControlCenter();
    return history.push(route);
  }

  render() {
    const { ui: { infix, visibleControlCenter }, openControlCenter, closeControlCenter } = this.props;

    return <Row gutter={[16, 16]} align="middle">
      <Col flex="auto">
        <Space size={infix === 'xs' ? 'small' : 'middle'}>
          <span style={{ marginLeft: -7 }}>
            <Brand size={32} lite={infix === 'xs'} />
          </span>
          <Button
            type="text"
            className="btnContained"
            onClick={() => this.to('/home')}
            icon={<Icon name="ellipse-outline" />}
          />
          <Button
            type="text"
            className="btnContained"
            onClick={visibleControlCenter ? closeControlCenter : openControlCenter}
            icon={<Icon name={visibleControlCenter ? 'close-outline' : 'grid-outline'} />}
          />
          <Button
            type="text"
            className="btnContained"
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
});

const mapDispatchToProps = dispatch => bindActionCreators({
  openControlCenter, closeControlCenter,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation));