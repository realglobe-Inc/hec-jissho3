import * as React from 'react'
import * as c from 'classnames'
import { ApButton } from 'apeman-react-button'
import * as bRequest from 'browser-request'
import urls from '../helpers/urls'

const debug = require('debug')('hec:zoom_image')

interface Props {
  image: string
}

interface State {
  circleCood: string
  circleStyle: React.CSSProperties
}

class ZoomPhoto extends React.Component<Props, State> {
  constructor () {
    super()
    this.state = {
      circleCood: '',
      circleStyle: {}
    }
  }

  zoomImage: HTMLImageElement

  render () {
    const s = this
    let { image } = s.props
    let { circleCood, circleStyle } = s.state
    let disabled = circleCood.length === 0
    return (
      <div className='photo-zoom'>
        <img className='photo-zoom-img' src={urls.getPhoto(image)} onClick={s.putCircle.bind(s)} ref={(img) => s.zoomImage = img} />
        <div className='photo-zoom-share-button'>
          <ApButton wide onTap={s.share.bind(s)} disabled={disabled}>共有する</ApButton>
        </div>
        <div className={c('photo-zoom-circle', disabled ? 'hidden' : '')} style={circleStyle}></div>
        <div className='photo-zoom-message'>
          画像をクリックすると円が描画されます。
        </div>
      </div>
    )
  }


  share () {
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
      if (err) {
        throw err
      }
      if (res.statusCode !== 200) {
        window.alert(res.body)
        return
      }
      window.alert('OK')
    })
  }

  putCircle (e: MouseEvent) {
    const s = this
    e.stopPropagation()

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
