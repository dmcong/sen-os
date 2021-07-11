import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { Badge, Col, Button, Icon } from 'sen-kit';
import { DynamicLogo } from 'helpers/loader';


const Item = forwardRef(({ id, disabled, onClose, ...rest }, ref) => {
  return <Col>
    <Badge count={disabled ? 0 : <Button
      type="primary"
      size="small"
      shape="circle"
      onClick={() => onClose(id)}
    >
      <Icon name="close-outline" />
    </Button>}>
      <DynamicLogo {...rest} name={id} ref={ref} />
    </Badge>
  </Col>
})

Item.defaultProps = {
  disabled: false,
  onClose: () => { },
}

Item.propTypes = {
  id: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClose: PropTypes.func,
}

export default Item;