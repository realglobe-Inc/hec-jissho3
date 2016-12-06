/**
 * Reducer of map
 */
import { Location } from '../interfaces/app'
import { Reducer, Store } from '../interfaces/store'
import * as Actions from '../interfaces/actions'
import * as config from '@self/ui/config'

const { mapCenter } = config

let init: Store.Map = {
  center: mapCenter
}

const map: Reducer<Store.Map> = (state: Store.Map = init, action: Actions.MapActtion) => {
  switch (action.type) {
    case Actions.CHANGE_MAP_CENTER:
      return {
        center: action.location
      }
    default:
      return state
  }
}

export default map
