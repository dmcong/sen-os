import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Typography } from 'sen-kit';

import { loadLogo } from 'helpers/loader'
import Search from './search';


class Market extends Component {
  render() {
    const { ui: { spacing } } = this.props;

    return <Row gutter={[spacing, spacing]}>
      <Col span={24}>
        <Search />
      </Col>
      <Col span={24}>
        {loadLogo('Sen Template')}
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