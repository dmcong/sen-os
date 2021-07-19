import {
  Component,
  Fragment,
  Children,
  cloneElement,
  useState,
  useEffect,
  ExoticComponent,
} from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  rectIntersection,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

/**
 * Multiple Wrapper
 */
const MultipleWrapper = ({
  id,
  children,
  disabled = false,
}: {
  id: string
  children: JSX.Element
  disabled?: boolean
}) => {
  const child = Children.only(children)
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
 * Multiple Container
 */
const MultipleContainer = ({
  index,
  children,
  disabled = false,
}: {
  index: string | number
  children: JSX.Element
  disabled?: boolean
}) => {
  const { setNodeRef } = useDroppable({
    id: `DroppableZone-${index}`,
    data: { isDroppableZone: true, index },
    disabled,
  })
  const child = Children.only(children)
  return cloneElement(child, { ref: setNodeRef })
}

/**
 * Sortable DnD
 */
const MultipleDnD = ({
  ids,
  disabled = false,
  onChange = () => {},
  Item,
  itemPropsFunc = () => ({}),
  Container = Fragment,
  containerPropsFunc = () => ({}),
  Wrapper = Fragment,
  wrapperProps,
  overlayStyle,
}: {
  ids: string[][]
  disabled?: boolean
  onChange?: (ids: string[][]) => void
  Item: ExoticComponent
  itemPropsFunc?: (id: string) => object
  Container?: typeof Component | ExoticComponent
  containerPropsFunc?: (id: string | number) => object
  Wrapper?: typeof Component | ExoticComponent
  wrapperProps?: object
  overlayStyle?: object
}) => {
  const [items, setItems] = useState<string[][]>([])
  const [activeId, setActiveId] = useState<string>('')
  useEffect(() => setItems(ids), [ids])
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const findContainer = ({ id, data }: { id: string; data: any }) => {
    let containerIndex = null
    let itemIndex = null
    if (data?.current?.isDroppableZone) {
      containerIndex = data.current.index
      itemIndex = -1
    } else {
      items.forEach((container, i) =>
        container.forEach((item: string, j: number) => {
          if (item !== id) return
          containerIndex = i
          itemIndex = j
        }),
      )
    }
    return [containerIndex, itemIndex]
  }
  const mixedStrategy = (
    ...args: Parameters<typeof rectIntersection | typeof closestCorners>
  ) => {
    const intersecting = rectIntersection(...args)
    return intersecting ? intersecting : closestCorners(...args)
  }

  const onDragStart = ({ active }: any) => setActiveId(active.id)
  const onDragOver = ({ active, over }: any) => {
    const [activeContainerIndex] = findContainer(active)
    const [overContainerIndex, overIndex] = findContainer(over)
    if (activeContainerIndex !== overContainerIndex) {
      const newItems = [...items]
      const activeContainer = [...newItems[activeContainerIndex]]
      const overContainer = [...newItems[overContainerIndex]]
      activeContainer.splice(activeContainer.indexOf(active.id), 1)
      if (overIndex === -1) overContainer.push(active.id)
      else overContainer.splice(overIndex, 0, active.id)
      newItems[activeContainerIndex] = activeContainer
      newItems[overContainerIndex] = overContainer
      setItems(newItems)
    }
  }
  const onDragEnd = ({ active, over }: any) => {
    const [activeContainerIndex] = findContainer(active)
    const [overContainerIndex] = findContainer(over)
    if (activeContainerIndex === overContainerIndex) {
      const newItems = [...items]
      const container = [...newItems[activeContainerIndex]]
      const newContainer = arrayMove(
        container,
        container.indexOf(active.id),
        container.indexOf(over.id),
      )
      newItems[activeContainerIndex] = newContainer
      onChange(newItems)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={mixedStrategy}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <Wrapper {...wrapperProps}>
        {items.map((container: string[], i: number) => (
          <SortableContext key={i} items={container}>
            <MultipleContainer index={i}>
              <Container {...containerPropsFunc(i)}>
                {container.map((id) => (
                  <MultipleWrapper key={id} id={id} disabled={disabled}>
                    <Item {...itemPropsFunc(id)} />
                  </MultipleWrapper>
                ))}
              </Container>
            </MultipleContainer>
          </SortableContext>
        ))}
        <DragOverlay style={overlayStyle}>
          {activeId ? <Item {...itemPropsFunc(activeId)} /> : null}
        </DragOverlay>
      </Wrapper>
    </DndContext>
  )
}

/**
 * Exports
 */
export default MultipleDnD
