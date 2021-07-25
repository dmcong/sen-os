import { useEffect, useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Row, Col, Button, Icon } from '@senswap/sen-ui'
import { MultipleDnd } from 'components/dnd'
import Container from './container'
import Item from './item'

import { RootDispatch, RootState } from 'store'
import { loadApps, updateApps, uninstallApp } from 'store/babysitter.reducer'
import { notify, toggleControlCenter } from 'store/ui.reducer'

const Shelf = ({ settings = false }: { settings: boolean }) => {
  const [uninstallingId, setUninstallingId] = useState('')

  const dispatch = useDispatch<RootDispatch>()
  const history = useHistory()
  const { address } = useSelector((state: RootState) => state.wallet)
  const { apps } = useSelector((state: RootState) => state.babysitter)

  const getApps = useCallback(async () => {
    if (!account.isAddress(address)) return
    try {
      await dispatch(loadApps()).unwrap()
    } catch (er) {
      await dispatch(notify({ type: 'error', description: er.message }))
    }
  }, [address, dispatch])

  const onAddPage = async () => {
    const newApps = [...apps]
    newApps.push([])
    return await dispatch(updateApps(newApps))
  }

  const onRemovePage = async (index: number) => {
    const newApps = apps.filter((row, i) => row.length || i !== index)
    return await dispatch(updateApps(newApps))
  }

  const uninstall = async (appName: string) => {
    await setUninstallingId(appName)
    await dispatch(uninstallApp(appName))
    await setUninstallingId('')
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
          disabled: !settings || (uninstallingId && uninstallingId !== id),
          onClose: () => uninstall(id),
          onClick: () => to(id),
          loading: uninstallingId === id,
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
