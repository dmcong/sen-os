import basics from './basics.config';

const env = process.env.REACT_APP_ENV || process.env.NODE_ENV;

const configs = {
  env,
  basics: basics[env],
}

/**
 * Module exports
 */
export default configs;
