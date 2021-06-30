import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Typography, Widget, Button, Icon } from 'sen-kit';

import { DynamicLogo } from 'helpers/loader';


/**
 * Error Boundary
 */
class ErrorBoundary extends Component {
  constructor() {
    super();

    this.state = {
      error: '',
      info: '',
    }
  }

  componentDidCatch(error, info) {
    return this.setState({ error, info });
  }

  remove = () => {
    // Not yet
  }

  support = () => {
    const { email, name } = this.props;
    return window.open(`mailto:${email}?subject=${name} has failed`, '_blank');
  }

  render() {
    const { error } = this.state;
    const { name, version } = this.props;

    if (error) return <Widget type="glass">
      <Row gutter={[8, 8]} style={{ height: '100%' }} align="middle" justify="center" >
        <Col>
          <DynamicLogo name={name} title={false} />
        </Col>
        <Col span={24}>
          <Typography.Title level={4} align="center">{name}</Typography.Title>
          <p align="center">Version {version}</p>
        </Col>
        <Col span={24}>
          <p align="center">Oops! The application couldn't load properly</p>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            icon={<Icon name="trash-outline" />}
            onClick={this.remove}
            block
          >Remove</Button>
        </Col>
        <Col span={12}>
          <Button
            type="text"
            icon={<Icon name="help-buoy-outline" />}
            onClick={this.support}
            block
          >Support</Button>
        </Col>
      </Row>
    </Widget>
    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
}

export default ErrorBoundary;