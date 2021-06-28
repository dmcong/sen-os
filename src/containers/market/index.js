import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col } from 'sen-kit';

import { loadLogo } from 'helpers/loader'
import Search from './search';


class Market extends Component {
  constructor() {
    super();

    this.state = {
      appNames: ['Sen Template', 'Pokemon Deck']
    }
  }

  onLogo = (e) => {
    console.log(e);
  }

  render() {
    const { ui: { spacing } } = this.props;
    const { appNames } = this.state;

    return <Row gutter={[spacing, spacing]}>
      <Col span={24}>
        <Search />
      </Col>
      <Col span={24} style={{ height: 32 }} />
      <Col span={24}>
        <Row gutter={[16, 16]}>
          {appNames.map((name, i) => <Col key={i}>
            {loadLogo(name, { onClick: this.onLogo })}
          </Col>)}
        </Row>
      </Col>
    </Row>
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Market));