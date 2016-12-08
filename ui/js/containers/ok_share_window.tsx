import * as React from 'react'
import { connect } from 'react-redux'
import * as c from 'classnames'
import { ApButton } from 'apeman-react-button'
import actions from '../actions'
import Store from '../interfaces/store'

const Types = React.PropTypes
const debug = require('debug')('hec:OkShareWindow')

interface Props {
  modalWindow: Store.ModalWindow
  dispatch: any
}

class OkShareWindow extends React.Component<Props, any> {
  render () {
    const s = this
    let visible = s.props.modalWindow.okSharing
    return (
      <div className={c('modal-window-background', visible ? '' : 'hidden')}>
        <div className='confirm-close-report'>
          <div className='message'>
            通報を共有しました
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
    let appear = !prevProps.modalWindow.okSharing && s.props.modalWindow.okSharing
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
    s.props.dispatch(actions.modalWindow.closeOkSharingModal())
  }
}

export default connect(
  (state: Store.State) => ({ modalWindow: state.modalWindow }),
  (dispatch) => ({ dispatch })
)(OkShareWindow)