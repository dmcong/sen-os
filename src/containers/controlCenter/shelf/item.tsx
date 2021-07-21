import { forwardRef } from 'react'

import { Badge, Col, Button, Icon, Spin } from 'sen-kit'
import { DynamicLogo } from 'helpers/loader'

const Item = forwardRef<HTMLElement, any>(
  ({ id, disabled = false, onClose = () => {}, loading, ...rest }, ref) => {
    const action = () => {
      if (disabled) return 0
      if (loading) return <Spin />
      return (
        <Button type="primary" size="small" shape="circle" onClick={onClose}>
          <Icon name="close-outline" />
        </Button>
      )
    }
    return (
      <Col>
        <Badge count={action()}>
          <DynamicLogo {...rest} name={id} ref={ref} />
        </Badge>
      </Col>
    )
  },
)

export default Item
