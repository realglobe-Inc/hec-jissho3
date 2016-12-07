/**
 * The top level reducer.
 */

import { combineReducers } from 'redux'
import { Store } from '../interfaces/store'
import callers from './callers'
import showPanel from './show_panel'
import markers from './markers'
import map from './map'
import modalWindow from './modal_window'
import selectedMarker from './selected_marker'
import reports from './reports'
import reportClosed from './report_closed'
import reportShared from './report_shared'
import photos from './photos'

const Reducer = combineReducers<Store.State>({
  callers,
  showPanel,
  markers,
  map,
  modalWindow,
  selectedMarker,
  reports,
  reportClosed,
  reportShared,
  photos
})

export default Reducer
