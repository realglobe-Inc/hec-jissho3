import * as React from 'react'
import { ApButton } from 'apeman-react-button'
import * as bRequest from 'browser-request'
import urls from '../helpers/urls'

const debug = require('debug')('hec:zoom_image')

interface Props {
  image: string
}

interface State {
  circleCood?: string
}

class ZoomPhoto extends React.Component<Props, State> {
  constructor () {
    super()
    this.state = {}
  }

  zoomImage: HTMLImageElement

  render () {
    const s = this
    let { image } = s.props
    let disableShare = !s.state.circleCood
    return (
      <div className='photo-zoom'>
        <img src={urls.getPhoto(image)} onClick={s.putCircle.bind(s)} ref={(img) => s.zoomImage = img} />
        <div className='share-photo-button'>
          <ApButton wide onTap={s.share.bind(s)} disabled={disableShare}>共有する</ApButton>
        </div>
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
    if (!circleCood) {
      window.alert('画像をクリックして円を描いてください')
      return
    }
    console.log({image, circleCood})
    bRequest({
      method: 'POST',
      url: urls.sharePhoto(),
      body: {
        image,
        circleCood,
      },
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
    let x = Math.floor((e.clientX - imgRect.left) / imgRect.width * s.zoomImage.naturalWidth)
    let y = Math.floor((e.clientY - imgRect.top) / imgRect.height * s.zoomImage.naturalHeight)

    let circleCood = `${x}x${y}`
    debug(circleCood)
    s.setState({ circleCood })
  }
}

export default ZoomPhoto
