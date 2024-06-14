import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Transaction from './pages/Transaction'
import Home from './pages/Home'

const App = () => {
  return (
    <div className=''>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/admin' element={<Dashboard />}/>
        <Route path='/payment' element={<Transaction />}/>
      </Routes>
    </div>
  )
}

export default App