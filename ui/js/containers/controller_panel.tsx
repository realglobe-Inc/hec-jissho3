/**
 * Controller panel
 */
import * as React from 'react'
import { connect } from 'react-redux'
import ControllerPanelArea from '../containers/controller_panel_area'
import ControllerPanelSelect from '../containers/controller_panel_select'
import actions from '../actions'
import * as c from 'classnames'
import Store from '../interfaces/store'

const debug = require('debug')('hec:ControllerPanel')

interface Props {
  showPanel: Store.ShowPanel
  dispatch: any
}

class ControllerPanel extends React.Component<Props, any> {
  render () {
    const s = this
    let show = s.props.showPanel.info
    return (
      <div className={c('controller-panel', show ? '' : 'pannel-hidden')}>
        <div className='panel-display-toggle'>
          <i className={c('fa', 'fa-3x', show ? 'fa-caret-left' : 'fa-caret-right')} aria-hidden></i>
          <div className='expand' onClick={s.toggleDisplay.bind(s)}></div>
        </div>
        <ControllerPanelSelect/>
        <ControllerPanelArea/>
      </div>
    )
  }

  toggleDisplay () {
    this.props.dispatch(actions.showPanel.toggleInfoDisplay())
  }
}

export default connect(
  (state: Store.State) => ({ showPanel: state.showPanel }),
  (dispatch) => ({ dispatch })
)(ControllerPanel)

