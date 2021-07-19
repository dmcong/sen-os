import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notification, Icon } from 'sen-kit'

import util from 'helpers/util'

/**
 * Interface & Utility
 */

type Infix = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'

type Notification = {
  type: 'error' | 'warning' | 'success' | 'info'
  description: string
  onClick?: void
}

export type State = {
  width: number
  infix: Infix
  touchable: boolean
  visibleControlCenter: boolean
  visibleSync: boolean
}

const getInfix = (): Infix => {
  const width = window.innerWidth
  if (width < 576) return 'xs'
  if (width < 768) return 'sm'
  if (width < 992) return 'md'
  if (width < 1200) return 'lg'
  if (width < 1400) return 'xl'
  return 'xxl'
}

/**
 * Store constructor
 */

const NAME = 'ui'
const initialState: State = {
  width: window.innerWidth,
  infix: getInfix(),
  touchable: util.isTouchable(),
  visibleControlCenter: false,
  visibleSync: false,
}

/**
 * Actions
 */

export const resize = createAsyncThunk(`${NAME}/resize`, async () => {
  const width = window.innerWidth
  const infix = getInfix()
  return { width, infix }
})

export const notify = createAsyncThunk(
  `${NAME}/notify`,
  async ({ type, description, onClick }: Notification) => {
    if (!type) throw new Error('Notification type is not provided')
    if (!description) throw new Error('Description is not provided')
    // Parse icon
    let icon = <Icon name="information-circle" style={{ color: '#37CDFA' }} />
    if (type === 'error')
      icon = <Icon name="alert-circle" style={{ color: '#F2323F' }} />
    if (type === 'warning')
      icon = <Icon name="warning" style={{ color: '#FCB017' }} />
    if (type === 'success')
      icon = <Icon name="checkmark-circle" style={{ color: '#3DBA4E' }} />
    notification[type]({
      message: type.toUpperCase(),
      description,
      onClick,
      closeIcon: <Icon name="close-outline" />,
      icon,
      style: { cursor: 'pointer' },
    })
    return {}
  },
)

export const toggleControlCenter = createAsyncThunk(
  `${NAME}/toggleControlCenter`,
  async (visible: boolean) => {
    document.body.style.overflow = visible ? 'hidden' : 'scroll'
    return { visibleControlCenter: visible }
  },
)

export const toggleSync = createAsyncThunk(
  `${NAME}/toggleSync`,
  async (visible: boolean) => {
    document.body.style.overflow = visible ? 'hidden' : 'scroll'
    return { visibleSync: visible }
  },
)

/**
 * Usual procedure
 */

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(
        resize.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        notify.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        toggleControlCenter.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      )
      .addCase(
        toggleSync.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
