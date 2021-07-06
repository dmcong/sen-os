import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Card, Button, Typography } from 'sen-kit';
import metadata, { DynamicLogo } from 'helpers/loader';

const AppTicket = ({ appName, installed, onClick, onAdd }) => {
  const { description } = metadata(appName);
  return <Card style={{ backgroundColor: '#181C36' }} bordered={false}>
    <Row gutter={[16, 16]} wrap={false}>
      <Col>
        <DynamicLogo name={appName} title={false} onClick={onClick} />
      </Col>
      <Col flex="auto">
        <Typography.Title level={5} style={{ margin: 0 }}>{appName}</Typography.Title>
        <Typography.Text type="secondary">{description}</Typography.Text>
      </Col>
      <Col>
        {installed ? <Button
          type="text"
          shape="round"
          className="btnContained"
          onClick={onClick}
        >View</Button> : <Button
          type="text"
          shape="round"
          className="btnContained"
          onClick={onAdd}
        >Add</Button>}
      </Col>
    </Row>
  </Card>
}

AppTicket.defaultProps = {
  onClick: () => { },
  onAdd: () => { },
  installed: false,
}

AppTicket.propTypes = {
  appName: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onAdd: PropTypes.func,
  installed: PropTypes.bool,
}

export default AppTicket;