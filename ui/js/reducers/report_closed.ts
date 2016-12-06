/**
 * クローズされた通報
 */
import { Reducer, Store } from '../interfaces/store'
import * as Actions from '../interfaces/actions'

let init: Store.ReportClosed = {
  report: null,
  closed: false
}

const reportClosed: Reducer<Store.ReportClosed> = (state: Store.ReportClosed = init, action: Actions.ReportClosedAction) => {
  switch (action.type) {
    case Actions.SET_CLOSED_REPORT:
      return {
        report: action.report,
        closed: true
      }
    case Actions.CLEAR_CLOSED_REPORT:
      return {
        report: null,
        closed: false
      }
    default:
      return state
  }
}

export default reportClosed
