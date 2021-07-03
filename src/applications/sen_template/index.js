import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { createPDB } from 'helpers/pdb';
import { SenOsProvider } from 'helpers/context';
import ErrorBoundary from 'components/errorBoundary';

import metadata from './package.json';
import View from './src/view';
import model from './src/model';


class Main extends Component {
  render() {
    const { ui, wallet } = this.props;
    const { appName, version, author: { email } } = metadata;
    const db = createPDB(appName);
    return <ErrorBoundary name={appName} version={version} email={email}>
      <Provider store={model}>
        <SenOsProvider senos={{ ui, wallet, db }}>
          <View />
        </SenOsProvider>
      </Provider>
    </ErrorBoundary>
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