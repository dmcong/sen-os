import React, { Fragment, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import {
  DndContext, closestCorners, MouseSensor, TouchSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Row } from 'sen-kit';


/**
 * Multiple Provider
 */
const MultipleProvider = ({ children, onChange }) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const onDragEnd = ({ active, over }) => {
  }
  const onDragOver = ({ active, over }) => {
  }

  return <DndContext
    sensors={sensors}
    collisionDetection={closestCorners}
    onDragEnd={onDragEnd}
    onDragOver={onDragOver}
  >
    {children}
  </DndContext>
}

MultipleProvider.defaultProps = {
  onChange: () => { },
}

MultipleProvider.propTypes = {
  onChange: PropTypes.func,
}

/**
 * Multiple Container
 */
const MultipleContainer = ({ children }) => {
  const ids = children.map(({ props: { id } }) => id);
  return <SortableContext items={ids}>
    <Row gutter={[16, 16]} >
      {children}
    </Row>
  </SortableContext>
}

MultipleContainer.defaultProps = {
}

MultipleContainer.propTypes = {
}

/**
 * Multiple Wrapper
 */
const MultipleWrapper = ({ id, children, disabled }) => {
  const child = Children.only(children);
  if (!id) throw new Error('Invalid id. The sortable components need an unique id.');
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled });
  // console.log(transform, transition)
  const style = { transform: CSS.Transform.toString({ ...transform }), transition }
  return cloneElement(child, { ref: setNodeRef, style, ...attributes, ...listeners });
}

MultipleWrapper.defaultProps = {
  disabled: false,
}

MultipleWrapper.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
}

/**
 * Exports
 */
export { MultipleProvider, MultipleContainer, MultipleWrapper }

