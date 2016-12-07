import * as App from './app'
import * as Im from 'immutable'

// reducer
export type Reducer<T> = (state: T, action: {type: string}) => T

// Store state
export namespace Store {
  export type ShowPanel = {
    info: boolean
    photo: boolean
  }

  export interface Map {
    center: App.Location
  }

  export type Markers = Im.Map<number, App.Marker>

  export interface ModalWindow {
    reportClose: boolean
    okWarning: boolean
    centerConf: boolean
  }

  export interface ReportClosed {
    report: App.Report
    closed: boolean
  }

  export interface ReportShared {
    report: App.Report
    shared: boolean
  }

  type reportFullId = string
  export type Reports = Im.Map<reportFullId, App.Report>

  export interface SelectedMarker {
    isSelected: boolean
    id: number
  }

  type actorKey = string
  export type Callers = Im.Map<actorKey, App.Caller>

  /**
   * key は uuid
   */
  export type Photos = Im.OrderedMap<string, App.PhotoInfo>

  export type SelectedPhoto = {
    isSelected: boolean
    uuid: string
  }

  /**
   * Store全体
   */
  export interface State {
    showPanel: ShowPanel
    map: Map
    markers: Markers
    modalWindow: ModalWindow
    reportClosed: ReportClosed
    reportShared: ReportShared
    reports: Reports
    selectedMarker: SelectedMarker
    callers: Callers,
    photos: Photos,
    selectedPhoto: SelectedPhoto
  }
}


export default Store