import {
  Component,
  Fragment,
  Children,
  cloneElement,
  useState,
  ExoticComponent,
} from 'react'
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/**
 * Sortable Wrapper
 */
const SortableWrapper = ({
  id,
  children,
  disabled = false,
}: {
  id: string
  children: JSX.Element
  disabled: boolean
}) => {
  const child = Children.only(children)
  if (!id)
    throw new Error('Invalid id. The sortable components need an unique id.')
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id, disabled })
  const style = {
    transform: CSS.Transform.toString({
      x: 0,
      y: 0,
      ...transform,
      scaleX: 1,
      scaleY: 1,
    }),
    transition,
  }
  return cloneElement(child, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  })
}

/**
 * Sortable DnD
 */
const SortableDnD = ({
  ids,
  disabled = false,
  onChange = () => {},
  Item,
  itemPropsFunc = () => ({}),
  Wrapper = Fragment,
  wrapperProps = {},
  overlayStyle = {},
}: {
  ids: string[]
  disabled?: boolean
  onChange?: (ids: string[]) => void
  Item: typeof Component | ExoticComponent
  itemPropsFunc?: (id: string) => object
  Wrapper?: typeof Component | ExoticComponent
  wrapperProps?: object
  overlayStyle?: object
}) => {
  const [activeId, setActiveId] = useState<string>('')
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const onDragStart = ({ active }: any) => {
    setActiveId(active.id)
  }
  const onDragEnd = ({ active, over }: any) => {
    if (active.id !== over.id) {
      const newIds = arrayMove(
        ids,
        ids.indexOf(active.id),
        ids.indexOf(over.id),
      )
      onChange(newIds)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <Wrapper {...wrapperProps}>
        <SortableContext items={ids}>
          {ids.map((id: string) => (
            <SortableWrapper key={id} id={id} disabled={disabled}>
              <Item {...itemPropsFunc(id)} />
            </SortableWrapper>
          ))}
        </SortableContext>
        <DragOverlay style={overlayStyle}>
          {<Item {...itemPropsFunc(activeId)} />}
        </DragOverlay>
      </Wrapper>
    </DndContext>
  )
}

/**
 * Exports
 */
export default SortableDnD
