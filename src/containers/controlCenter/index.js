import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import {
  Layout, Row, Col, Brand,
  Button, Icons,
} from 'sen-kit';
import './style.less';

class ControlCenter extends Component {
  render() {
    return <Layout.Footer className="footer">
      <Row gutter={[16, 16]}>
        <Col flex="auto">
          <Brand />
        </Col>
        <Col>
          <Button
            type="text"
            className="btn"
            icon={<Icons.FcShop style={{ verticalAlign: 'middle' }} />}
          />
        </Col>
        <Col>
          <Button
            type="text"
            className="btn"
            icon={<Icons.HiMenuAlt3 style={{ verticalAlign: 'middle' }} />}
          />
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