import { Reducer, Store } from '../interfaces/store'
import * as Actions from '../interfaces/actions'

let init: Store.SelectedMarker = {
  isSelected: false,
  id: -1
}

/**
 * Reducer of selected spot
 */
const selectedMarker: Reducer<Store.SelectedMarker> = (state: Store.SelectedMarker = init, action: Actions.SelectedMarkerAction) => {
  switch (action.type) {
    case Actions.SELECT_MARKER:
      return {
        isSelected: true,
        id: action.id
      }
    case Actions.CANCEL_SELECT_MARKER:
      return {
        isSelected: false,
        id: -1
      }
    default:
      return state
  }
}

export default selectedMarker
