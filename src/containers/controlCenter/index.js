import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import {
  Row, Col, Brand, Button, Icon, Tooltip,
  Switch, Space, Drawer, Typography,
} from 'sen-kit';
import './style.less';

class ControlCenter extends Component {
  constructor() {
    super();

    this.state = {
      visible: false
    }
  }

  toggle = () => {
    const { visible } = this.state;
    return this.setState({ visible: !visible }, () => {
      if (!visible) return document.body.style.overflow = 'hidden';
      return document.body.style.overflow = 'scroll';
    });
  }

  to = (route = '#') => {
    const { history } = this.props;
    return history.push(route);
  }

  render() {
    const { ui: { infix } } = this.props;
    const { visible } = this.state;

    return <Drawer
      placement="bottom"
      className={`glass drawer ${!visible ? 'lite' : 'full'}`}
      height="100%"
      bodyStyle={{ padding: 16 }}
      closable={false}
      mask={visible}
      visible
    >
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <Brand size={32} lite={infix === 'xs'} />
        </Col>
        <Col>
          <Space size="middle">
            <Tooltip title="Market">
              <Button
                type="text"
                className="btnContained"
                onClick={() => this.to('/market')}
                icon={<Icon name="storefront-outline" />}
              />
            </Tooltip>
            <Tooltip title="Home">
              <Button
                type="text"
                className="btnContained"
                onClick={() => this.to('/')}
                icon={<Icon name="tv-outline" />}
              />
            </Tooltip>
            <Button
              type="text"
              className="btnContained"
              onClick={this.toggle}
              icon={<Icon name={visible ? 'close-outline' : 'grid-outline'} />}
            />
          </Space>
        </Col>
        <Col>
          <Switch
            size="small"
            checkedChildren={<Icon name="sunny-outline" />}
            unCheckedChildren={<Icon name="moon-outline" />}
          />
        </Col>
        <Col span={24}>
          <Typography.Title level={1}>Controll Center</Typography.Title>
        </Col>
      </Row>
    </Drawer>
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlCenter));