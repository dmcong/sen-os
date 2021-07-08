import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Widget } from 'sen-kit';

import SenOsProvider from 'helpers/senos';
import ErrorBoundary from 'components/errorBoundary';

import metadata from './package.json';
import View from './src/view';
import model from './src/model';


class Main extends Component {
  render() {
    const { appName, version, author: { email } } = metadata;
    return <ErrorBoundary appName={appName} version={version} email={email}>
      <SenOsProvider appName={appName}>
        <Provider store={model}>
          <Widget type="glass" size="medium">
            <View />
          </Widget>
        </Provider>
      </SenOsProvider>
    </ErrorBoundary>
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Main));