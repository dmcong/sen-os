import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ssjs from 'senswapjs'

import { Row, Col, Icon, Button } from 'sen-kit'
import Preview from './preview'
import SyncLink, { parseCID } from './syncLink'

import PDB from 'helpers/pdb'
import { RootState, RootDispatch } from 'store'
import { toggleSync, notify } from 'store/ui.reducer'

const Restore = () => {
  const [data, setData] = useState({})
  const [link, setLink] = useState('')
  const dispatch = useDispatch<RootDispatch>()

  const sync = parseCID(window.location.href)

  const { address } = useSelector((state: RootState) => state.wallet)
  const pdb = useMemo(() => {
    if (!ssjs.isAddress(address)) return null
    return new PDB(address)
  }, [address])

  useEffect(() => {
    if (sync)
      (async () => {
        await dispatch(toggleSync(true))
        await setLink(window.location.href)
      })()
  }, [dispatch, sync])
  useEffect(() => {
    if (link)
      (async () => {
        const cid = parseCID(link)
        if (!cid || !pdb) return await setData({})
        const data = await pdb._fetchAll(cid)
        return await setData(data)
      })()
  }, [link, pdb])

  const onRestore = async () => {
    const cid = parseCID(link)
    if (!pdb)
      return dispatch(
        notify({
          type: 'error',
          description: 'Please connect he wallet first',
        }),
      )
    if (!cid)
      return dispatch(
        notify({
          type: 'error',
          description: 'Invalid backup link format',
        }),
      )
    await pdb.restore(cid)
    await dispatch(toggleSync(false))
    return (window.location.href = '/home')
  }

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
          icon={<Icon name="push-outline" />}
          onClick={onRestore}
          disabled={!parseCID(link)}
          block
        >
          Restore
        </Button>
      </Col>
    </Row>
  )
}

export default Restore
