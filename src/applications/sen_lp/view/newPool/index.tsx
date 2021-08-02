import { Fragment, useState } from 'react'

import { Row, Col, Modal, Icon, Button } from '@senswap/sen-ui'

const NewPool = () => {
  const [visible, setVisible] = useState(false)

  return (
    <Fragment>
      <Button
        type="primary"
        size="small"
        icon={<Icon name="add-outline" />}
        onClick={() => setVisible(!visible)}
      >
        New
      </Button>
      <Modal
        visible={visible}
        onCancel={() => setVisible(false)}
        closeIcon={<Icon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}></Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default NewPool
