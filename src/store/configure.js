import {
  createStore, applyMiddleware, compose,
} from 'redux'
import { persistStore } from 'redux-persist'
import createSagaMiddleware from 'redux-saga'
import { isDev, isBrowser } from 'config'
import { createLogger } from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'
import middlewares from './middlewares'
import reducer from './reducer'
import sagas from './sagas'


const devTools = isDev && isBrowser && window.devToolsExtension ? window.devToolsExtension : () => fn => fn

const configureStore = (initialState, history = {}, services = {}) => {
  const sagaMiddleware = createSagaMiddleware()

  const enhancers = [
    applyMiddleware(...middlewares, sagaMiddleware, routerMiddleware(history), createLogger()),
    devTools(),
  ]

  const store = createStore(reducer, initialState, compose(...enhancers))
  const persistor = persistStore(store)

  let sagaTask = sagaMiddleware.run(sagas, services)

  if (module.hot) {
    module.hot.accept('./reducer', () => {
      const nextReducer = require('./reducer').default
      store.replaceReducer(nextReducer)
    })
    module.hot.accept('./sagas', () => {
      const nextSagas = require('./sagas').default
      sagaTask.cancel()
      sagaTask.done.then(() => {
        sagaTask = sagaMiddleware.run(nextSagas, services)
      })
    })
  }
  return { persistor, store }
}
export default configureStore
