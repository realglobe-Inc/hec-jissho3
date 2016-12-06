/**
* パネルの表示／非表示
*/
import { Reducer, Store } from '../interfaces/store'
import { ShowPanelAction, TOGGLE_INFO_DISPLAY, TOGGLE_PHOTO_DISPLAY } from '../interfaces/actions'

function isSmartPhone (): boolean {
  let ua = navigator.userAgent
  return ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod') || ua.includes('Android')
}

// スマートフォンではデフォルトで閉じている
let init: Store.ShowPanel = isSmartPhone() ? {
  info: false,
  photo: false
} : {
  info: true,
  photo: true
}

const showPanel: Reducer<Store.ShowPanel> = (state: Store.ShowPanel = init, action: ShowPanelAction) => {
  switch (action.type) {
    case TOGGLE_INFO_DISPLAY:
      return {
        info: !state.info,
        photo: state.photo
      }
    case TOGGLE_PHOTO_DISPLAY:
      return {
        info: state.info,
        photo: !state.photo
      }
    default:
      return state
  }
}

export default showPanel
