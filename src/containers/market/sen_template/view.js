import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Widget, Typography, Button, Icon } from 'sen-kit';
import { updateTime } from './controller';


class View extends Component {
  render() {
    const { main: { time }, updateTime } = this.props;

    return <Widget type="glass">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={1}>Template</Typography.Title>
        </Col>
        <Col span={24}>
          <Typography.Text>Updated at: {(new Date(time)).toString()}</Typography.Text>
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            onClick={updateTime}
            icon={<Icon name="reload-outline" />}
            block
          >Update</Button>
        </Col>
      </Row>
    </Widget>
  }
}

const mapStateToProps = state => ({
  main: state.main,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateTime
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(View));