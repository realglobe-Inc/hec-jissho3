/**
 * Marker of marker on map
 */
import * as React from 'react'
import * as c from 'classnames'
import { MarkerType } from '../interfaces/app'

const debug = require('debug')('hec:components:marker')

interface Props {
  style?: any
  markerName: string
  selected: boolean
  direction?: number
  type: MarkerType
  dynamic?: boolean
}

class Marker extends React.Component<Props, any> {
  render () {
    const s = this
    let { markerName, selected, type, direction, dynamic } = s.props
    let style = type === 'drone' ? {transform: `rotate(${Math.floor(-direction * 180 / Math.PI)}deg)`} : {}
    let icon = s.getIcon(type)
    return (
      <div className={c('map-piece', selected ? 'map-piece-selected' : '', dynamic ? 'map-piece-dynamic' : '')}>
        <i className={c('fa', 'fa-3x', icon)} aria-hidden
           style={style}
           />
          <div className='map-piece-name'>{markerName}</div>
      </div>
    )
  }

  getIcon (type) {
    switch (type) {
      case 'drone':
        return 'fa-arrow-circle-right'
      case 'report':
        return 'fa-times'
      default:
        return 'fa-circle'
    }
  }
}

export default Marker
