import React, { useState } from 'react'
import Spinner from '../components/Spinner';

const Dashboard = () => {
  const [msg, setMsg] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    try{
      setMsg('')
      setIsLoading(true)
      const response = await fetch('http://127.0.0.1:5000/processed_data')
      const result = await response.json()
      console.log(result)
      setMsg(result.status)
      setIsLoading(false)
    }catch(e){
      console.log(e)
      setMsg('Falied to ship data')
      setIsLoading(false)
    }
  }

  return (
    <div className='container my-5'>
        <h2 className='text-3xl backdrop-blur-sm text-slate-600 font-bold mb-8'>Admin Dashboard</h2>
        <div className='h-[400px] bg-blue-100 rounded-md flex flex-col gap-5 justify-center items-center'>
          {isLoading && <div><Spinner /></div>}
          <button onClick={handleClick} className='btn btn-primary my-4' disabled={isLoading}>{isLoading ? 'Shipping data to Tableau...' : 'Ship Data'}</button>
          <h3 className='text-gray-600 font-bold text-xl'>{msg}</h3>
        </div>
    </div>
  )
}

export default Dashboard