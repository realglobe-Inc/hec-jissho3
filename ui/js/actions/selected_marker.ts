import * as Actions from '../interfaces/actions'

type Action = Actions.SelectedMarkerAction

export const selectMarker = (id: number): Action => ({
  type: Actions.SELECT_MARKER,
  id
})

export const cancelSelectMarker = (): Action => ({
  type: Actions.CANCEL_SELECT_MARKER
})