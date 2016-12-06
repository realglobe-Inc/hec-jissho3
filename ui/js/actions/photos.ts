import * as Actions from '../interfaces/actions'
import { PhotoInfo } from '../interfaces/app'

type Action = Actions.PhotosAction

export const setPhotos = (photos: PhotoInfo[]): Action => ({
  type: Actions.SET_PHOTOS,
  photos
})

export const addPhoto = (photo: PhotoInfo): Action => ({
  type: Actions.ADD_PHOTO,
  photo
})

