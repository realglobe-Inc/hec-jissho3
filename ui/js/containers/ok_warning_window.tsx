import * as React from 'react'
import { connect } from 'react-redux'
import * as c from 'classnames'
import { ApButton } from 'apeman-react-button'
import actions from '../actions'
import Store from '../interfaces/store'

const Types = React.PropTypes
const debug = require('debug')('hec:OkWarningWindow')

interface Props {
  modalWindow: Store.ModalWindow
  dispatch: any
}

class OkWarningWindow extends React.Component<Props, any> {
  render () {
    const s = this
    let visible = s.props.modalWindow.okWarning
    return (
      <div className={c('modal-window-background-nobg', visible ? '' : 'hidden')}>
        <div className={visible ? 'warning-display' : ''}></div>
        <div className='confirm-close-report'>
          <div className='message red'>
            通報が来ました！
          </div>
          <div className='buttons'>
            <ApButton onTap={s.stop.bind(s)}>閉じる</ApButton>
          </div>
        </div>
      </div>
    )
  }

  componentDidUpdate (prevProps: Props) {
    const s = this
    let appear = !prevProps.modalWindow.okWarning && s.props.modalWindow.okWarning
    if (appear) {
      document.addEventListener('keydown', s.detectEnter.bind(s))
      return
    }
  }

  detectEnter (e) {
    const ENTER = 13
    if (e.keyCode === ENTER) {
      this.stop()
    }
  }

  stop () {
    const s = this
    document.removeEventListener('keydown', s.detectEnter)
    s.props.dispatch(actions.modalWindow.closeOkWarningModal())
  }
}

export default connect(
  (state: Store.State) => ({ modalWindow: state.modalWindow }),
  (dispatch) => ({ dispatch })
)(OkWarningWindow)