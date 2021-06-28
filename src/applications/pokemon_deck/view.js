import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Widget, Typography, Button, Icon } from 'sen-kit';
import { choosePokemon } from './controller';


class View extends Component {
  render() {
    const { main: { name }, choosePokemon } = this.props;

    return <Widget type="glass">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Title level={1}>Pokemon Deck</Typography.Title>
        </Col>
        <Col span={24}>
          <Typography.Text>Pokemon: <strong>{name}</strong></Typography.Text>
        </Col>
        <Col span={24}>
          <Button
            type="primary"
            onClick={choosePokemon}
            icon={<Icon name="game-controller-outline" />}
            block
          >Choose</Button>
        </Col>
      </Row>
    </Widget>
  }
}

const mapStateToProps = state => ({
  main: state.main,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  choosePokemon
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(View));