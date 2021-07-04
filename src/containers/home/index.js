import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import isEqual from 'react-fast-compare';

import { Row, Col } from 'sen-kit';

import DotPagination from 'components/dotPagination';

import { DynamicApp } from 'helpers/loader';


class Home extends Component {

  componentDidMount() {
    this.parseParams();
  }

  componentDidUpdate(prevProps) {
    const { match: { params: prevParams } } = prevProps;
    const { match: { params } } = this.props;
    if (!isEqual(prevParams, params)) this.parseParams();
  }

  parseParams = () => {
    const { babysitter: { apps }, match: { params: { page, appName } } } = this.props;
    return {
      total: apps.length,
      page: Math.min(parseInt(page) || 0, apps.length - 1),
      appName: appName || ''
    }
  }

  onPage = (page) => {
    const { history } = this.props;
    return history.push(`/home/${page}`);
  }

  render() {
    const { babysitter: { apps } } = this.props;
    const { total, page } = this.parseParams();

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row gutter={[16, 16]} justify="center">
          <Col>
            <DotPagination
              total={total}
              page={page}
              onClick={this.onPage}
            />
          </Col>
        </Row>
      </Col>
      {apps[page]?.map(appName => <DynamicApp key={appName} name={appName} />)}
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