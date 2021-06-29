import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import {
  Layout, Row, Col, Brand, Button, Icon, Tooltip,
  Switch, Space,
} from 'sen-kit';
import './style.less';

class ControlCenter extends Component {

  to = (route = '#') => {
    const { history } = this.props;
    return history.push(route);
  }

  render() {
    const { ui: { infix } } = this.props;

    return <Layout.Header className="header">
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
                icon={<Icon name="grid-outline" />}
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
      </Row>
    </Layout.Header>
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