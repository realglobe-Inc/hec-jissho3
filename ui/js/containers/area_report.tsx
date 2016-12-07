import * as React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import * as c from 'classnames'
import Store from '../interfaces/store'
import storeUtil from '../helpers/store_util'
import appUtil from '../helpers/app_util'
import { ApButton } from 'apeman-react-button'

const { DATA_SYNC_ACTOR } = require('@self/server/lib/consts').SUGOS
const debug = require('debug')('hec:AreaReport')

interface ReportWatchProps {
  start: Date
}

interface ReportWatchState {
  ms: number
}

/**
 * 通報からの時間を表示する
 */
class ReportWatch extends React.Component<ReportWatchProps, any> {

  constructor (props: ReportWatchProps) {
    super(props)
    this.state = {
      ms: Number(new Date()) - Number(this.props.start),
      timer: null
    }
  }

  render () {
    const s = this
    let { ms } = s.state
    let padding = number => ('0' + number).slice(-2)
    let seconds = Math.floor(ms / 1000)
    let hours = Math.floor(seconds / 3600)
    seconds %= 3600
    let minutes = Math.floor(seconds / 60)
    seconds %= 60
    return (
      <div className='report-watch'>
       {hours} 時間 {padding(minutes)} 分 {padding(seconds)} 秒
      </div>
    )
  }

  componentDidMount () {
    const s = this
    let timer = setInterval(() => {
      s.setState({ms: Number(new Date()) - Number(s.props.start)})
    }, 1000)
    s.setState({
      timer
    })
  }

  componentWillUnmount () {
    clearInterval(this.state.timer)
  }
}

interface Props {
  reports: Store.Reports
  selectedMarker: Store.SelectedMarker
  markers: Store.Markers
  callers: Store.Callers
  dispatch: any
}

interface State {
  address?: string,
  reportFullId?: string
}

class AreaReport extends React.Component<Props, State> {
  constructor() {
    super()
    this.state = {
      address: ''
    }
  }

  render () {
    const s = this
    let { selectedMarker, reports, markers } = s.props
    let marker = markers.get(selectedMarker.id)
    let report = reports.get(marker.keys.reportFullId)
    return (
      <div className='area-report'>
        <h4>{marker ? marker.name : '通報'}</h4>
        <div className='info'>
          <div className='name'>
            住所
          </div>
          <div className='value'>
            {s.state.address}
          </div>
        </div>
        <div className='info'>
          <div className='name'>
            通報からの経過時間
          </div>
          <div className='value'>
            <ReportWatch start={report.reportAt}/>
          </div>
        </div>
        <div className='info'>
          <div className='name'>
            通報日時
          </div>
          <div className='value'>
            {appUtil.formatTime(report.reportAt, { type: 'full_jp' })}
          </div>
        </div>
        <div className='info'>
          {/* FIXME This is ハリボテ */}
          <div className='name'>
            理由
          </div>
          <div className='value'>
            心肺停止
          </div>
        </div>
        <div className='info'>
          <div className='name'>
            情報
          </div>
          <div className='value'>
          </div>
        </div>

        <div className='bottom-buttons'>
          <ApButton
            primary wide style={{border: '0 solid'}}
            onTap={s.shareReport.bind(s)}
            >
            共有する
          </ApButton>
          <ApButton
            primary wide danger style={{border: '0 solid'}}
            onTap={s.showConfirmWindow.bind(s)}
            >
          　クローズする
          </ApButton>
        </div>
      </div>
    )
  }

  componentDidMount () {
    const s = this
    let { selectedMarker, markers } = s.props
    let marker = markers.get(selectedMarker.id)
    s.updateAdress(marker.keys.reportFullId, marker.location)
  }

  componentWillReceiveProps (nextProps: Props) {
    const s = this
    let { selectedMarker, markers } = s.props
    let marker = markers.get(selectedMarker.id)
    let reportFullId = marker.keys.reportFullId
    let nextMarker = nextProps.markers.get(nextProps.selectedMarker.id)
    let nextReportFullId = nextMarker.keys.reportFullId
    
    if (reportFullId !== nextReportFullId) {
      s.updateAdress(nextReportFullId, nextMarker.location)
    }
  }

  /**
   * 通報クローズの確認画面
   */
  showConfirmWindow () {
    this.props.dispatch(actions.modalWindow.openReportCloseModal())
  }

  /**
   * 通報の位置情報をヘッドマウントディスプレイと共有する
   */
  shareReport () {
    const s = this
    let {markers, reports, callers, selectedMarker} = s.props
    let marker = markers.get(selectedMarker.id)
    let report = reports.get(marker.keys.reportFullId)

    let caller = callers.get(DATA_SYNC_ACTOR.KEY)
    let syncer = caller.get(DATA_SYNC_ACTOR.MODULE)
    syncer.update({
      key: 'sharedLocation',
      nextValue: report.latestInfo.location
    }).then(() => {
      window.alert('通報を共有しました。')
    })
  }

  updateAdress (reportFullId, location) {
    const s = this
    s.setState({
      reportFullId: reportFullId
    })
    appUtil.fetchAddress(location)
      .then((address: string) => {
        debug('Update report adress', address)
        s.setState({ address })
      })
      .catch((err) => {
        console.error(err)
      })
  }
}

export default connect(
  (state: Store.State) => ({
    selectedMarker: state.selectedMarker,
    reports: state.reports,
    markers: state.markers,
    callers: state.callers
  }),
  (dispatch) => ({ dispatch })
)(AreaReport)
