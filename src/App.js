import Home from './home/Home'
import React from 'react'
import Game from './game/game'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes
} from 'react-router-dom'

const App = () => {
  return (
    // <div>
    //   <Home />
    // </div>
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/game' element={<Game />} />
      </Routes>
    </Router>
  )
}

export default App
