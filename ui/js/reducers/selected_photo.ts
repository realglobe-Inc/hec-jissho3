import { Reducer, Store } from '../interfaces/store'
import * as Actions from '../interfaces/actions'

let init: Store.SelectedPhoto = {
  isSelected: false,
  uuid: ''
}

/**
 * Reducer of selected photo
 */
const selectedPhoto: Reducer<Store.SelectedPhoto> = (state: Store.SelectedPhoto = init, action: Actions.SelectedPhotoAction) => {
  switch (action.type) {
    case Actions.SELECT_PHOTO:
      return {
        isSelected: true,
        uuid: action.uuid
      }
    default:
      return state
  }
}

export default selectedPhoto
