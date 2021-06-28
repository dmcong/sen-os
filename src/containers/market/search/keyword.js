import React from 'react';
import PropTypes from 'prop-types';

import { Tag } from 'sen-kit';

import util from 'helpers/util';

const Keyword = ({ title, onClick }) => {
  return <Tag
    onClick={onClick}
    style={{ cursor: 'pointer' }}
    color={util.randomColor(title)}
  >{title}</Tag>
}

Keyword.defaultProps = {
  onClick: () => { }
}

Keyword.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func,
}

export default Keyword;