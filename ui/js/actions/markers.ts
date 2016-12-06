import * as Actions from '../interfaces/actions'
import { Marker, Location } from '../interfaces/app'

type Action = Actions.MarkersAction

export const addMarkers = (markers: Marker[]): Action => ({
  type: Actions.ADD_MARKERS,
  markers
})

export const addMarker = (marker: Marker): Action => ({
  type: Actions.ADD_MARKER,
  marker
})

export const removeMarker = (id: number): Action => ({
  type: Actions.REMOVE_MARKER,
  id
})

export const updateMarker = ({id, location}: {id: number, location: Location}): Action => ({
  type: Actions.UPDATE_MARKER,
  id,
  location
})