import Home from './home/Home'
import React from 'react'
import Game from './game/game'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

/**
 *
 */
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/game' element={<Game />} />
      </Routes>
    </Router>
  )
}

export default App
