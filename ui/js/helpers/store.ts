import { createStore, applyMiddleware, compose } from 'redux'
import Reducer from '../reducers'
import { Store } from '../interfaces/store'
import * as Actions from '../interfaces/actions'
import actions from '../actions'
const { DATA_SYNC_ACTOR } = require('@self/server/lib/consts').SUGOS

declare var window: any

/**
 * 一部のデータをサーバーと同期するmiddleware
 */
const syncRemoteMW = (store) => (next) => (action) => {
  next(action)
  switch (action.type) {
    case Actions.SET_CLOSED_REPORT:
      {
        let state: Store.State = store.getState()
        let { reportClosed, markers } = state
        let { reportFullId } = reportClosed.report
        let marker = markers.find((marker) => marker.keys.reportFullId === reportFullId)
        let markerId = marker.id
        store.dispatch(actions.selectedMarker.cancelSelectMarker())
        store.dispatch(actions.markers.removeMarker(markerId))
        store.dispatch(actions.reports.removeReport(reportFullId))

        let caller = state.callers.get(DATA_SYNC_ACTOR.KEY)
        let syncer = caller.get(DATA_SYNC_ACTOR.MODULE)
        syncer.update({
          key: 'reportClosed',
          nextValue: reportClosed
        })
        return
      }
    default:
  }
}

let composition = process.env.NODE_ENV === 'production' ?
  compose(applyMiddleware(syncRemoteMW)) :
  compose(
    applyMiddleware(syncRemoteMW),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )

let store = createStore<Store.State>(
  Reducer,
  composition
)

export default store
