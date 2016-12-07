/**
 * 共有された通報
 */
import { Reducer, Store } from '../interfaces/store'
import * as Actions from '../interfaces/actions'

let init: Store.ReportShared = {
  report: null,
  shared: false
}

const reportShared: Reducer<Store.ReportShared> = (state: Store.ReportShared = init, action: Actions.ReportSharedAction) => {
  switch (action.type) {
    case Actions.SET_SHARED_REPORT:
      return {
        report: action.report,
        shared: true
      }
    case Actions.CLEAR_SHARED_REPORT:
      return {
        report: null,
        shared: false
      }
    default:
      return state
  }
}

export default reportShared
