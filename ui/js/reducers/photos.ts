import { Reducer, Store } from '../interfaces/store'
import { PhotoInfo } from '../interfaces/app'
import * as Actions from '../interfaces/actions'
import * as Im from 'immutable'

let init: Store.Photos = Im.OrderedMap<string, PhotoInfo>()

/**
 * Reducer of photos
 * 古い順
 */
const photos: Reducer<Store.Photos> = (state: Store.Photos = init, action: Actions.PhotosAction) => {
  switch (action.type) {
    case Actions.SET_PHOTOS:
      let setting = action.photos
        .map((photo) => Object.assign(photo, { createdAt: new Date(photo.createdAt.toString()) }))
        .sort((photo1, photo2) => Number(photo1.createdAt) - Number(photo2.createdAt))
        .map((photo) => [photo.uuid, photo])
      return Im.OrderedMap<string, PhotoInfo>(setting)
    case Actions.ADD_PHOTO:
      return state.set(action.photo.uuid, action.photo)
    default:
      return state
  }
}

export default photos