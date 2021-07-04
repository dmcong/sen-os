import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';

import { Row, Col, Icon, Button } from 'sen-kit';
import Spot from './spot';

const TYPE = 'logo';

const DroppableZone = (props) => {
  const [silent, setSilent] = useState(false);
  const { index, page, onClose, onHover, disabled } = props;
  // Utility
  const inferPosition = (item, monitor) => {
    const draggedIndex = item.index;
    const draggedPage = item.page;
    const hoveredIndex = index;
    const hoveredPage = page;
    setSilent(draggedPage === hoveredPage);
    return {
      current: { index: draggedIndex, page: draggedPage },
      next: { index: hoveredIndex, page: hoveredPage },
    }
  }
  // Drop hook
  const [{ isOver }, drop] = useDrop(() => ({
    accept: TYPE,
    canDrop: () => !disabled,
    hover: (item, monitor) => onHover(inferPosition(item, monitor)),
    collect: monitor => ({ isOver: monitor.isOver() }),
  }), [TYPE]);
  // Render
  return <Row
    gutter={[16, 16]}
    align={index ? 'start' : 'middle'}
    style={{ minHeight: 80 }}
    ref={drop}
  >
    <Col>
      {index ? null : <Button
        type="text"
        className="btnContained"
        icon={<Icon name="close-outline" />}
        onClick={onClose}
      />}
    </Col>
    {isOver && !silent ? <Col> <Spot /> </Col> : null}
  </Row>
}

DroppableZone.defaultProps = {
  disabled: false,
  onClose: () => { },
  onHover: () => { },
}

DroppableZone.propTypes = {
  page: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
  onClose: PropTypes.func,
  onHover: PropTypes.func,
}

export default DroppableZone;