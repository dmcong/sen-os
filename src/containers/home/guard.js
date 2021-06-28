import React from 'react';
import PropTypes from 'prop-types'
import { Row, Col, Widget, Typography, Button, Icon } from 'sen-kit';

/**
 * Removed Application
 */
const Gaurd = ({ appName }) => {
  const remove = () => {
    return console.log(appName);
  }

  return <Widget type="glass">
    <Row gutter={[16, 16]} >
      <Col span={24} style={{ height: 80 }} />
      <Col span={24}>
        <Typography.Title level={3} align="center">{appName}</Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Title level={5} align="center">Oops! The application possibly had been removed from the market</Typography.Title>
      </Col>
      <Col span={24}>
        <Row gutter={[16, 16]} justify="center" align="middle" >
          <Col>
            <Button
              type="primary"
              icon={<Icon name="trash-outline" />}
              onClick={remove}
            >Remove</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </Widget>
}

Gaurd.propTypes = {
  appName: PropTypes.string.isRequired
}

export default Gaurd;