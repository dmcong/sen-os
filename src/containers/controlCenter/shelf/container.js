import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { Row, Col, Button, Icon } from 'sen-kit';
import './style.less';


const Container = forwardRef(({ index, disabled, onClose, children }, ref) => {
  return <Col span={24} className={`zone ${disabled ? 'passive' : 'active'}`} ref={ref} >
    <Row gutter={[16, 16]} align={children.length ? 'start' : 'middle'} style={{ height: '100%' }}>
      {children.length ? null : <Col>
        <Button
          type="text"
          className="contained"
          icon={<Icon name="close-outline" />}
          onClick={() => onClose(index)}
        />
      </Col>}
      {children}
    </Row>
  </Col>
});

Container.defaultProps = {
  disabled: false,
  onClose: () => { },
}

Container.propTypes = {
  index: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  onClose: PropTypes.func,
}

export default Container;