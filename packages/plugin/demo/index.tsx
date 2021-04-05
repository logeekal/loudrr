import React, { FC } from 'react'
import ReactDOM from 'react-dom'
import CommentWidget from '../src'

const App: FC<{}> = () => {
  return (
    <div style={{ maxWidth : '1000px', margin: "auto" }}>
      <CommentWidget domainKey={'362ac97c-26ec-40ab-80ea-f22044768d2c'} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('react'))
