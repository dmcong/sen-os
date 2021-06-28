import React from 'react';
import PropTypes from 'prop-types';

import { Tag } from 'sen-kit';

const Keyword = ({ title, onClick }) => {
  return <Tag
    onClick={onClick}
    style={{ cursor: 'pointer' }}
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