// https://github.com/diegohaz/arc/wiki/Example-app
import 'react-hot-loader/patch'
import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
// import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/es/integration/react'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter } from 'react-router-redux'

import { basename } from 'config'
import configureStore from 'store/configure'
import api from 'services/api'
import App from 'components/App'

const history = createHistory()

const { persistor, store } = configureStore({}, history, { api: api.create() })

const renderApp = () => (
  <Provider store={store}>
    <PersistGate
      persistor={persistor}
    >
      <ConnectedRouter basename={basename} history={history}>
        <App />
      </ConnectedRouter>
    </PersistGate>
  </Provider>
)


const root = document.getElementById('app')
render(renderApp(), root)

if (module.hot) {
  module.hot.accept('components/App', () => {
    require('components/App')
    render(renderApp(), root)
  })
}
