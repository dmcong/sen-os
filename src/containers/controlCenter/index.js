import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { Row, Col, Brand, Button, Icon, Switch, Space, Drawer } from 'sen-kit';
import Shelf from './shelf';

import { openControlCenter, closeControlCenter } from 'store/ui.reducer';
import './style.less';


class ControlCenter extends Component {
  constructor() {
    super();

    this.state = {
      settings: false,
    }
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
          <Brand size={32} lite={infix === 'xs'} />
        </Col>
        <Col>
          <Space size="middle">
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
          <Space>
            {visibleControlCenter ? <Switch
              size="small"
              checkedChildren={<Icon name="cog-outline" />}
              unCheckedChildren={<Icon name="cog-outline" />}
              checked={settings}
              onChange={this.onSettings}
            /> : null}
            <Switch
              size="small"
              checkedChildren={<Icon name="sunny-outline" />}
              unCheckedChildren={<Icon name="moon-outline" />}
            />
          </Space>
        </Col>
        <Col span={24} style={{ height: 64 }} />
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