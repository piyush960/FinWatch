import React, { useEffect, useState } from 'react'
import Spinner from '../components/Spinner';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Anomalies = () => {

 const [data, setData] = useState([]);
 const [searchValue, setSearchValue] = useState("");
 const [isSorted, setisSorted] = useState(false);
 const [isLoading, setIsLoading] = useState(false);

 useDocumentTitle("Finwatch | Anomalies")


 useEffect(() => {
  fetchData()
 }, [])

 

 async function fetchData(){
   try{
    setIsLoading(true)
    const response = await fetch('https://finwatch-api-ftyf.onrender.com/show-anomalies')
    setData(await response.json());
    setIsLoading(false);
   } catch(e){
    setIsLoading(false);
    console.log(e);
   }
 }


  return (
    <div className=' container my-5'>
 <div class="pb-4 bg-white dark:bg-gray-900">
        <label for="table-search" class="sr-only">Search</label>
        <div class="relative mt-1">
            <div class="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="text" className="block pt-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 p-2" placeholder="Search for Transaction ID's" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>
        </div>
    </div>
  <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                  <th scope="col" className="px-6 py-3">
                      Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Type
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Country
                  </th>
                  <th scope="col" className="px-6 py-3">
                      Anomaly Score
                  </th>
              </tr>
          </thead>
          <tbody>
              {
                isLoading ? <div className='px-6 py-4 flex justify-center items-center'><Spinner/></div> : data.filter(record => searchValue.toLowerCase() === '' ? record : record.transaction_id.toLowerCase().includes(searchValue)).map(record => (
                  <tr className="bg-white border-b hover:bg-blue-100 dark:bg-gray-800 dark:border-gray-700" key={record.transaction_id}>
                      <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {record.transaction_id}
                      </th>
                      <td className="px-6 py-4">
                        {record.type}
                      </td>
                      <td className="px-6 py-4">
                        {record.amount}
                      </td>
                      <td className="px-6 py-4">
                        {record.Country}
                      </td>
                      <td className="px-6 py-4">
                        {parseFloat(record.iso_anomaly_score).toFixed(2)}
                      </td>
                  </tr>
                ))
              }
          </tbody>
      </table>
  </div>
    </div>

  )
}

export default Anomalies