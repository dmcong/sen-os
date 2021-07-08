import React from 'react';

import { Row, Col, Card, Typography, Button, Space, Icon } from 'sen-kit';

const HeroPanel = () => {
  const style = {
    backgroundImage: `url("https://source.unsplash.com/random/?liquid,abstract")`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
  }
  return <Card style={style} bordered={false}>
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Welcome to SenMarket!</Typography.Title>
        <Typography.Title level={1}>Explore what you need</Typography.Title>
      </Col>
      <Col span={24} style={{ height: 96 }} />
      <Col span={24}>
        <Button type="text" className="btnContained">
          <Space>
            <Typography.Text>Let's go</Typography.Text>
            <Icon name="arrow-forward-outline" />
          </Space>
        </Button>
      </Col>
    </Row>
  </Card>
}

export default HeroPanel;