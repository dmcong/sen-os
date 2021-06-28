import React from 'react';
import PropTypes from 'prop-types';

import { Tag } from 'sen-kit';

import util from 'helpers/util';

const Keyword = ({ title, onClick }) => {
  const bgColor = util.randomColor(title, 'light');
  const txtColor = util.randomColor(bgColor);
  return <Tag
    onClick={onClick}
    style={{ cursor: 'pointer' }}
    color={bgColor}
  >
    <span style={{ color: txtColor }}>{title}</span>
  </Tag>
}

Keyword.defaultProps = {
  onClick: () => { }
}

Keyword.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export default Keyword;