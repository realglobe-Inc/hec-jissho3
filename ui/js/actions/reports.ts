import * as Actions from '../interfaces/actions'
import { Report, ReportInfo } from '../interfaces/app'

type Action = Actions.ReportsAction

export const setReports = (reports: Report[]): Action => ({
  type: Actions.SET_REPORTS,
  reports
})

export const addReport = (report: Report): Action => ({
  type: Actions.ADD_REPORT,
  report
})

export const removeReport = (reportFullId: string): Action => ({
  type: Actions.REMOVE_REPORT,
  reportFullId
})

export const UpdateReportInfo = (reportInfo: ReportInfo): Action => ({
  type: Actions.UPDATE_REPORT_INFO,
  reportInfo
})