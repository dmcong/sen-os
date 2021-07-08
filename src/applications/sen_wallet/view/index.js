import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col } from 'sen-kit';
import BucketWatcher from './bucketWatcher';
import AccountInfo from './accountInfo';

import { withSenOs } from 'helpers/senos';


class View extends Component {

  render() {
    return <Row gutter={[16, 16]}>
      <BucketWatcher />
      <Col span={24}>
        <AccountInfo />
      </Col>
    </Row>
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(withSenOs(View)));