import * as React from 'react'
import { connect } from 'react-redux'
import * as c from 'classnames'
import { ApButton } from 'apeman-react-button'
import actions from '../actions'
import Store from '../interfaces/store'
import * as bRequest from 'browser-request'
import urls from '../helpers/urls'

const debug = require('debug')('hec:ConfirmCloseReportWindow')

interface Props {
  storeState: Store.State
  dispatch: any
}

class ConfirmCloseReportWindow extends React.Component<Props, any> {
  render () {
    const s = this
    let visible = s.props.storeState.modalWindow.reportClose
    return (
      <div className={c('modal-window-background', visible ? '' : 'hidden')}>
        <div className='confirm-close-report'>
          <div className='message'>
            通報をクローズしますか？
          </div>
          <div className='buttons'>
            <ApButton onTap={s.yes.bind(s)}>はい</ApButton>
            <ApButton onTap={s.no.bind(s)}>いいえ</ApButton>
          </div>
        </div>
      </div>
    )
  }

  yes () {
    const s = this
    let { selectedMarker, markers, reports } = s.props.storeState
    let { id } = selectedMarker
    let marker = markers.get(id)
    let reportFullId = marker.keys.reportFullId
    let report = reports.get(reportFullId)

    let closedDate = new Date()

    // And middleware will do other tasks
    s.props.dispatch(actions.reportClosed.setClosedReport(report))

    // Server side
    bRequest({
      method: 'POST',
      url: urls.closeReport(reportFullId),
      body: {
        closed_at: closedDate
      },
      json: true
    }, (err, res, body) => {
      if (err) {
        throw err
      }
    })
    s.closeSelf()
  }

  no () {
    const s = this
    s.closeSelf()
  }

  closeSelf () {
    this.props.dispatch(actions.modalWindow.closeReportCloseModal())
  }
}

export default connect(
  (storeState: Store.State) => ({ storeState }),
  (dispatch) => ({ dispatch })
)(ConfirmCloseReportWindow)
