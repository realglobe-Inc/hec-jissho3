import * as React from 'react'
import { connect } from 'react-redux'
import * as c from 'classnames'
import { ApButton } from 'apeman-react-button'
import actions from '../actions'
import Store from '../interfaces/store'
import { Marker } from '../interfaces/app'
import * as bRequest from 'browser-request'
import urls from '../helpers/urls'

const { DATA_SYNC_ACTOR } = require('@self/server/lib/consts').SUGOS

const Types = React.PropTypes
const debug = require('debug')('hec:ModalCenterconf')

interface Props {
  modalWindow: Store.ModalWindow
  markers: Store.Markers
  callers: Store.Callers
  dispatch: any
}

class ModalCenterconf extends React.Component<Props, any> {

  refs: {
    inputLat: HTMLInputElement
    inputLng: HTMLInputElement
  }

  render () {
    const s = this
    let visible = s.props.modalWindow.centerConf
    let centerMarker = s.findCenterMarker()
    if (!centerMarker) {
      return null
    }
    let {lat, lng} = centerMarker.location
    return (
      <div className={c('modal-window-background', visible ? '' : 'hidden')}>
        <div className={visible ? 'modal-centerconf' : ''}>
          <h4>本部の位置を変更</h4>
          <div className='item'>
            緯度(lat): <input type='text' ref={(input) => s.refs.inputLat = input} defaultValue={String(lat)}/>
          </div>
          <div className='item'>
            経度(lng): <input type='text' ref={(input) => s.refs.inputLng = input} defaultValue={String(lng)}/>
          </div>
          <div className='buttons'>
            <ApButton onTap={s.update.bind(s)}>変更</ApButton>
            <ApButton onTap={s.cancel.bind(s)}>キャンセル</ApButton>
          </div>
        </div>
      </div>
    )
  }

  findCenterMarker (): Marker | undefined {
    const s = this
    let markers = s.props.markers
    let centerMarker: Marker = markers.find((marker) => marker.type === 'center') // must be ONE    
    return centerMarker
  }

  cancel () {
    this.props.dispatch(actions.modalWindow.closeCenterConfModal())
  }

  update () {
    const s = this
    let lat = parseFloat(s.refs.inputLat.value)
    let lng = parseFloat(s.refs.inputLng.value)
    let invalid = isNaN(lat) || isNaN(lng)
    if (invalid) {
      window.alert('正しい数値を入力してください。')
      return
    }
    let centerLocation = {lat, lng}

    let caller = s.props.callers.get(DATA_SYNC_ACTOR.KEY)
    let syncer = caller.get(DATA_SYNC_ACTOR.MODULE)
    syncer.update({
      key: 'centerLocation',
      nextValue: centerLocation
    }).then(() => {
        let centerMarker = s.props.markers.find((marker) => marker.type === 'center')
        s.props.dispatch(actions.map.changeMapCenter(centerLocation))
        s.props.dispatch(actions.markers.updateMarker({
          id: centerMarker.id,
          location: centerLocation
        }))
    })

    s.props.dispatch(actions.modalWindow.closeCenterConfModal())


  }
}

export default connect(
  (state: Store.State) => ({
    modalWindow: state.modalWindow,
    markers: state.markers,
    callers: state.callers
  }),
  (dispatch) => ({ dispatch })
)(ModalCenterconf)