import * as Actions from '../interfaces/actions'
import { Report } from '../interfaces/app'

type Action = Actions.ReportSharedAction

export const setSharedReport = (report: Report): Action => ({
  type: Actions.SET_SHARED_REPORT,
  report: report
})

export const clearSharedReport = (): Action => ({
  type: Actions.CLEAR_SHARED_REPORT
})