import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { withRouter } from 'react-router-dom';

import { Row, Col, Space, Button, Icon } from 'sen-kit';

import { load } from './loader';
import Wallet from 'containers/wallet';


class Home extends Component {
  constructor() {
    super();

    this.state = {
      appNames: ['Sen Template', 'Clock']
    }
  }

  add = () => {
    return this.setState({ appNames: ['Sen Template', 'Clock'] });
  }

  remove = () => {
    return this.setState({ appNames: ['Sen Template'] });
  }

  render() {
    const { ui: { spacing } } = this.props;
    const { appNames } = this.state;

    return <Row gutter={[spacing, spacing]}>
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
      {appNames.map(appName => load(appName))}
    </Row>
  }
}

const mapStateToProps = state => ({
  ui: state.ui,
});

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch);

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Home));