import * as React from 'react'
import ControllerPanel from '../containers/controller_panel'
import ControllerMap from '../containers/controller_map'

class MapController extends React.Component<{}, {}> {
  render () {
    return (
      <div className='section-map-controller'>
        <div className='controller-body'>
          <ControllerPanel/>
          <ControllerMap/>
        </div>
      </div>
    )
  }
}

export default MapController
