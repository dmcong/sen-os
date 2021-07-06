import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import universe from 'universe.json';

import { Row, Col, Card, Input, Icon, Button, Typography, Space } from 'sen-kit';

import Keyword from './keyword';
import SearchEngine from './engine';
import AppPanelInMarket from '../appPanelInMarket';
import './style.less';


const KEYWORDS = ['tuphan', 'fun', 'swap'];

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

  onSearch = (e) => {
    const keywords = e.target.value;
    return this.setState({ keywords, loading: true }, () => {
      clearTimeout(this.searching);
      if (!keywords) return this.setState({ appNames: [], loading: false });
      this.searching = setTimeout(() => {
        const appNames = this.engine.search(keywords);
        return this.setState({ appNames, loading: false });
      }, 1500);
    });
  }

  to = (appName = '') => {
    const { history } = this.props;
    const subRoute = encodeURI(appName)
    return history.push(`/market/${subRoute}`);
  }

  render() {
    const { loading, keywords, appNames } = this.state;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card
          className={`search-card ${keywords ? 'active' : 'passive'}`}
          bordered={false}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Input
                placeholder="keywords #1, keywords #2, ... "
                value={keywords}
                suffix={keywords ? <Button
                  type="text"
                  style={{ marginRight: -7 }}
                  icon={<Icon name="close-circle-outline" />}
                  loading={loading}
                  onClick={() => this.onSearch({ target: { value: '' } })}
                /> : <Button
                  type="text"
                  style={{ marginRight: -7 }}
                  icon={<Icon name="search-outline" />}
                  loading={loading}
                />}
                onChange={this.onSearch}
              />
            </Col>
            <Col span={24}>
              <Row gutter={[16, 16]} justify="end">
                <Col>
                  <Space>
                    <Typography.Text>Popular:</Typography.Text>
                    {KEYWORDS.map(keyword => <Keyword
                      key={keyword}
                      title={keyword}
                      onClick={() => this.onSearch({ target: { value: keyword } })}
                    />)}
                  </Space>
                </Col>
              </Row>
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
      </Col>
    </Row>
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