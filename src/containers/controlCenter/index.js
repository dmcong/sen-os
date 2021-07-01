import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { Row, Col, Brand, Button, Icon, Tooltip, Switch, Space, Drawer } from 'sen-kit';
import MyApplications from './myApplications';

import { openControlCenter, closeControlCenter } from 'store/ui.reducer';
import './style.less';


class ControlCenter extends Component {

  to = async (route = '#') => {
    const { history, closeControlCenter } = this.props;
    await closeControlCenter();
    return history.push(route);
  }

  render() {
    const { ui: { infix, visibleControlCenter }, openControlCenter, closeControlCenter } = this.props;

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
            <Tooltip title="Home">
              <Button
                type="text"
                className="btnContained"
                onClick={() => this.to('/')}
                icon={<Icon name="tv-outline" />}
              />
            </Tooltip>
            <Tooltip title={visibleControlCenter ? 'Close' : 'Controll Center'}>
              <Button
                type="text"
                className="btnContained"
                onClick={visibleControlCenter ? closeControlCenter : openControlCenter}
                icon={<Icon name={visibleControlCenter ? 'close-outline' : 'grid-outline'} />}
              />
            </Tooltip>
            <Tooltip title="Market">
              <Button
                type="text"
                className="btnContained"
                onClick={() => this.to('/market')}
                icon={<Icon name="storefront-outline" />}
              />
            </Tooltip>
          </Space>
        </Col>
        <Col>
          <Switch
            size="small"
            checkedChildren={<Icon name="sunny-outline" />}
            unCheckedChildren={<Icon name="moon-outline" />}
          />
        </Col>
        <Col span={24} style={{ height: 64 }} />
        <Col span={24}>
          <MyApplications />
        </Col>
      </Row>
    </Drawer>
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