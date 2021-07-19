import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import ssjs from 'senswapjs'

import { Row, Col, Button, Icon } from 'sen-kit'
import { MultipleDnd } from 'components/dnd'
import Container from './container'
import Item from './item'

import PDB from 'helpers/pdb'
import { RootDispatch, RootState } from 'store'
import { loadApps, updateApps } from 'store/babysitter.reducer'
import { notify, toggleControlCenter } from 'store/ui.reducer'

const Shelf = ({ settings = false }: { settings: boolean }) => {
  const dispatch = useDispatch<RootDispatch>()
  const history = useHistory()
  const { address } = useSelector((state: RootState) => state.wallet)
  const { apps } = useSelector((state: RootState) => state.babysitter)

  const getApps = useCallback(async () => {
    if (!ssjs.isAddress(address)) return
    try {
      await dispatch(loadApps(null)).unwrap()
    } catch (er) {
      await dispatch(notify({ type: 'error', description: er.message }))
    }
  }, [address, dispatch])

  const uninstallApp = async (appName: string) => {
    const pdb = new PDB(address)
    const newApps = apps.map((page) => page.filter((name) => name !== appName))
    await dispatch(updateApps(newApps))
    return await pdb.dropInstance(appName)
  }

  const onAddPage = async () => {
    const newApps = [...apps]
    newApps.push([])
    return await dispatch(updateApps(newApps))
  }

  const onRemovePage = async (index: number) => {
    const newApps = apps.filter((row, i) => row.length || i !== index)
    return await dispatch(updateApps(newApps))
  }

  const to = async (id: string) => {
    if (settings) return
    const page = apps.findIndex((row) => row.includes(id))
    await dispatch(toggleControlCenter(false))
    return history.push(`/home?page=${page}&appName=${id}`)
  }

  useEffect(() => {
    getApps()
  }, [getApps])

  return (
    <Row gutter={[16, 16]}>
      <MultipleDnd
        ids={apps}
        Item={Item}
        itemPropsFunc={(id) => ({
          id,
          disabled: !settings,
          onClose: uninstallApp,
          onClick: () => to(id),
        })}
        Container={Container}
        containerPropsFunc={(index) => ({
          disabled: !settings,
          index,
          onClose: onRemovePage,
        })}
        disabled={!settings}
        onChange={(newApps: string[][]) => dispatch(updateApps(newApps))}
        overlayStyle={{ opacity: 0.5 }}
      />
      {/* I want to add more */}
      {settings ? (
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col>
              <Button
                type="text"
                className="contained"
                icon={<Icon name="add-outline" />}
                onClick={onAddPage}
              />
            </Col>
          </Row>
        </Col>
      ) : null}
    </Row>
  )
}

export default Shelf
