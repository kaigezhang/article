// https://github.com/diegohaz/arc/wiki/Sagas
// https://github.com/diegohaz/arc/wiki/Example-redux-modules#resource
import { put, call, takeEvery, select } from 'redux-saga/effects'
import { singular } from 'pluralize'
import * as actions from './actions'


const withToken = (saga, api, ...args) => {
  return function* (action) {
    const { user } = yield select()
    // handle ur token generic logic however u want
    const token = user.auth
    if (token) {
      api.setToken(token)
    } else {
      api.unsetToken()
    }
    yield call(saga, api, ...args, action)
  }
}

export function* createResource(api, { data }, { resource, thunk }) {
  try {
    // https://github.com/diegohaz/arc/wiki/API-service
    console.log(data, 'resource data')
    const res = yield call([api, api.post], `/${resource}`, data)
    const detail = res[singular(resource)]

    // https://github.com/diegohaz/arc/wiki/Actions#async-actions
    yield put(actions.resourceCreateSuccess(resource, detail, { data }, thunk))
  } catch (e) {
    yield put(actions.resourceCreateFailure(resource, e, { data }, thunk))
  }
}

export function* readResourceList(api, { params }, { resource, thunk }) {
  try {
    console.log(resource, 'resource')
    const res = yield call([api, api.get], `/${resource}`, { params })
    console.log(res, 'res')
    const list = res[resource]
    yield put(actions.resourceListReadSuccess(resource, list, { params }, thunk))
  } catch (e) {
    yield put(actions.resourceListReadFailure(resource, e, { params }, thunk))
  }
}

// export function* readResourceSubList(api, { subset, params }, { resource, thunk }) {
//   try {
//     const res = yield call([api, api.get], `/${resource}/${subset}`, { params })
//     const list = res[resource]
//     yield put(actions.resourceListReadSuccess(resource, list, { params }, thunk))
//   } catch (e) {
//     yield put(actions.resourceListReadFailure(resource, e, { params }, thunk))
//   }
// }

export function* readResourceSubList(api, { needle, params }, { resource, thunk }) {
  try {
    const res = yield call([api, api.get], `/${needle}/${resource}`, { params })
    const list = res[resource]
    yield put(actions.resourceListReadSuccess(resource, list, { params }, thunk))
  } catch (e) {
    yield put(actions.resourceListReadFailure(resource, e, { params }, thunk))
  }
}

export function* readResourceDetail(api, { needle }, { resource, thunk }) {
  try {
    const detail = yield call([api, api.get], `/${resource}/${needle}`)
    yield put(actions.resourceDetailReadSuccess(resource, detail, { needle }, thunk))
  } catch (e) {
    yield put(actions.resourceDetailReadFailure(resource, e, { needle }, thunk))
  }
}

export function* updateResource(api, { needle, data }, { resource, thunk }) {
  try {
    const detail = yield call([api, api.put], `/${resource}/${needle}`, data)
    yield put(actions.resourceUpdateSuccess(resource, detail, { needle, data }, thunk))
  } catch (e) {
    yield put(actions.resourceUpdateFailure(resource, e, { needle, data }, thunk))
  }
}

export function* deleteResource(api, { needle }, { resource, thunk }) {
  try {
    yield call([api, api.delete], `/${resource}/${needle}`)
    yield put(actions.resourceDeleteSuccess(resource, { needle }, thunk))
  } catch (e) {
    yield put(actions.resourceDeleteFailure(resource, e, { needle }, thunk))
  }
}

export function* watchResourceCreateRequest(api, { payload, meta }) {
  yield call(createResource, api, payload, meta)
}

export function* watchResourceListReadRequest(api, { payload, meta }) {
  yield call(readResourceList, api, payload, meta)
}


export function* watchResourceSubListReadRequest(api, { payload, meta }) {
  yield call(readResourceSubList, api, payload, meta)
}

export function* watchResourceDetailReadRequest(api, { payload, meta }) {
  yield call(readResourceDetail, api, payload, meta)
}

export function* watchResourceUpdateRequest(api, { payload, meta }) {
  yield call(updateResource, api, payload, meta)
}

export function* watchResourceDeleteRequest(api, { payload, meta }) {
  yield call(deleteResource, api, payload, meta)
}

export default function* ({ api }) {
  yield takeEvery(actions.RESOURCE_CREATE_REQUEST, withToken(watchResourceCreateRequest, api))
  yield takeEvery(actions.RESOURCE_LIST_READ_REQUEST, withToken(watchResourceListReadRequest, api))
  yield takeEvery(actions.RESOURCE_SUB_LIST_READ_REQUEST, withToken(watchResourceSubListReadRequest, api))
  yield takeEvery(actions.RESOURCE_DETAIL_READ_REQUEST, withToken(watchResourceDetailReadRequest, api))
  yield takeEvery(actions.RESOURCE_UPDATE_REQUEST, withToken(watchResourceUpdateRequest, api))
  yield takeEvery(actions.RESOURCE_DELETE_REQUEST, withToken(watchResourceDeleteRequest, api))
}
