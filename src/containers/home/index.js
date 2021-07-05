import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import isEqual from 'react-fast-compare';

import { Row, Col, Affix } from 'sen-kit';

import DotPagination from 'components/dotPagination';

import { DynamicApp } from 'helpers/loader';


class Home extends Component {

  componentDidMount() {
    this.parseParams();
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (!isEqual(prevSearch, search)) this.parseParams();
  }

  parseParams = () => {
    const { babysitter: { apps }, location: { search } } = this.props;
    const params = new URLSearchParams(search);
    const total = apps.length;
    const page = Math.min(parseInt(params.get('page')) || 0, apps.length - 1);
    const appName = params.get('appName') || '';
    const mode = params.get('mode') === 'full' ? 'full' : 'lite';
    return { total, page, appName, mode }
  }

  onPage = (page) => {
    const { history } = this.props;
    return history.push(`/home?page=${page}`);
  }

  render() {
    const { babysitter: { apps } } = this.props;
    const { total, page } = this.parseParams();

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row gutter={[16, 16]} justify="center">
          <Col>
            <Affix offsetTop={10}>
              <DotPagination
                total={total}
                page={page}
                onClick={this.onPage}
              />
            </Affix>
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