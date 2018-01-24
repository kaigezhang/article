const merge = require('lodash/merge')

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    isDev: process.env.NODE_ENV !== 'production',
    basename: process.env.PUBLIC_PATH,
    isBrowser: typeof window !== 'undefined',
    apiUrl: 'http://127.0.0.1:5000/api',
    baseUrl: 'http://127.0.0.1:5000',
  },
  test: {},
  development: {},
  production: {
    apiUrl: '/api',
    baseUrl: '',
  },
}

module.exports = merge(config.all, config[config.all.env])
