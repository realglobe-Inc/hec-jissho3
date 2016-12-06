import { Reducer, Store } from '../interfaces/store'
import * as Actions from '../interfaces/actions'
import * as Im from 'immutable'
import { Report } from '../interfaces/app'

let init: Store.Reports = Im.Map<string, Report>()

/**
 * Reducer of reports
 */
const reports: Reducer<Store.Reports> = (state: Store.Reports = init, action: Actions.ReportsAction) => {
  switch (action.type) {
    case Actions.SET_REPORTS:
      let setting = action.reports.map((report) => [report.reportFullId, report])
      return Im.Map<string, Report>(setting)
    case Actions.ADD_REPORT:
      return state.set(action.report.reportFullId, action.report)
    case Actions.REMOVE_REPORT:
      return state.remove(action.reportFullId)
    case Actions.UPDATE_REPORT_INFO:
      return state.update(action.reportInfo.reportFullId, (report) => {
          report.latestInfo = action.reportInfo
          return report
      })
    default:
      return state
  }
}

export default reports
