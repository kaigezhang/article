import { initialState } from './selectors'
import {
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_SUCCESS,
} from './actions'

export default (state = initialState, { type, user }) => {
  switch (type) {
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        user: user.user,
        auth: user.user.token,
      }
    case USER_REGISTER_SUCCESS:
      return {
        ...state,
        user: user.user,
      }
    case USER_LOGOUT:
      return {
        ...state,
        user: initialState.user,
        auth: initialState.auth,
      }
    default:
      return state
  }
}
