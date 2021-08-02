import rootConfigs from 'configs'
import sol from './sol.config'

const { env } = rootConfigs

const config = {
  sol: sol[env],
}

export default config
