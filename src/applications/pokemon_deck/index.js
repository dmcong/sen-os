import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import localForage from 'localforage';

import util from 'helpers/util';
import { SenOsProvider } from 'helpers/context';
import ErrorBoundary from 'components/errorBoundary';

import metadata from './package.json';
import View from './src/view';
import model from './src/model';


class Main extends Component {

  db = (appName) => {
    const dbName = util.normalizeAppName(appName);
    const db = localForage.createInstance({ name: dbName });
    db.createInstance = function (opts) {
      return localForage.createInstance({ ...opts, name: dbName });
    }
    return db;
  }

  render() {
    const { ui, wallet } = this.props;
    const { name, version, author: { email } } = metadata;
    const db = this.db(name);
    return <ErrorBoundary name={name} version={version} email={email}>
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