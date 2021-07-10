import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import {
  DndContext, closestCenter, MouseSensor, TouchSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Row } from 'sen-kit';


/**
 * SortableProvider
 */
const SortableProvider = ({ children, onChange }) => {
  const ids = children.map(({ props: { id } }) => id);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const onDragEnd = (e) => {
    const { active, over } = e;
    if (!active || !over || active.id === over.id) return;
    const newIds = arrayMove(ids, ids.indexOf(active.id), ids.indexOf(over.id));
    return onChange(newIds);
  }

  return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
    <SortableContext items={ids}>
      <Row gutter={[16, 16]}>
        {children}
      </Row>
    </SortableContext>
  </DndContext>
}

SortableProvider.defaultProps = {
  onChange: () => { },
}

SortableProvider.propTypes = {
  onChange: PropTypes.func,
}

/**
 * SortableWrapper
 */
const SortableWrapper = ({ id, children, disabled }) => {
  const child = Children.only(children);
  if (!id) throw new Error('Invalid id. The sortable components need an unique id.');
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled });
  const scale = { scaleX: 1, scaleY: 1 }
  const style = { transform: CSS.Transform.toString({ ...transform, ...scale }), transition }
  return cloneElement(child, { ref: setNodeRef, style, ...attributes, ...listeners });
}

SortableWrapper.defaultProps = {
  disabled: false,
}

SortableWrapper.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
}

/**
 * Exports
 */
export { SortableProvider, SortableWrapper }