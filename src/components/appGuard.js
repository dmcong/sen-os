import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Widget, Typography, Button, Icon } from 'sen-kit';

import { DynamicLogo } from 'helpers/loader';


/**
 * Removed Application
 */
const AppGaurd = ({ name }) => {

  const remove = () => {
    return console.log(name);
  }

  return <Widget type="glass">
    <Row gutter={[8, 8]} style={{ height: '100%' }} align="middle" justify="center">
      <Col>
        <DynamicLogo name={name} title={false} />
      </Col>
      <Col span={24}>
        <Typography.Title level={4} align="center">{name}</Typography.Title>
      </Col>
      <Col span={24}>
        <p align="center">Oops! The application possibly had been removed from the market</p>
      </Col>
      <Col>
        <Button
          type="primary"
          icon={<Icon name="trash-outline" />}
          onClick={remove}
        >Remove</Button>
      </Col>
    </Row>
  </Widget>
}

AppGaurd.propTypes = {
  name: PropTypes.string.isRequired
}

export default AppGaurd;