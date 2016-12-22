import * as React from 'react'
import * as c from 'classnames'
import * as bRequest from 'browser-request'
import urls from '../helpers/urls'

const debug = require('debug')('hec:zoom_image')

interface Props {
  image: string
  onClose: any
  onShare: any
}

interface State {
  circleCood?: string
  circleStyle?: React.CSSProperties
  requesting?: boolean
}

class ZoomPhoto extends React.Component<Props, State> {
  constructor () {
    super()
    this.state = {
      circleCood: '',
      circleStyle: {},
      requesting: false,
    }
  }

  zoomImage: HTMLImageElement

  render () {
    const s = this
    let { image, onClose } = s.props
    let { circleCood, circleStyle, requesting } = s.state
    let disabled = circleCood.length === 0
    return (
      <div className='photo-zoom' onClick={s.putCircle.bind(s)}>

        <div className='photo-zoom-header'>
          <div className='photo-zoom-title'>
            空撮画像(画像をクリックすると円が描画されます)
          </div>
          <div className='photo-zoom-share'>
            <i className='fa fa-3x fa-share' onClick={s.share.bind(s)}/>
          </div>
          <div className='photo-zoom-close'>
            <i className='fa fa-3x fa-times' onClick={onClose}/>
          </div>
        </div>

        <img className='photo-zoom-img' src={urls.getPhoto(image)} ref={(img) => s.zoomImage = img} />
        <div className={c('photo-zoom-circle', disabled ? 'hidden' : '')} style={circleStyle}></div>
        <div className={c('photo-zoom-requesting', requesting ? '' : 'hidden')}>
          <div className='photo-zoom-requesting-message'>
            共有中
          </div>
          <i className='photo-zoom-spinner fa fa-spinner fa-pulse fa-5x fa-fw'/>
        </div>

      </div>
    )
  }

  share (e: MouseEvent) {
    e.stopPropagation()
    const s = this
    let { image } = s.props
    let { circleCood } = s.state
    if (circleCood.length === 0) {
      window.alert('画像をクリックして円を描いてください')
      return
    }
    let body = {
      image,
      circleCood,
    }
    console.log(body)
    bRequest({
      method: 'POST',
      url: urls.sharePhoto(),
      body,
      json: true,
    }, (err, res, body) => {
      s.setState({ requesting: false })
      if (err) {
        throw err
      }
      if (res.statusCode !== 200) {
        window.alert(res.body)
        return
      }
      let { url } = body
      s.props.onShare(url)
    })
    s.setState({ requesting: true })
  }

  putCircle (e: MouseEvent) {
    e.stopPropagation()
    const s = this
    let imgRect = s.zoomImage.getBoundingClientRect()
    let circleX = Math.floor((e.clientX - imgRect.left) / imgRect.width * s.zoomImage.naturalWidth)
    let circleY = Math.floor((e.clientY - imgRect.top) / imgRect.height * s.zoomImage.naturalHeight)
    let circleCood = `${circleX}x${circleY}`

    // 半径が16分の1
    let width = Math.floor(imgRect.width / 8)
    let height = width
    let circleStyle = {
      left: `${e.clientX - imgRect.left - width / 2}px`,
      top: `${e.clientY - imgRect.top - height / 2}px`,
      width,
      height,
    }
    debug(circleCood)
    s.setState({
      circleCood,
      circleStyle
    })
  }
}

export default ZoomPhoto
