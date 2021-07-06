import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import isEqual from 'react-fast-compare';
import universe from 'universe.json';

import { Row, Col, Card, Input, Icon, Button } from 'sen-kit';

import SearchEngine from './engine';
import AppPanelInMarket from '../appPanelInMarket';
import './style.less';


class Search extends Component {
  constructor() {
    super();

    this.state = {
      loading: false,
      keywords: '',
      appNames: []
    }

    this.engine = new SearchEngine(universe);
  }

  componentDidMount() {
    this.parseParams();
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (!isEqual(prevSearch, search)) this.parseParams();
  }

  parseParams = () => {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search) || {};
    const keywords = params.get('search');
    return this.setState({ keywords }, this.search);
  }

  onKeyword = (e) => {
    const keywords = e.target.value;
    return this.setState({ keywords }, this.search);
  }

  search = () => {
    const { history } = this.props;
    const { keywords } = this.state;
    return this.setState({ loading: true }, () => {
      clearTimeout(this.searching);
      if (!keywords) return this.setState({ appNames: [], loading: false }, () => {
        return history.push('/market')
      });
      this.searching = setTimeout(() => {
        const appNames = this.engine.search(keywords);
        return this.setState({ appNames, loading: false }, () => {
          return window.scrollTo(0, 0);
        });
      }, 1000);
    });
  }

  to = (appName = '') => {
    const { history } = this.props;
    const subRoute = encodeURI(appName)
    return history.push(`/market/${subRoute}`);
  }

  render() {
    const { loading, keywords, appNames } = this.state;

    return <Card className={`search-card ${keywords ? 'active' : 'passive'}`} bordered={false} >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Input
            placeholder="Search"
            value={keywords}
            size="small"
            bordered={false}
            suffix={keywords ? <Button
              type="text"
              style={{ marginRight: -7 }}
              icon={<Icon name="close-circle-outline" />}
              loading={loading}
              onClick={() => this.onKeyword({ target: { value: '' } })}
            /> : <Button
              type="text"
              style={{ marginRight: -7 }}
              icon={<Icon name="search-outline" />}
              loading={loading}
            />}
            onChange={this.onKeyword}
          />
        </Col>
        {appNames.map(appName => <Col
          key={appName}
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 6 }}
        >
          <AppPanelInMarket appName={appName} onClick={() => this.to(appName)} />
        </Col>)}
      </Row>
    </Card>
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Search));