import { forwardRef } from 'react'

import { Badge, Col, Button, Icon } from 'sen-kit'
import { DynamicLogo } from 'helpers/loader'

const Item = forwardRef<HTMLElement, any>(
  ({ id, disabled = false, onClose = () => {}, ...rest }, ref) => {
    return (
      <Col>
        <Badge
          count={
            disabled ? (
              0
            ) : (
              <Button
                type="primary"
                size="small"
                shape="circle"
                onClick={() => onClose(id)}
              >
                <Icon name="close-outline" />
              </Button>
            )
          }
        >
          <DynamicLogo {...rest} name={id} ref={ref} />
        </Badge>
      </Col>
    )
  },
)

export default Item
