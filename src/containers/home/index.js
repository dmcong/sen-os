import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row } from 'sen-kit';

import { DynamicApp } from 'helpers/loader';
import Wallet from 'containers/wallet';


class Home extends Component {
  constructor() {
    super();

    this.state = {
      appNames: ['Sen Template', 'Pokemon Deck']
    }
  }

  render() {
    const { appNames } = this.state;

    return <Row gutter={[16, 16]}>
      <Wallet />
      {appNames.map((appName, index) => <DynamicApp key={index} name={appName} />)}
    </Row>
  }
}

const mapStateToProps = state => ({
  ui: state.ui
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Home));