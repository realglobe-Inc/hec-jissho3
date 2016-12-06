import * as Actions from '../interfaces/actions'
import { Location } from '../interfaces/app'

export const changeMapCenter = (location: Location): Actions.MapActtion => ({
  type: Actions.CHANGE_MAP_CENTER,
  location: location
})