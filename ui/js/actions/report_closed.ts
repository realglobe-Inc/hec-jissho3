import * as Actions from '../interfaces/actions'
import { Report } from '../interfaces/app'

type Action = Actions.ReportClosedAction

export const setClosedReport = (report: Report): Action => ({
  type: Actions.SET_CLOSED_REPORT,
  report: report
})

export const clearClosedReport = (): Action => ({
  type: Actions.CLEAR_CLOSED_REPORT
})