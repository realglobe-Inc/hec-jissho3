/**
 * Site Header
 */
import * as React from 'react'
import Watch from './watch'

class Header extends React.Component<{}, {}> {
  render () {
    return (
      <div className='header'>
        <h1><a href='index.html'>緊急通報システム</a></h1>
        <Watch/>
      </div>
    )
  }
}

export default Header
