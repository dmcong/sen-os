import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Widget } from 'sen-kit';

import Deck from './deck';


class View extends Component {
  render() {
    return <Widget size="medium" type="glass">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Deck />
        </Col>
      </Row>
    </Widget>
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(View));