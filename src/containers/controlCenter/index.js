import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { Layout, Row, Col, Brand, Button, Icon, Tooltip } from 'sen-kit';
import './style.less';

class ControlCenter extends Component {
  render() {
    return <Layout.Footer className="footer">
      <Row gutter={[16, 16]} align="middle">
        <Col flex="auto">
          <Brand size={32} />
        </Col>
        <Col>
          <Tooltip title="Market">
            <Button
              type="text"
              className="btn"
              icon={<Icon name="storefront-outline" />}
            />
          </Tooltip>
        </Col>
        <Col>
          <Tooltip title="Home">
            <Button
              type="text"
              className="btn"
              icon={<Icon name="grid-outline" />}
            />
          </Tooltip>
        </Col>
      </Row>
    </Layout.Footer>
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