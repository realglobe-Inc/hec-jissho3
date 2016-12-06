import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Header from '../components/header'
import auth from '../helpers/auth'

const rootElement = document.getElementById('site')

let links = [
  {
    url: 'system.html',
    text: 'システム画面'
  },
  {
    url: 'photos.html',
    text: '隊員用画面'
  }
]

document.addEventListener('DOMContentLoaded', () => {
  if (!auth(window.prompt, window.localStorage)) {
    return
  }
  ReactDOM.render(
    <div className='app'>
      <Header/>
      <div className='menu-wrapper'>
        {
          links.map((link) => (
            <div className='menu-button' key={link.url}>
              <a href={link.url}>{link.text}</a>
            </div>
          ))
        }
      </div>
    </div>,
    rootElement
  )
})
