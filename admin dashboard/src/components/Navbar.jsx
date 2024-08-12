import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='shadow-md'>
        <div className='container'>
            <div className='navbar py-5 flex justify-between items-center'>
                <h1 className='text-2xl font-bold text-blue-400 backdrop-blur-sm'><Link to={'/'}>FinWatch</Link></h1>
                <div className='flex gap-5'>
                    <Link to={'/'} className='text-sm text-slate-500'>Dashboard</Link>
                    <Link to={'/payment'} className='text-sm text-slate-500'>Transaction</Link>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Navbar