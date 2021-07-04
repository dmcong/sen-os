import React from 'react';
import PropTypes from 'prop-types';

import { Space, TweenOne } from 'sen-kit';

const Dot = ({ active, onClick }) => {
  return <TweenOne animation={{ scale: active ? 1.65 : 1, duration: 250 }}>
    <div
      style={{
        width: 15,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'white',
        cursor: 'pointer',
      }}
      className={active ? 'neon' : ''}
      onClick={onClick}
    />
  </TweenOne>
}

const DotPagination = ({ total, page, onClick }) => {
  let counter = [];
  while (counter.length < total) counter.push(counter.length);
  return <Space align="center" size="middle">
    {counter.map(i => <Dot
      key={i}
      active={page === i}
      onClick={() => onClick(i)}
    />)}
  </Space>
}

DotPagination.defaultProps = {
  onClick: () => { },
  total: 0,
  page: 0,
}

DotPagination.propTypes = {
  onClick: PropTypes.func,
  total: PropTypes.number,
  page: PropTypes.number,
}

export default DotPagination;