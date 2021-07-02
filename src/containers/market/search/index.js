import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import universe from 'universe.json';

import { Row, Col, Card, Input, Icon, Button, Typography, Space } from 'sen-kit';

import { DynamicLogo } from 'helpers/loader';
import Keyword from './keyword';
import SearchEngine from './engine';


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
      this.searching = setTimeout(() => {
        const appNames = this.engine.search(keywords);
        return this.setState({ appNames, loading: false });
      }, 1500);
    });
  }

  render() {
    const { loading, keywords, appNames } = this.state;

    return <Row gutter={[16, 16]} justify="center">
      <Col span={24}>
        <Card bordered={false} bodyStyle={{ padding: 8 }}>
          <Row gutter={[8, 8]} justify="end">
            <Col span={24}>
              <Input
                placeholder="keywords"
                value={keywords}
                suffix={keywords ? <Button
                  type="text"
                  style={{ marginLeft: -7 }}
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
            <Col>
              <Space>
                <Typography.Text>Popular:</Typography.Text>
                <Keyword
                  title="swap"
                  onClick={() => this.onSearch({ target: { value: 'swap' } })}
                />
              </Space>
            </Col>
            <Col span={24}>
              <Space align="start">
                {appNames.map(appName => <DynamicLogo key={appName} name={appName} />)}
              </Space>
            </Col>
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