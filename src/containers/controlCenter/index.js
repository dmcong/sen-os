import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import isEqual from 'react-fast-compare';

import {
  Row, Col, Icon, Switch, Space, Drawer, Typography, Divider, Card,
  Button, Badge
} from 'sen-kit';
import Navigation from './navigation';
import Shelf from './shelf';

import './style.less';
import { toggleSync } from 'store/ui.reducer';


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
    const { ui: { visibleControlCenter, visibleSync }, toggleSync } = this.props;
    const { settings } = this.state;

    return <Drawer
      placement="bottom"
      className={`controll-center ${visibleControlCenter ? 'open' : 'close'}`}
      height="100%"
      bodyStyle={{ padding: 16 }}
      closable={false}
      mask={false}
      visible
    >
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col span={24}>
          <Navigation />
        </Col>
        <Col span={24} />
        <Col span={24} >
          <Row gutter={[16, 16]} justify="center">
            <Col>
              <Card hoverable>
                <Space>
                  <Badge status="success">
                    <Button
                      type="text"
                      className="contained"
                      icon={<Icon name="cloudy-outline" />}
                      onClick={() => toggleSync(!visibleSync)}
                    />
                  </Badge>
                  <Divider type="vertical" />
                  <Typography.Text>Let's customize your workspace!</Typography.Text>
                  <Divider type="vertical" />
                  <Switch
                    size="small"
                    checkedChildren={<Icon name="cog-outline" />}
                    unCheckedChildren={<Icon name="cog-outline" />}
                    checked={settings}
                    onChange={this.onSettings}
                  />
                </Space>
              </Card>
            </Col>
          </Row >
        </Col>
        <Col span={24} />
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
  toggleSync,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlCenter));