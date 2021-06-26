import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import { loremIpsum } from 'lorem-ipsum';

import { getUser } from 'store/wallet.reducer';

import {
  Row, Col, Button, Typography, Input,
  Widget, Icons
} from 'sen-kit';


function Contents(props) {
  const { onClick } = props;
  return <Row gutter={[16, 16]} align="middle">
    <Col span={24}>
      <Typography.Title level={3}>{loremIpsum({ count: 5, units: 'word' })}</Typography.Title>
    </Col>
    <Col span={24}>
      <Typography.Text>{loremIpsum({ count: 1, units: 'paragraphs' })}</Typography.Text>
    </Col>
    <Col span={24}>
      <Input
        suffix={<Button
          type="text"
          shape="circle"
          icon={<Icons.HiThumbUp style={{ verticalAlign: 'middle' }} />}
          style={{ marginRight: -7 }}
        />}
      />
    </Col>
    <Col span={24}>
      <Row gutter={[16, 16]} justify="end">
        <Col >
          <Button>Default</Button>
        </Col>
        <Col >
          <Button type="primary" onClick={onClick}>Primary</Button>
        </Col>
      </Row>
    </Col>
  </Row>
}


class Home extends Component {

  fetchData = () => {
    const { getUser } = this.props;
    return getUser('11111111111111111111111111111111')
  }

  render() {

    return <Row gutter={[16, 16]} align="center" justify="center">
      <Widget variant="glass" size="small">
        <Contents onClick={this.fetchData} />
      </Widget>
      <Widget variant="glass" size="small">
        <Contents onClick={this.fetchData} />
      </Widget>
      <Widget variant="glass" size="large">
        <Contents onClick={this.fetchData} />
      </Widget>
    </Row>
  }
}

const mapStateToProps = state => ({
  wallet: state.wallet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  getUser,
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Home));