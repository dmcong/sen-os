import React, { useState } from 'react'
import { Modal, Icon, Typography, Row, Col, Button } from '@senswap/sen-ui'
import CollectionName from './components/collectionName'
import NewSchema from './components/newSchema'

export default function NewCollection(props) {
  const { isOpen, onClose } = props
  const [name, setName] = useState('')
  const [schema, setSchema] = useState([])

  function onChangeCol(newColSchema) {
    for (const idx in schema) {
      const colSchema = schema[idx]
      if (colSchema.id === newColSchema.id) {
        schema[idx] = newColSchema
        break
      }
    }
    setSchema([...schema])
  }

  function onRemoveCol(id) {
    const newSchema = []
    for (const idx in schema) {
      const colSchema = schema[idx]
      if (colSchema.id !== id) {
        newSchema.push(colSchema)
      }
    }
    setSchema(newSchema)
  }

  function onNewCol() {
    let new_key = 'default'
    setSchema([
      {
        key: new_key,
        type: 'string',
        id: Date.now(),
      },
      ...schema,
    ])
  }

  function handleCreate() {
    console.log('Create ne')
  }
  return (
    <Modal
      visible={isOpen}
      onCancel={() => onClose()}
      closeIcon={<Icon name="close" />}
      footer={null}
      destroyOnClose={true}
      centered={true}
    >
      <Row gutter={[16, 16]}>
        {/* Title */}
        <Col span={24}>
          <Typography.Title level={5}>New Collection</Typography.Title>
        </Col>
        {/* Name */}
        <Col span={24} style={{ marginBottom: 20 }}>
          <CollectionName
            onChange={(e) => setName(e.target.value)}
            value={name}
          ></CollectionName>
        </Col>
        {/* Schema */}
        <Col span={24}>
          <NewSchema
            onNew={onNewCol}
            schema={schema}
            onChange={onChangeCol}
            onRemove={onRemoveCol}
          ></NewSchema>
        </Col>
        {/* Button */}
        <Col span={24}>
          <Row gutter={[4, 4]} justify="end">
            <Col span={24}>
              <Button type="primary" onClick={() => handleCreate()} block>
                New Collection
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  )
}
