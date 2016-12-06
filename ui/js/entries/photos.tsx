/**
 * タブレットから写真を見るページ
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Header from '../components/header'
import appUtil from '../helpers/app_util'
import { PhotoInfo } from '../interfaces/app'
import urls from '../helpers/urls'
import * as bRequest from 'browser-request'
import { connectDataSyncCaller } from '../helpers/tablet_caller_manager'
import auth from '../helpers/auth'

const rootElement = document.getElementById('site')
const camera = require('@self/server/env/camera.json').default

class Photo extends React.Component<{}, { photo?: PhotoInfo }> {
  constructor () {
    super()
    this.state = {}
  }

  render () {
    let { photo } = this.state
    let url = photo ? urls.getPhoto(photo.image) : null
    if (url) {
      return (
        <img src={url} width={`${window.innerWidth}px`}/>
      )
    } else {
        let style: React.CSSProperties = {
          display: 'flex',
          fontSize: '2em',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#ccc',
          height: '100%'
        }
      return (
        <div style={style}>
          <div>
            共有されている画像がありません
          </div>
        </div>
      )
    }
  }

  componentDidMount () {
    const s = this

    // caller が写真変更イベントを受け取ったら写真を更新する
    let onChangePhoto = (photo: PhotoInfo) => {
      console.log('change', photo)
      s.setState({
        photo
      })
    }
    connectDataSyncCaller(onChangePhoto)
  }
}

class App extends React.Component<{}, {}> {
  render () {
    return (
    <div className='app'>
      <Header/>
      <Photo/>
    </div>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!auth(window.prompt, window.localStorage)) {
    return
  }

  ReactDOM.render(
    <App/>,
    rootElement
  )
})
