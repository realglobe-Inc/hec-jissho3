import * as React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import * as c from 'classnames'
import Store from '../interfaces/store'
import storeUtil from '../helpers/store_util'
import { Marker } from '../interfaces/app'

const debug = require('debug')('hec:controller-panel-select')

interface Props {
  storeState: Store.State
  dispatch: any
}

class ControllerPanelSelect extends React.Component<Props, any> {
  render () {
    const s = this
    let {markers, selectedMarker} = s.props.storeState
    return (
      <div className='controller-panel-select'>
        {markers.map(marker =>
          (
            <div className={'controller-panel-item' + (marker.id === selectedMarker.id ? ' controller-panel-item-selected' : '')}
                 key={marker.id}
                 onClick={s.selectMarker.bind(s)}
                 data={String(marker.id)}>
              {marker.name}
            </div>
          )
        )}
      </div>
    )
  }

  selectMarker (e) {
    const s = this
    let { storeState, dispatch } = s.props
    let id = Number(e.target.attributes.data.value)
    dispatch(actions.selectedMarker.selectMarker(id))
    let marker = storeState.markers.get(id)
    dispatch(actions.map.changeMapCenter(marker.location))
  }
}

export default connect(
  (storeState: Store.State) => ({ storeState }),
  (dispatch) => ({ dispatch })
)(ControllerPanelSelect)
