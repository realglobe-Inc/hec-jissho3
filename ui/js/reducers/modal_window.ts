/**
 * Reducer of the state of display the modal window or not.
 */
import { Reducer, Store } from '../interfaces/store'
import * as Actions from '../interfaces/actions'

let init: Store.ModalWindow = {
  reportClose: false,
  okWarning: false,
  centerConf: false
}

let merge = (state: Store.ModalWindow, next: any): Store.ModalWindow => {
  return Object.assign({}, state, next)
}

const modalWindow: Reducer<Store.ModalWindow> = (state: Store.ModalWindow = init, action: Actions.ModalWindowAction) => {
  switch (action.type) {
    case Actions.OPEN_REPORTCLOSE_MODAL:
      return merge(state, {
        reportClose: true
      })
    case Actions.CLOSE_REPORTCLOSE_MODAL:
      return merge(state, {
        reportClose: false
      })
    case Actions.OPEN_OKWARNING_MODAL:
      return merge(state, {
        okWarning: true
      })
    case Actions.CLOSE_OKWARNING_MODAL:
      return merge(state, {
        okWarning: false
      })
    case Actions.OPEN_CENTERCONF_MODAL:
      return merge(state, {
        centerConf: true
      })
    case Actions.CLOSE_CENTERCONF_MODAL:
      return merge(state, {
        centerConf: false
      })
    default:
      return state
  }
}

export default modalWindow
