import rootConfigs from 'configs'
import sol from './sol.config'

const { env } = rootConfigs

const configs = {
  sol: sol[env],
}

export default configs
