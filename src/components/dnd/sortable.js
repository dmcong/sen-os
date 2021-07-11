import React, { Fragment, Children, cloneElement, useState } from 'react';
import PropTypes from 'prop-types';
import {
  DndContext, closestCenter, MouseSensor, TouchSensor,
  useSensor, useSensors, DragOverlay,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


/**
 * Sortable Wrapper
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
 * Sortable DnD
 */
const SortableDnD = ({
  ids, disabled, onChange,
  Item, itemPropsFunc, Wrapper, wrapperProps, overlayStyle
}) => {
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const onDragStart = ({ active }) => {
    setActiveId(active.id);
  }
  const onDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      const newIds = arrayMove(ids, ids.indexOf(active.id), ids.indexOf(over.id));
      onChange(newIds);
    }
  }

  return <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
  >
    <Wrapper {...wrapperProps}>
      <SortableContext items={ids}>
        {ids.map(id => <SortableWrapper key={id} id={id} disabled={disabled}>
          <Item {...itemPropsFunc(id)} />
        </SortableWrapper>)}
      </SortableContext>
      <DragOverlay style={overlayStyle}>
        {<Item {...itemPropsFunc(activeId)} />}
      </DragOverlay>
    </Wrapper>
  </DndContext>
}

SortableDnD.defaultProps = {
  disabled: false,
  itemPropsFunc: () => { },
  Wrapper: Fragment,
  wrapperProps: {},
  onChange: () => { },
  overlayStyle: {},
}

SortableDnD.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.string).isRequired,
  Item: PropTypes.elementType.isRequired,
  itemPropsFunc: PropTypes.func,
  Wrapper: PropTypes.elementType,
  wrapperProps: PropTypes.object,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  overlayStyle: PropTypes.object,
}

/**
 * Exports
 */
export default SortableDnD;