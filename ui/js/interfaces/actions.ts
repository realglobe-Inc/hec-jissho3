import { Location, Report, ReportInfo, Marker, Caller, PhotoInfo } from './app'

export interface Action {
  type: string
}

type creatorAny<T> = (any) => T
type creatorNull<T> = () => T
export type ActionCreator<T> = creatorAny<T> | creatorNull<T>

// show_panel
export const TOGGLE_INFO_DISPLAY: string = 'TOGGLE_INFO_DISPLAY';
export const TOGGLE_PHOTO_DISPLAY: string = 'TOGGLE_PHOTO_DISPLAY'
export interface ShowPanelAction extends Action {}

// map
export const CHANGE_MAP_CENTER: 'CHANGE_MAP_CENTER' = 'CHANGE_MAP_CENTER'
export interface MapActtion extends Action {
  location: Location
}

// modal window
export const OPEN_REPORTCLOSE_MODAL: string = 'OPEN_REPORTCLOSE_MODAL'
export const CLOSE_REPORTCLOSE_MODAL: string = 'CLOSE_REPORTCLOSE_MODAL'
export const OPEN_OKWARNING_MODAL: string = 'OPEN_OKWARNING_MODAL'
export const CLOSE_OKWARNING_MODAL: string = 'CLOSE_OKWARNING_MODAL'
export const OPEN_OKSHARING_MODAL: string = 'OPEN_OKSHARING_MODAL'
export const CLOSE_OKSHARING_MODAL: string = 'CLOSE_OKSHARING_MODAL'
export const OPEN_CENTERCONF_MODAL: string = 'OPEN_CENTERCONF_MODAL'
export const CLOSE_CENTERCONF_MODAL: string = 'CLOSE_CENTERCONF_MODAL'
export interface ModalWindowAction extends Action {}

// report closed
export const SET_CLOSED_REPORT: string = 'SET_CLOSED_REPORT'
export const CLEAR_CLOSED_REPORT: string = 'CLEAR_CLOSED_REPORT'
export interface ReportClosedAction extends Action {
  report?: Report
}

// report shared
export const SET_SHARED_REPORT: string = 'SET_SHARED_REPORT'
export const CLEAR_SHARED_REPORT: string = 'CLEAR_SHARED_REPORT'
export interface ReportSharedAction extends Action {
  report?: Report
}

// reports
export const SET_REPORTS: 'SET_REPORTS' = 'SET_REPORTS'
export const ADD_REPORT: 'ADD_REPORT' = 'ADD_REPORT'
export const REMOVE_REPORT: 'REMOVE_REPORT' = 'REMOVE_REPORT'
export const UPDATE_REPORT_INFO: 'UPDATE_REPORT_INFO' = 'UPDATE_REPORT_INFO'
interface SetReportsAction {
  type: 'SET_REPORTS'
  reports: Report[]
}
interface AddReportAction {
  type: 'ADD_REPORT'
  report: Report
}
interface RemoveReportAction {
  type: 'REMOVE_REPORT'
  reportFullId: string
}
interface UpdateReportInfoAction {
  type: 'UPDATE_REPORT_INFO'
  reportInfo: ReportInfo
}
export type ReportsAction = SetReportsAction | AddReportAction | RemoveReportAction | UpdateReportInfoAction

// markers
export const ADD_MARKERS: 'ADD_MARKERS' = 'ADD_MARKERS'
export const ADD_MARKER: 'ADD_MARKER' = 'ADD_MARKER'
export const REMOVE_MARKER: 'REMOVE_MARKER' = 'REMOVE_MARKER'
export const UPDATE_MARKER: 'UPDATE_MARKER' = 'UPDATE_MARKER'
interface AddMarkersAction {
  type: 'ADD_MARKERS'
  markers: Marker[]
}
interface AddMarkerAction {
  type: 'ADD_MARKER'
  marker: Marker
}
interface RemoveMarkerAction {
  type: 'REMOVE_MARKER'
  id: number
}
interface UpdateMarkerAction {
  type: 'UPDATE_MARKER'
  id: number
  location: Location
}
export type MarkersAction = AddMarkersAction | AddMarkerAction | RemoveMarkerAction | UpdateMarkerAction

// selected marker key
export const SELECT_MARKER: string = 'SELECT_MARKER_KEY'
export const CANCEL_SELECT_MARKER: string = 'CANCEL_SELECT_MARKER'
export interface SelectedMarkerAction extends Action {
  id?: number
}

// callers
export const ADD_CALLER: string = 'ADD_CALLER'
export const REMOVE_CALLER: string = 'REMOVE_CALLER'
export interface CallersAction extends Action {
  key: string
  caller?: Caller
}

// photos
export const ADD_PHOTO: 'ADD_PHOTO' = 'ADD_PHOTO'
// export const REMOVE_PHOTO: string = 'REMOVE_MARKER'
export const SET_PHOTOS: 'SET_PHOTOS' = 'SET_PHOTOS'
export interface AddPhoto extends Action {
  type: 'ADD_PHOTO'
  photo: PhotoInfo
}
export interface SetPhotos extends Action {
  type: 'SET_PHOTOS'
  photos: PhotoInfo[]
}
export type PhotosAction = AddPhoto | SetPhotos

// selectedPhoto
export const SELECT_PHOTO = 'SELECT_PHOTO'
export interface SelectPhoto extends Action {
  type: 'SELECT_PHOTO'
  uuid: string
}
export type SelectedPhotoAction = SelectPhoto