import { take, put, call, fork } from 'redux-saga/effects'
import { userLogin, userRegister } from './actions'


export function* loginAsync(options, api) {
  try {
    const response = yield call([api, api.post], '/users/login', {
      user: {
        email: options.email,
        password: options.password,
      },
    })
    const user = { ...response.user }

    yield put(userLogin.success({ user }))
  } catch (e) {
    yield put(userLogin.failure(e))
  }
}

export function* registerAsync(options, api) {
  try {
    const response = yield call([api, api.post], '/users', {
      user: {
        username: options.username,
        email: options.email,
        password: options.password,
      },
    })
    const user = { ...response.user }
    yield put(userRegister.success({ user }))
  } catch (e) {
    yield put(userRegister.failure(e))
  }
}

export function* watchLogin(api) {
  const { options } = yield take('USER_LOGIN_REQUEST')
  yield call(loginAsync, options, api)
}

export function* watchRegister(api) {
  const { options } = yield take('USER_REGISTER_REQUEST')
  yield call(registerAsync, options, api)
}

export default function* ({ api }) {
  yield fork(watchLogin, api)
  yield fork(watchRegister, api)
}
