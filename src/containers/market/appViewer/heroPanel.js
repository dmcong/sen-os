import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Card, Typography, Divider } from 'sen-kit';

import metadata, { DynamicPanel } from 'helpers/loader';


const TitleAndValue = ({ title, value, divider = false }) => {
  return <Row gutter={[8, 8]}>
    <Col span={24}>
      <Row gutter={[8, 8]}>
        <Col flex="auto">
          <Typography.Text type="secondary">{title}</Typography.Text>
        </Col>
        <Col>
          <Typography.Text>{value}</Typography.Text>
        </Col>
      </Row>
    </Col>
    {divider ? <Col span={24}>
      <Divider style={{ marginTop: 0, marginBottom: 8 }} />
    </Col> : null}
  </Row>
}

const HeroPanel = ({ appName }) => {
  const { version, description, author: { name, email } } = metadata(appName);

  return <Row gutter={[16, 16]}>
    <Col span={24}>
      <Card className="shadowed" bodyStyle={{ padding: 0 }} bordered={false}>
        <DynamicPanel appName={appName} />
      </Card>
    </Col>
    <Col span={24}>
      <Card className="shadowed">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Typography.Title level={3}>Widget Info</Typography.Title>
          </Col>
          <Col span={24}>
            <TitleAndValue title="Name" value={appName} divider />
          </Col>
          <Col span={24}>
            <TitleAndValue title="Version" value={version} divider />
          </Col>
          <Col span={24}>
            <TitleAndValue title="Author" value={name} divider />
          </Col>
          <Col span={24}>
            <TitleAndValue title="Support" value={email} divider />
          </Col>
          <Col span={24}>
            <TitleAndValue title="Description" value={description} />
          </Col>
        </Row>
      </Card>
    </Col>
  </Row>
}

HeroPanel.propTypes = {
  appName: PropTypes.string.isRequired,
}

export default HeroPanel;