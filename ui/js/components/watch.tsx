import * as React from 'react'
import appUtil from '../helpers/app_util'

interface State {
  now?: Date
  timer?: number
}

class Watch extends React.Component<{}, State> {
  state: State = {
    now: new Date()
  }

  render () {
    const s = this
    let {now} = s.state
    let time = appUtil.formatTime(now)
    return (
      <div className='watch'>
      時刻 {time}
      </div>
    )
  }

  componentDidMount () {
    const s = this
    let timer = setInterval(() => {
      s.setState({
        now: new Date()
      })
    }, 1000)
    s.setState({
      timer
    })
  }

  componentWillUnmount () {
    const s = this
    clearInterval(s.state.timer)
  }
}

export default Watch
