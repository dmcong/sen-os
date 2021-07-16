import React from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import { Typography, Icon, Space } from 'sen-kit'

const arrow = (value) => {
  if (value > 0) return <Typography.Text type="success">
    <Icon name="arrow-up-circle" />
  </Typography.Text>
  if (value < 0) return <Typography.Text type="danger">
    <Icon name="arrow-down-circle" />
  </Typography.Text>
  return <Typography.Text type="warning">
    <Icon name="remove-circle" />
  </Typography.Text>
}

const percentage = (value) => {
  if (value > 0) return <Typography.Text type="success">
    {numeral(Math.abs(value)).format('0.[0]')}%
  </Typography.Text>
  if (value < 0) return <Typography.Text type="danger">
    {numeral(Math.abs(value)).format('0.[0]')}%
  </Typography.Text>
  return <Typography.Text type="warning">
    {numeral(Math.abs(value)).format('0.[0]')}%
  </Typography.Text>
}

const PriceChange = ({ value }) => {
  return <Space size={4}>
    {arrow(value)}
    {percentage(value)}
  </Space>
}

PriceChange.defaultProps = {
  value: 0,
}

PriceChange.propTypes = {
  value: PropTypes.number,
}

export default PriceChange;