export const initialState = {
  loginModal: false,
}

export const isOpen = (state = initialState, name) => !!state[name]
