import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row } from 'sen-kit';
import Wallet from 'containers/wallet';

import { DynamicApp } from 'helpers/loader';


class Home extends Component {
  render() {
    const { babysitter: { apps } } = this.props;

    return <Row gutter={[16, 16]}>
      <Wallet />
      {apps.map(appName => <DynamicApp key={appName} name={appName} />)}
    </Row>
  }
}

const mapStateToProps = state => ({
  babysitter: state.babysitter,
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Home));