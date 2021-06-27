import React, { Component, Suspense, lazy } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Spin } from 'sen-kit';

// import Wallet from 'containers/wallet';
const Wallet = lazy(() => import('containers/wallet'));


class Home extends Component {

  render() {
    return <Row gutter={[16, 16]}>
      <Suspense fallback={<Spin />}>
        <Wallet />
      </Suspense>
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
)(Home));