import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag, useDrop } from 'react-dnd';

import { DynamicLogo } from 'helpers/loader';

const TYPE = 'logo';

const DraggbleLogo = ({ page, index, name, onClick, onHover, onDrop }) => {
  // Ref hook
  const ref = useRef(null);
  // Utility
  const inferPosition = (item, monitor) => {
    const draggedIndex = item.index;
    const draggedPage = item.page;
    const hoveredIndex = index;
    const hoveredPage = page;
    if (draggedIndex === hoveredIndex && draggedPage === hoveredPage) return {
      current: { index: draggedIndex, page: draggedPage },
      next: { index: draggedIndex, page: draggedPage },
    }
    const hoveredBoundingRect = ref.current.getBoundingClientRect();
    const hoveredMiddleX = (hoveredBoundingRect.right + hoveredBoundingRect.left) / 2;
    const { x: pointerX } = monitor.getClientOffset();
    let sign = 0;
    // Drag left to right
    if (draggedIndex < hoveredIndex) {
      if (pointerX > hoveredMiddleX) sign = 0;
      if (pointerX < hoveredMiddleX) sign = -1;
    }
    // Drag right to left
    if (draggedIndex > hoveredIndex) {
      if (pointerX > hoveredMiddleX) sign = 1;
      if (pointerX < hoveredMiddleX) sign = 0;
    }
    return {
      current: { index: draggedIndex, page: draggedPage },
      next: { index: hoveredIndex + sign, page: hoveredPage }
    }
  }
  // Drag hook
  const [{ isDragging }, drag] = useDrag(() => ({
    type: TYPE,
    item: () => ({ page, index }),
    collect: monitor => ({ isDragging: monitor.isDragging() }),
    end: (item, monitor) => onDrop(inferPosition(item, monitor)),
  }));
  // Drop hook
  const [, drop] = useDrop(() => ({
    accept: TYPE,
    hover: (item, monitor) => {
      if (!ref.current) return;
      return onHover(inferPosition(item, monitor));
    },
    collect: monitor => ({ isOver: monitor.isOver() }),
  }));
  // Render
  drag(drop(ref));
  return <DynamicLogo
    ref={ref}
    name={name}
    onClick={onClick}
    style={{ opacity: isDragging ? 0.1 : 1 }}
  />
}

DraggbleLogo.defaultProps = {
  onClick: () => { },
  onHover: () => { },
  onDrop: () => { },
}

DraggbleLogo.propTypes = {
  page: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onHover: PropTypes.func,
  onDrop: PropTypes.func,
}

export default DraggbleLogo;