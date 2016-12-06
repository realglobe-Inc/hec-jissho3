import * as Actions from '../interfaces/actions'

type Action = Actions.SelectedPhotoAction

export const selectPhoto = (uuid: string): Action => ({
  type: Actions.SELECT_PHOTO,
  uuid
})