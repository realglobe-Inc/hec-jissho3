/**
 * 単一のコンポーネントで画像の一覧表示、全画面表示、リアルタイム更新を担当する
 */
import * as React from 'react'
import { connect } from 'react-redux'
import actions from '../actions'
import * as c from 'classnames'
import { PhotoInfo, Caller } from '../interfaces/app'
import urls from '../helpers/urls'
import appUtil from '../helpers/app_util'
import * as sugoCaller from 'sugo-caller'
import { Store } from '../interfaces/store'
import { ApButton } from 'apeman-react-button'
import ZoomPhoto from '../components/zoom_photo'

const cssVars = require('../../scss/vars.json')
const { DATA_SYNC_ACTOR } = require('@self/server/lib/consts').SUGOS
const THUMBNAIL_PHOTO_SIZE = {
  width: 320,
  height: 180
}

interface Props {
  photos: Store.Photos
  showPanel: Store.ShowPanel
  callers: Store.Callers
  dispatch: any
}

interface State {
  modalMode?: boolean
  selectedPhoto?: PhotoInfo | null
}

class PhotoList extends React.Component<Props, State> {
  constructor () {
    super()
    this.state = {
      modalMode: false,
      selectedPhoto: null
    }
  }

  render () {
    const s = this
    let show = s.props.showPanel.photo
    return (
      <div className='photo-list-ex'>
        <div className={c('photo-list-outer', show ? 'photo-list-show' : 'photo-list-hidden')}>

          <div className='photo-list-toggle'>
            <i className={c('fa', 'fa-3x', show ? 'fa-caret-right' : 'fa-caret-left')} aria-hidden></i>
            <div className='expand' onClick={s.toggleDisplay.bind(s)}></div>
          </div>

          <div className='title'>
            ドローンからの画像
          </div>

          {s.renderFullList()}

        </div>

        <div className={c('photo-zoom-outer', s.state.modalMode ? '' : 'hidden')} onClick={s.closeModal.bind(s)}>
          {s.state.modalMode ? s.renderZoomImage() : null}
        </div>

      </div>
    )
  }

  renderFullList () {
    const s = this
    // photos は古い順にセットされている
    // TODO ここで制限するべきかどうか
    let max = 100
    let listHeight = window.innerHeight - parseInt(cssVars['header-height'], 10)
    return (
      <div className='photo-list' style={{height: `${listHeight}px`}}>
        {s.props.photos.toArray().reverse().slice(0, max).map((photo) => {
          return (
            <div className='photo-list-item-wrapper'>
              <img className='photo-list-item'
                  src={urls.getPhoto(photo.image, THUMBNAIL_PHOTO_SIZE)}
                  onClick={s.openModal.bind(this)}
                  key={photo.uuid}
                  data={photo.uuid}
              />
              <div className='photo-list-item-info'>
                {appUtil.formatTime(photo.createdAt)}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  renderZoomImage () {
    const s = this
    let { selectedPhoto } = s.state
    if (!selectedPhoto) {
      return null
    }
    return (
      <ZoomPhoto image={selectedPhoto.image} onClose={s.closeModal.bind(s)} onShare={s.notifyShare.bind(s)}/>
    )
  }

  toggleDisplay () {
    this.props.dispatch(actions.showPanel.togglePhotoDisplay())
  }

  openModal (e) {
    let uuid = e.target.attributes.data.value
    let photo = this.props.photos.get(uuid)
    this.setState({
      modalMode: true,
      selectedPhoto: photo
    })
  }

  closeModal (e: MouseEvent) {
    e.stopPropagation()
    this.setState({ modalMode: false })
  }

  notifyShare (url: string) {
    const s = this
    let caller = s.props.callers.get(DATA_SYNC_ACTOR.KEY)
    let syncer = caller.get(DATA_SYNC_ACTOR.MODULE)
    syncer.update({
      key: 'sharedPhoto',
      nextValue: { url }
    }).catch((err) => {
      throw err
    })
  }


  // // AR-compass server
  // sendPhotoInfo () {
  //   // TODO 共有されている画像についてもstoreで管理すべき
  //   let photo = this.state.selectedPhoto
  //   let caller = this.props.callers.get(DATA_SYNC_ACTOR.KEY)
  //   let syncer = caller.get(DATA_SYNC_ACTOR.MODULE)
  //   syncer.update({
  //     key: 'sharedPhoto',
  //     nextValue: photo
  //   }).catch((err) => {
  //     throw err
  //   })
  // }
}

export default connect(
  (state: Store.State) => ({ photos: state.photos, showPanel: state.showPanel, callers: state.callers }),
  (dispatch) => ({ dispatch })
)(PhotoList)
