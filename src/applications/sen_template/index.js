import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import localForage from 'localforage';

import util from 'helpers/util';
import ErrorBoundary from 'components/errorBoundary';

import metadata from './package.json';
import View from './view';
import model from './model';


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
    return <Provider store={model}>
      <ErrorBoundary name={name} version={version} email={email}>
        <View ui={ui} wallet={wallet} db={db} />
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