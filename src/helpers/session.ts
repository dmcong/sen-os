const KEY = 'senswap'
const db = window.sessionStorage

const session = {
  convert: (value: string | null) => {
    try {
      if (!value) return null
      return JSON.parse(value)
    } catch (e) {
      return false
    }
  },

  set: (key: string, value: any) => {
    let data = session.convert(db.getItem(KEY))
    if (!data || typeof data !== 'object') {
      data = {}
      data[key] = value
    } else {
      data[key] = value
    }
    db.setItem(KEY, JSON.stringify(data))
  },

  get: (key: string) => {
    let data = session.convert(db.getItem(KEY))
    if (!data || typeof data !== 'object') return null
    return data[key]
  },

  clear: (key: string) => {
    session.set(key, null)
  },
}

export default session
