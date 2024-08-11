import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner';
import {Link} from 'react-router-dom'
import useWindowDimensions from '../hooks/useWindowDimension';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Dashboard = () => {
  const [msg, setMsg] = useState('Ship Data')
  const [anoCount, setAnoCount] = useState('n')
  const [isLoading, setIsLoading] = useState(false);

  useDocumentTitle("Finwatch | Dashboard")
  

  useEffect(() => {
    getAnoCount()
  }, [])

  async function getAnoCount(){
    const response = await fetch('https://finwatch-api-ftyf.onrender.com/get-anomalies-count')
    const result = await response.json()
    setAnoCount(result[0].count)
  }

  const handleClick = async () => {
    try{
      setMsg('Shipping data ...')
      setIsLoading(true)
      const response = await fetch('https://finwatch-api-ftyf.onrender.com/processed_data')
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
        
        {/* <h1>My Tableau Dashboard</h1> */}
        <div className='flex items-center my-5 justify-between'>
          <div>
            <button onClick={handleClick} className='btn btn-primary my-4 mr-2 hover:bg-blue-500' disabled={isLoading}>{msg}</button>
            <Link to={'/anomalies'}>
            <button className='btn btn-primary my-4 hover:bg-blue-500'>View Latest 100 Anomalies</button>
            </Link>
          </div>
          <h3 className='text-slate-700 font-bold text-xl'>Total Anomalies - {anoCount}</h3>
        </div>
        <div className='flex justify-center items-center'>
            <iframe src="https://public.tableau.com/shared/XYYS6XYHQ?:language=en-US&:display_count=n&:origin=viz_share_link:showVizHome=no" width={1200} height={850}></iframe>
        </div>
        <div className='flex justify-center items-center'>
          <iframe
            src="https://public.tableau.com/shared/XPT2Z9YXY?:language=en-US&:display_count=n&:origin=viz_share_link:showVizHome=no" width={1200} height={850}></iframe>
        </div>
    </div>
  )
}

export default Dashboard