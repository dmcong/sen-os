import { forwardRef } from 'react'

import { Row, Col, Button, Icon } from 'sen-kit'
import './style.less'

const Container = forwardRef<HTMLElement, any>(
  ({ index, disabled, onClose, children }, ref) => {
    return (
      <Col
        span={24}
        className={`zone ${disabled ? 'passive' : 'active'}`}
        ref={ref}
      >
        <Row
          gutter={[16, 16]}
          align={children.length ? 'start' : 'middle'}
          style={{ height: '100%' }}
        >
          {children.length || disabled ? null : (
            <Col>
              <Button
                type="text"
                className="contained"
                icon={<Icon name="close-outline" />}
                onClick={() => onClose(index)}
              />
            </Col>
          )}
          {children}
        </Row>
      </Col>
    )
  },
)

export default Container
