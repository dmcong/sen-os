import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Typography } from 'sen-kit';


class Market extends Component {
  render() {
    const { ui: { spacing } } = this.props;

    return <Row gutter={[spacing, spacing]}>
      <Col span={24}>
        <Typography.Title level={1}>Market</Typography.Title>
      </Col>
    </Row>
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
)(Market));