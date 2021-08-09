import { Icon, Modal } from '@senswap/sen-ui'
import { useDispatch, useSelector } from 'react-redux'
import { closeGModal } from '@/micodb/controller/gmodal.controller'

export default function GModal() {
  const gmodal = useSelector((state) => state.gmodal)
  const dispatch = useDispatch()
  const { isOpen, dom } = gmodal

  return (
    <Modal
      visible={isOpen}
      onCancel={() => dispatch(closeGModal())}
      closeIcon={<Icon name="close" />}
      footer={null}
      destroyOnClose={true}
      centered={true}
    >
      {dom}
    </Modal>
  )
}
