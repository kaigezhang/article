// https://github.com/diegohaz/arc/wiki/Reducers
import camelCase from 'lodash/camelCase'
// import { combineReducers } from 'redux'
import { reducer as thunk } from 'redux-saga-thunk'
import { persistCombineReducers } from 'redux-persist'
import { routerReducer } from 'react-router-redux'
import storage from 'redux-persist/es/storage'

const reducers = {
  thunk,
  router: routerReducer,
}

const config = {
  key: 'root',
  storage,
  whitelist: ['user'],
}
const req = require.context('.', true, /\.\/.+\/reducer\.js$/)

req.keys().forEach((key) => {
  const storeName = camelCase(key.replace(/\.\/(.+)\/.+$/, '$1'))
  reducers[storeName] = req(key).default
})

export default persistCombineReducers(config, reducers)
