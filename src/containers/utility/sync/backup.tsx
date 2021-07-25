import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Row, Col, Icon, Button } from '@senswap/sen-ui'
import SyncLink from './syncLink'
import Policy from './policy'
import Preview from './preview'

import PDB from 'helpers/pdb'
import { RootState, RootDispatch } from 'store'
import { notify } from 'store/ui.reducer'

const Backup = () => {
  const [link, setLink] = useState('')
  const [reviewed, setReviewed] = useState(false)
  const [data, setData] = useState({})
  const dispatch = useDispatch<RootDispatch>()

  const { address } = useSelector((state: RootState) => state.wallet)
  const pdb = useMemo(() => {
    if (!account.isAddress(address)) return null
    return new PDB(address)
  }, [address])

  useEffect(() => {
    ;(async () => {
      if (!pdb) return
      const data = await pdb.all()
      return setData(data)
    })()
  }, [pdb, address])

  const onBackup = async () => {
    if (!pdb) return
    const cid = await pdb.backup()
    await setLink(`${window.location.origin}/home?sync=${cid}`)
    await dispatch(
      notify({
        type: 'success',
        description:
          'A backup link has been generated. You need to copy and save it to a safe palce.',
      }),
    )
  }

  if (!reviewed) return <Policy onClick={() => setReviewed(true)} />
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <SyncLink value={link} onChange={setLink} />
      </Col>
      <Col span={24}>
        <Preview value={data} />
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          icon={<Icon name="color-wand-outline" />}
          onClick={onBackup}
          disabled={!reviewed}
          block
        >
          Gen a backup link
        </Button>
      </Col>
    </Row>
  )
}

export default Backup
