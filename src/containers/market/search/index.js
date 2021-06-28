import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Card, Input, Icon, Button, Typography, Space } from 'sen-kit';

import Keyword from './keyword';


class Search extends Component {
  constructor() {
    super();

    this.state = {
      keywords: ""
    }
  }

  onKeywords = (e) => {
    const keywords = e.target.value;
    return this.setState({ keywords });
  }

  onSearch = () => {
    const { keywords } = this.state;
    console.log(keywords);
  }

  render() {
    const { keywords } = this.state;

    return <Row gutter={[16, 16]} justify="center">
      <Col span={20}>
        <Card bordered={false} bodyStyle={{ padding: 8 }}>
          <Row gutter={[8, 8]} justify="end">
            <Col span={24}>
              <Input
                placeholder="keywords"
                value={keywords}
                suffix={<Button
                  type="text"
                  style={{ marginRight: -7 }}
                  icon={<Icon name="search-outline" />}
                  onClick={this.onSearch}
                />}
                onChange={this.onKeywords}
                onPressEnter={this.onSearch}
              />
            </Col>
            <Col>
              <Space>
                <Typography.Text>Popular:</Typography.Text>
                <Keyword title="swap" />
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