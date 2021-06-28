import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Typography, Widget, Button, Icon } from 'sen-kit';


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
      <Row gutter={[16, 16]} >
        <Col span={24} style={{ height: 80 }} />
        <Col span={24}>
          <Typography.Title level={3} align="center">{name}</Typography.Title>
          <p align="center">Version {version}</p>
        </Col>
        <Col span={24}>
          <Typography.Title level={5} align="center">Oops! The application couldn't load properly</Typography.Title>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]} justify="center" align="middle" >
            <Col>
              <Button
                type="primary"
                icon={<Icon name="trash-outline" />}
                onClick={this.remove}
              >Remove</Button>
            </Col>
            <Col>
              <Button
                type="text"
                icon={<Icon name="help-buoy-outline" />}
                onClick={this.support}
              >Support</Button>
            </Col>
          </Row>
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