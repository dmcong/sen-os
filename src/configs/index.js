import basics from './basics.config';
import sol from './sol.config';

const env = process.env.REACT_APP_ENV || process.env.NODE_ENV;

const configs = {
  env,
  basics: basics[env],
  sol: sol[env],
}

/**
 * Module exports
 */
export default configs;
