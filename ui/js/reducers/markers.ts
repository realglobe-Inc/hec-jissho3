import * as Im from 'immutable'
import * as Actions from '../interfaces/actions'
import { Reducer, Store } from '../interfaces/store'
import { Marker } from '../interfaces/app'

let init: Store.Markers = Im.Map<number, Marker>()
const markers: Reducer<Store.Markers> = (state: Store.Markers = init, action: Actions.MarkersAction) => {
  switch (action.type) {
    case Actions.ADD_MARKERS:
      let markers = action.markers.map((marker) => [marker.id, marker])
      let merging = Im.Map<number, Marker>(markers)
      return state.merge(merging) // 正確には add ではない
    case Actions.ADD_MARKER:
      return state.set(action.marker.id, action.marker)
    case Actions.REMOVE_MARKER:
      return state.remove(action.id)
    case Actions.UPDATE_MARKER:
      let updating = state.get(action.id)
      let updated = Object.assign({}, updating, { location: action.location })
      return state.set(action.id, updated)
    default:
      return state
  }
}

export default markers
