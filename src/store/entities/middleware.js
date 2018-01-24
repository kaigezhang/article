import { normalize } from 'normalizr'
import { env } from 'config'
import { entitiesReceive } from './actions'
import * as schemas from './schemas'

const middleware = store => next => (action) => {
  const { payload, meta } = action
  if (meta && meta.entities) {
    const schema = schemas[meta.entities]

    if (schema) {
      const { result, entities } = normalize(payload, Array.isArray(payload) ? [schema] : schema)
      store.dispatch(entitiesReceive(entities))
      return next({ ...action, payload: result })
    }

    if (env === 'development') {
      console.warn(`[entities] there is no ${meta.entities} schema on schema.js`)
    }
  }
  return next(action)
}

export default middleware
