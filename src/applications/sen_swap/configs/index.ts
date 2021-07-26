import rootConfigs from 'configs'
import api from './api.config'

const configs = {
  api: api[rootConfigs.env],
}

/**
 * Module exports
 */
export default configs
