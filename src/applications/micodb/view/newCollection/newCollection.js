import React, { useState } from 'react'
import { Modal, Icon, Typography, Row, Col, Button } from '@senswap/sen-ui'
import CollectionName from './components/collectionName'
import NewSchema from './components/newSchema'
import { useDispatch } from 'react-redux'
import { createCollection } from '@/micodb/controller/main.controller'
import { useSenOs } from 'helpers/senos'

export default function NewCollection(props) {
  const { isOpen, onClose } = props
  const [name, setName] = useState('')
  const [schema, setSchema] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()

  const {
    senos: { notify },
  } = useSenOs()

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

  async function handleCreate() {
    setIsLoading(true)
    const bodySchema = {}
    for (const s of schema) {
      bodySchema[s.key] = s.type
    }

    const result = await dispatch(
      createCollection({ collection: name, schema: bodySchema }),
    )
    setIsLoading(false)

    const {
      payload: { error },
    } = result
    if (error) return notify({ type: 'error', description: error })
    setName('')
    setSchema([])
    notify({ type: 'success', description: "Create collection successfully!" })
    onClose()
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
              <Button
                type="primary"
                onClick={() => handleCreate()}
                block
                disabled={!name || !schema.length}
                icon={<Icon name="add-outline" />}
                loading={isLoading}
              >
                New Collection
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  )
}
