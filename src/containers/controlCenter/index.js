import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import isEqual from 'react-fast-compare';

import {
  Row, Col, Brand, Button, Icon, Switch, Space, Drawer,
  Typography, Divider
} from 'sen-kit';
import Shelf from './shelf';
import Wallet from './wallet';

import { openControlCenter, closeControlCenter } from 'store/ui.reducer';
import './style.less';


class ControlCenter extends Component {
  constructor() {
    super();

    this.state = {
      settings: false,
    }
  }

  componentDidUpdate(prevProps) {
    const { ui: { visibleControlCenter: prevVisibleControlCenter } } = prevProps;
    const { ui: { visibleControlCenter } } = this.props;
    if (!isEqual(prevVisibleControlCenter, visibleControlCenter)) this.setState({ settings: false });
  }

  to = async (route = '#') => {
    const { history, closeControlCenter } = this.props;
    await closeControlCenter();
    return history.push(route);
  }

  onSettings = (settings) => {
    return this.setState({ settings });
  }

  render() {
    const { ui: { infix, visibleControlCenter }, openControlCenter, closeControlCenter } = this.props;
    const { settings } = this.state;

    return <Drawer
      placement="bottom"
      className={`controll-center ${visibleControlCenter ? 'open' : 'close'}`}
      height="100%"
      bodyStyle={{ padding: 16 }}
      closable={false}
      mask={visibleControlCenter}
      visible
    >
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <Space size={infix === 'xs' ? 'small' : 'middle'}>
            <span style={{ marginLeft: -7 }}>
              <Brand size={32} lite={infix === 'xs'} />
            </span>
            <Button
              type="text"
              className="btnContained"
              onClick={() => this.to('/')}
              icon={<Icon name="tv-outline" />}
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
        <Col span={24} style={{ height: 32 }} />
        <Col span={24} >
          <Row gutter={[16, 16]} align="middle">
            <Col flex="auto">
              <Typography.Title level={5} style={{ margin: 0 }}>My Apps</Typography.Title>
            </Col>
            <Col>
              <Space>
                <Typography.Title level={5} style={{ margin: 0 }}>Settings</Typography.Title>
                <Divider type="vertical" />
                <Switch
                  size="small"
                  checkedChildren={<Icon name="cog-outline" />}
                  unCheckedChildren={<Icon name="cog-outline" />}
                  checked={settings}
                  onChange={this.onSettings}
                />
              </Space>
            </Col>
          </Row >
        </Col>
        <Col span={24}>
          <Shelf settings={settings} />
        </Col>
      </Row>
    </Drawer >
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
)(ControlCenter));