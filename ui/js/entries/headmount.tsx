/**
 * ヘッドマウントディスプレイに共有されている情報を確認するページ
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as sugoCaller from 'sugo-caller'
import Header from '../components/header'
import urls from '../helpers/urls'
import { Location, Caller } from '../interfaces/app'
import * as bRequest from 'browser-request'
import auth from '../helpers/auth'
import * as CONSTS from '@self/server/lib/consts'

const debug = require('debug')('hec:headmount')
const { SUGOS } = CONSTS
const {
  DATA_SYNC_ACTOR
} = SUGOS

const rootElement = document.getElementById('site')

// ベタ
const LOCATION_URL = 'https://edac.online/ar-compass/location'
const IMAGE_URL = 'https://edac.online/ar-compass/image'

class SharedInfo extends React.Component<{}, { location?: Location }> {
  constructor () {
    super()
    this.state = {
      location: {
        lat: 0,
        lng: 0
      }
    }
  }
  render () {
    const s = this
    return (
      <div className='head-mount-outer'>
        <div className='head-mount'>
          <h1 className='title'>ヘッドマウントディスプレイに共有されている情報</h1>
          <div className='block'>
            <h2>位置情報</h2>
            <div className='location'>
              経度: {s.state.location.lat}
            </div>
            <div className='location'>
              緯度: {s.state.location.lng}
            </div>
          </div>
          <div className='block'>
            <h2>画像</h2>
            <div>
              <img src={IMAGE_URL} width={500}/>
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount () {
    const s = this

    s.updateLocation()

    sugoCaller(urls.uiCallers())
              .connect(DATA_SYNC_ACTOR.KEY)
              .then((caller: Caller) => {
                debug('Connected caller ', DATA_SYNC_ACTOR.KEY)
                s.initializeDataSyncer(caller)
              })
  }

  initializeDataSyncer (caller: Caller) {
    const s = this
    let syncer = caller.get(DATA_SYNC_ACTOR.MODULE)
    syncer.on(DATA_SYNC_ACTOR.UPDATE_EVENT, ({key, nextValue}) => {
      switch (key) {
        case 'sharedPhoto':
        case 'sharedReport':
          debug('Update because event', key)
          setTimeout(s.updateLocation.bind(s), 1000)
          return
      }
    })
  }

  updateLocation () {
    bRequest({
      url: LOCATION_URL,
      method: 'GET',
      json: true
    }, (err, res, body) => {
      if (err) {
        console.error(err)
        return
      }
      this.setState({ location: body })
    })
  }
}

class App extends React.Component<{}, {}> {
  render () {
    return (
    <div className='app'>
      <Header/>
      <SharedInfo/>
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
