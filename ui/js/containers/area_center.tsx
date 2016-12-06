import * as React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import * as c from 'classnames'
import Store from '../interfaces/store'
import storeUtil from '../helpers/store_util'
import appUtil from '../helpers/app_util'
import { ApButton } from 'apeman-react-button'

const debug = require('debug')('hec:AreaCenter')

interface Props {
  dispatch: any
}

class AreaCenter extends React.Component<Props, any> {
  render () {
    const s = this
    return (
      <div className='area'>
        <h4>本部</h4>
        <div className='area-center'>
          <ApButton wide
                    onTap={s.openCenterConfigModal.bind(s)}>
            本部の位置を変更
          </ApButton>
        </div>
      </div>
    )
  }

  openCenterConfigModal () {
    this.props.dispatch(actions.modalWindow.openCenterConfModal())
  }
}

export default connect(
  null,
  (dispatch) => ({ dispatch })
)(AreaCenter)
