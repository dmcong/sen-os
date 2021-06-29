import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import ErrorBoundary from 'components/errorBoundary';

import metadata from './package.json';
import View from './view';
import model from './model';


class Main extends Component {
  render() {
    const { ui, wallet } = this.props;
    const { name, version, author: { email } } = metadata;
    return <Provider store={model}>
      <ErrorBoundary name={name} version={version} email={email}>
        <View ui={ui} wallet={wallet} />
      </ErrorBoundary>
    </Provider>
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Main));