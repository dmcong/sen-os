import React from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Card, Typography, Avatar } from 'sen-kit';

const CategoryCard = ({ category, onClick }) => {
  const src = `https://source.unsplash.com/random/?${category}`;
  return <Card hoverable onClick={onClick}>
    <Row gutter={[16, 16]} align="middle" wrap={false}>
      <Col flex="auto">
        <Typography.Text type="secondary">Click to explore</Typography.Text>
        <Typography.Title level={3} style={{ margin: 0 }}>{category}</Typography.Title>
      </Col>
      <Col>
        <Avatar src={src} size={72} />
      </Col>
    </Row>
  </Card>
}

CategoryCard.defaultProps = {
  onClick: () => { }
}

CategoryCard.propTypes = {
  category: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export default CategoryCard;