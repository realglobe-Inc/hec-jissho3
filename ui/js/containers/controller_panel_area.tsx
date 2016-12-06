import * as React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import * as c from 'classnames'
import Store from '../interfaces/store'
import { Marker } from '../interfaces/app'
import AreaReport from './area_report'
import AreaCenter from './area_center'
import storeUtil from '../helpers/store_util'
// import {HITOE_ACTORKEY_PREFIX} from '../constants'

const debug = require('debug')('hec:ControllerPanelArea')

// 表示する情報の type
const NOT_SELECTED = 1
const DEFAULT = 2
const OPEN_REPORT = 3
const CLOSED_REPORT = 4
const CENTER = 5

interface Props {
  storeState: Store.State
  dispatch: any
}

class ControllerPanelArea extends React.Component<Props, any> {
  render () {
    const s = this
    return (
      <div className='controller-panel-area'>
        <div className='title'>
          通報情報
        </div>
        <div className='content'>
          {s.renderSelectedContent()}
        </div>
      </div>
    )
  }

  renderSelectedContent () {
    const s = this
    let type = s.contentType()
    switch (type) {
      case NOT_SELECTED:
        return (
          <div className='area-no-select'>
            <div>通報が来ると情報が表示されます</div>
          </div>
        )
      case OPEN_REPORT:
        return (
          <AreaReport/>
        )
      case CLOSED_REPORT:
      // ここに来られない
        return (
          <div className='area-no-report'>
            <h4>通報をクローズしました</h4>
            <div><a href='reports.html'>対応済み通報一覧</a></div>
          </div>
        )
      case CENTER:
        return <AreaCenter/>
      case DEFAULT:
      default:
        let marker = storeUtil.getSelectedMarker(s.props.storeState)
        return (
          <div className='area'><h4>{marker.name}</h4></div>
        )
    }
  }

  contentType () {
    const s = this
    let { storeState } = s.props
    let { isSelected, id } = s.props.storeState.selectedMarker
    if (!isSelected) {
      return NOT_SELECTED
    }
    let marker: Marker = storeState.markers.get(id)
    switch (marker.type) {
      case 'report':
        let report = storeState.reports.get(marker.keys.reportFullId)
        return OPEN_REPORT
      case 'center':
        return CENTER
      case 'drone':
      case 'person':
      case 'default':
      default:
        return DEFAULT
    }
  }
}

export default connect(
  (storeState: Store.State) => ({ storeState }),
  (dispatch) => ({ dispatch })
)(ControllerPanelArea)

