import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';
import { loremIpsum } from 'lorem-ipsum';

import {
  Row, Col, Button, Typography, Input,
  Widget, Icons
} from 'sen-kit';

import Wallet from 'containers/wallet';


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
          icon={<Icons.HiThumbUp className="anticon" />}
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

  render() {

    return <Row gutter={[16, 16]} align="center" justify="center">
      <Wallet />
      <Widget variant="glass" size="small">
        <Contents />
      </Widget>
      <Widget variant="glass" size="large">
        <Contents />
      </Widget>
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
)(Home));