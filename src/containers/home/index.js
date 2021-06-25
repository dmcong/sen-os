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

const { FcFaq } = Icons;
const { Title, Text } = Typography;


function Contents(props) {
  const { onClick } = props;
  return <Row gutter={[16, 16]} align="middle">
    <Col span={24}>
      <Title level={3}>{loremIpsum({ count: 5, units: 'word' })}</Title>
    </Col>
    <Col span={24}>
      <Text>{loremIpsum({ count: 1, units: 'paragraphs' })}</Text>
    </Col>
    <Col span={24}>
      <Input
        suffix={<Button
          type="text"
          shape="circle"
          icon={<FcFaq style={{ verticalAlign: 'middle' }} />}
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
    return getUser('Tu Phan')
  }

  render() {

    return <Row gutter={[16, 16]} align="center" justify="center">
      <Col span={24} style={{ height: 64 }} />
      {/* Row 0 */}
      <Widget variant="default" size="large">
        <Contents onClick={this.fetchData} />
      </Widget>
      {/* Row 1 */}
      <Widget variant="solid" size="small">
        <Contents />
      </Widget>
      <Widget variant="glass" size="small">
        <Contents />
      </Widget>
      <Widget variant="glass" size="small">
        <Contents />
      </Widget>
      {/* Row 2 */}
      <Widget variant="glass" size="small">
        <Contents />
      </Widget>
      <Widget variant="solid" size="medium">
        <Contents />
      </Widget>
      <Col span={24} style={{ height: 64 }} />
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