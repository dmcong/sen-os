import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Space, Button, Icon } from 'sen-kit';

import { DynamicApp } from 'helpers/loader';
import Wallet from 'containers/wallet';


class Home extends Component {
  constructor() {
    super();

    this.state = {
      appNames: ['Sen Template', 'Pokemon Deck']
    }
  }

  add = () => {
    return this.setState({ appNames: ['Sen Template', 'Pokemon Deck'] });
  }

  remove = () => {
    return this.setState({ appNames: ['Sen Template'] });
  }

  render() {
    const { appNames } = this.state;

    return <Row gutter={[16, 16]}>
      <Col span={24}>
        <Row gutter={[16, 16]} justify="end">
          <Col>
            <Space>
              <Button
                type="text"
                className="btnContained"
                onClick={this.add}
                icon={<Icon name="add" />}
              />
              <Button
                type="text"
                className="btnContained"
                onClick={this.remove}
                icon={<Icon name="remove" />}
              />
            </Space>
          </Col>
        </Row>
      </Col>
      <Wallet />
      {appNames.map((appName, index) => <DynamicApp key={index} name={appName} />)}
    </Row>
  }
}

const mapStateToProps = state => ({
  ui: state.ui
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Home));