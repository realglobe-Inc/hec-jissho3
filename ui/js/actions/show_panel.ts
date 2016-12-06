import * as Actions from '../interfaces/actions'

export const toggleInfoDisplay = (): Actions.ShowPanelAction => ({
  type: Actions.TOGGLE_INFO_DISPLAY
})

export const togglePhotoDisplay = (): Actions.ShowPanelAction => ({
  type: Actions.TOGGLE_PHOTO_DISPLAY
})