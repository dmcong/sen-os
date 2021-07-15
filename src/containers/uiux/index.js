import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';

import { resize } from 'store/ui.reducer';
import Sync from './sync';


class UiUx extends Component {

  componentDidMount() {
    this.listenResizeEvents();
  }

  listenResizeEvents = () => {
    const { resize } = this.props;
    return window.onresize = resize;
  }

  render() {
    return <Fragment >
      <Sync />
    </Fragment>
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  resize,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(UiUx));