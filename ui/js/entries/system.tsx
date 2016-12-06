import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from '../helpers/store'
import AppStyle from '../components/app_style'
import Header from '../components/header'
import OkWarningWindow from '../containers/ok_warning_window'
import ConfirmCloseReportWindow from '../containers/confirm_close_report_window'
import MapController from '../components/map_controller'
import ModalCenterconf from '../containers/modal_centerconf'
import { initialize } from '../helpers/store_util'
import PhotoList from '../containers/photo_list'
import auth from '../helpers/auth'

const rootElement = document.getElementById('site')

document.addEventListener('DOMContentLoaded', () => {
  if (!auth(window.prompt, window.localStorage)) {
    return
  }

  ReactDOM.render(
    <Provider store={store}>
      <div>
        <AppStyle/>
        <Header/>
        <MapController/>
        <PhotoList />
        <OkWarningWindow/>
        <ConfirmCloseReportWindow/>
        <ModalCenterconf/>
      </div>
    </Provider>,
    rootElement
  )

  initialize(store)
})
