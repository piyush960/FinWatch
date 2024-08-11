import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Navbar from './components/Navbar'
import Transaction from './pages/Transaction'
import Home from './pages/Home'
import Anomalies from './pages/Anomalies'

const App = () => {
  return (
    <div className=''>
      <Navbar />
      <Routes>
        <Route path='/' element={<Dashboard/>} />
        <Route path='/admin' element={<Dashboard/>}/>
        <Route path='/payment' element={<Transaction />}/>
        <Route path='/anomalies' element={<Anomalies />}/>
      </Routes>
    </div>
  )
}

export default App