import React, { Fragment, Children, cloneElement, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  DndContext, DragOverlay, closestCorners, rectIntersection,
  MouseSensor, TouchSensor, useSensor, useSensors, useDroppable,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


/**
 * Multiple Wrapper
 */
const MultipleWrapper = ({ id, children, disabled }) => {
  const child = Children.only(children);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, disabled });
  const scale = { scaleX: 1, scaleY: 1 }
  const style = { transform: CSS.Transform.toString({ ...transform, ...scale }), transition }
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
 * Multiple Container
 */
const MultipleContainer = ({ index, children, disabled }) => {
  const { setNodeRef } = useDroppable({
    id: `DroppableZone-${index}`,
    data: { isDroppableZone: true, index },
    disabled
  });
  const child = Children.only(children);
  return cloneElement(child, { ref: setNodeRef });
}

MultipleContainer.defaultProps = {
  disabled: false,
}

MultipleContainer.propTypes = {
  index: PropTypes.number.isRequired,
  children: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
}

/**
 * Sortable DnD
 */
const MultipleDnD = ({
  ids, disabled, onChange, Item, itemPropsFunc,
  Container, containerPropsFunc, Wrapper, wrapperProps, overlayStyle
}) => {
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
  useEffect(() => setItems(ids), [ids]);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const findContainer = ({ id, data }) => {
    let containerIndex = null;
    let itemIndex = null;
    if (data?.current?.isDroppableZone) {
      containerIndex = data.current.index;
      itemIndex = -1;
    } else {
      items.forEach((container, i) => container.forEach((item, j) => {
        if (item !== id) return;
        containerIndex = i;
        itemIndex = j;
      }));
    }
    return [containerIndex, itemIndex];
  }
  const mixedStrategy = (rects, rect, ...agrs) => {
    const intersecting = rectIntersection(rects, rect);
    return intersecting ? intersecting : closestCorners(rects, rect);
  }

  const onDragStart = ({ active }) => setActiveId(active.id);
  const onDragOver = ({ active, over }) => {
    const [activeContainerIndex] = findContainer(active);
    const [overContainerIndex, overIndex] = findContainer(over);
    if (activeContainerIndex !== overContainerIndex) {
      const newItems = [...items];
      const activeContainer = [...newItems[activeContainerIndex]];
      const overContainer = [...newItems[overContainerIndex]];
      activeContainer.splice(activeContainer.indexOf(active.id), 1);
      if (overIndex === -1) overContainer.push(active.id);
      else overContainer.splice(overIndex, 0, active.id);
      newItems[activeContainerIndex] = activeContainer;
      newItems[overContainerIndex] = overContainer;
      setItems(newItems);
    }
  }
  const onDragEnd = ({ active, over }) => {
    const [activeContainerIndex] = findContainer(active);
    const [overContainerIndex] = findContainer(over);
    if (activeContainerIndex === overContainerIndex) {
      const newItems = [...items];
      const container = [...newItems[activeContainerIndex]];
      const newContainer = arrayMove(container, container.indexOf(active.id), container.indexOf(over.id));
      newItems[activeContainerIndex] = newContainer;
      onChange(newItems);
    }
  }

  return <DndContext
    sensors={sensors}
    collisionDetection={mixedStrategy}
    onDragStart={onDragStart}
    onDragOver={onDragOver}
    onDragEnd={onDragEnd}
  >
    <Wrapper {...wrapperProps}>
      {items.map((container, i) => <SortableContext key={i} items={container}>
        <MultipleContainer index={i}>
          <Container {...containerPropsFunc(i)} >
            {container.map(id => <MultipleWrapper key={id} id={id} disabled={disabled}>
              <Item {...itemPropsFunc(id)} />
            </MultipleWrapper>)}
          </Container>
        </MultipleContainer>
      </SortableContext>)}
      <DragOverlay style={overlayStyle}>
        {activeId ? <Item {...itemPropsFunc(activeId)} /> : null}
      </DragOverlay>
    </Wrapper>
  </DndContext>
}

MultipleDnD.defaultProps = {
  disabled: false,
  Wrapper: Fragment,
  wrapperProps: {},
  Container: Fragment,
  containerPropsFunc: () => { },
  onChange: () => { },
  overlayStyle: {},
}

MultipleDnD.propTypes = {
  ids: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  Item: PropTypes.elementType.isRequired,
  itemPropsFunc: PropTypes.func,
  Container: PropTypes.elementType,
  containerPropsFunc: PropTypes.func,
  Wrapper: PropTypes.elementType,
  wrapperProps: PropTypes.object,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  overlayStyle: PropTypes.object,
}


/**
 * Exports
 */
export default MultipleDnD;