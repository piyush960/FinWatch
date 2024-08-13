import { useEffect, useState } from "react"
import useDocumentTitle from "../hooks/useDocumentTitle"


const Transaction = () => {
  const [time, settime] = useState('1')
  const [transactionid, settransactionid] = useState('')
  const [type, settype] = useState('transfer')
  const [amount, setamount] = useState('42136.28')
  const [nameorig, setnameorig] = useState('C866529530')
  const [oldbalanceorg, setoldbalanceorg] = useState('5334735.48')
  const [newbalanceorg, setnewbalanceorg] = useState('5292599.2')
  const [namedest, setnamedest] = useState('C837659261')
  const [oldbalancedest, setoldbalancedest] = useState('46303.0')
  const [newbalancedest, setnewbalancedest] = useState('57472.15')
  const [mobile, setmobile] = useState('+919860245752')
  const [isLoading, setIsLoading] = useState(false);
  const [location, setlocation] = useState('India')
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isAnomaly, setIsAnomaly] = useState(false);
  const [isSnac, setIsSnac] = useState(false);
  const [snacCountries, setSnacCountries] = useState([]);

  useDocumentTitle("Finwatch | Transaction")

  useEffect(() => {
    getSnacCountries()
  }, [])

  console.log(location, type, amount, mobile)

  async function getSnacCountries(){
    const response = await fetch('https://finwatch-api-ftyf.onrender.com/get-snac-countries')
    const result = await response.json()
    setSnacCountries(result.countries.map(c => c.toLowerCase()))
    console.log(snacCountries)
  }

  const handleClick = async (e) => {
    e.preventDefault()
    console.log(snacCountries)
    if(snacCountries.includes(location.toLowerCase())){
      console.log(snacCountries)
      setIsSnac(true);
      return;
    }

    const prefix = "TI";
    const randomDigits = Math.floor(Math.random() * 10000000000); // Generate random 10-digit number
    
    // Ensure the random number is padded to 10 digits
    const formattedRandomDigits = String(randomDigits).padStart(10, '0');
    
    // Concatenate prefix with the random number
    const transactionId = prefix + formattedRandomDigits;
    settransactionid(transactionId)
    
    const balance_change_orig = Math.abs(Number(newbalanceorg) - Number(oldbalanceorg));
    const balance_change_dest = Math.abs(Number(newbalancedest) - Number(oldbalancedest));
    const errorBalanceDest = Math.abs(Number(oldbalancedest) + Number(amount) - Number(newbalancedest));
    const cashout = type.trim().toLowerCase()
    const transfer = type.trim().toLowerCase()
    const custocus = nameorig[0]===namedest[0]
    const obj = {
      "step":Number(time),
      "amount":Number(amount),
      "oldbalanceOrg":Number(oldbalanceorg),
      "newbalanceDest": Number(newbalancedest),
      "balance_change_orig": Number(balance_change_orig),
      "balance_change_dest":Number(balance_change_dest),
      "errorBalanceDest": Number(errorBalanceDest),
      "type_CASH_OUT": cashout==='cashout' ? true : false,
      "type_TRANSFER" : transfer==='transfer' ? true : false,
      "transactionBetween_Customer2Customer": Boolean(custocus)
     }
     console.log(obj)

     try{
      setIsLoading(true);
      // to flask api
      const response = await fetch('https://finwatch-api-ftyf.onrender.com/predict', { 
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj)
      })
      const result = await response.json()
      const status = result.predictions[0];
      const score = result.score[0];
      console.log(score);
      if(status === -1){
        // to twilio backend
        setIsAnomaly(true);
        const response = await fetch('https://finwatch-api-ftyf.onrender.com/sendsms', { 
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({phone: mobile, transactionid: transactionId, amount, type, country:location, iso_anomaly_score: score})
      })
      const result = await response.json()
      console.log(result);
      }
      setPaymentSuccess(true);
      setIsLoading(false);
     }
     catch(e){
      console.log(e)
      setIsLoading(false);
     }
  }

  const date = new Date();

  return (
    <div className='flex flex-col justify-center items-center'>
        <h2 className='text-3xl backdrop-blur-sm text-slate-600 font-bold mt-5 mb-1'>Make a Transaction</h2>
        <form className="mt-5 bg-blue-100 p-10 rounded-lg">
          {isSnac ? <div className="flex flex-col gap-2 items-center justify-center"><img src="assets/icons/warning.svg" alt="warning" /><p className="font-bold text-orange-400 text-xl">Country {location} is Sanctioned</p></div> : paymentSuccess ? isAnomaly ? <div className="flex flex-col gap-2 items-center justify-center"><img src="assets/icons/warning.svg" alt="warning" /><p className="font-bold text-yellow-400 text-xl">This transaction might be Anomolous</p></div> : <div className="flex flex-col gap-2 items-center justify-center"><img src="assets/icons/success.svg" alt="success" /><p className="font-bold text-green-400 text-xl">Success</p></div> : <>
          
          <label htmlFor="type" className="text-gray-700 font-semibold ">Type</label>
          <select id="type" className="bg-gray-100 box-border w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2" value={type} onChange={(e) => settype(e.target.value)}>
            <option value="transfer">Transfer</option>
            <option value="cashout">Cashout</option>
          </select>      
          <label htmlFor="amount" className="text-gray-700 font-semibold ">Amount</label>
          <input id="amount" type="text"  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2" value={amount} onChange={(e) => setamount(e.target.value)}/>
          
          <label htmlFor="countries" className="text-gray-700 font-semibold ">Location</label>
          <select id="countries" className="bg-gray-100 box-border w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2" value={location} onChange={(e) => setlocation(e.target.value)}>
            <option value="india">India</option>
            <option value="US">United States</option>
            <option value="syria">Syria</option>
            <option value="bulgaria">Bulgaria</option>
            <option value="cuba">Cuba</option>
          </select>
          <label htmlFor="mobile" className="text-gray-700 font-semibold ">Mobile</label>
          <input id="mobile" type="text"  className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2" value={mobile} onChange={(e) => setmobile(e.target.value)}/>
          <button className="btn btn-primary mt-2" onClick={handleClick}>{isLoading? 'Initiating...' : 'Make Payment'}</button> </>}
        </form>
    </div>
  )
}

export default Transaction







      {/* <div>
          <label htmlFor="" className="text-gray-700 font-semibold ">Sender ID</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-lg w-full p-2.5" value={nameorig} onChange={(e) => setnameorig(e.target.value)}/>
          </div>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">Old Balance</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-lg w-full p-2.5" value={oldbalanceorg} onChange={(e) => setoldbalanceorg(e.target.value)}/>
          </div>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">New Balance</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-lg w-full p-2.5" value={newbalanceorg} onChange={(e) => setnewbalanceorg(e.target.value)}/>
          </div>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">Receiver ID</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-lg w-full p-2.5" value={namedest} onChange={(e) => setnamedest(e.target.value)}/>
          </div>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">Old Balance Receiver</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-lg w-full p-2.5" value={oldbalancedest} onChange={(e) => setoldbalancedest(e.target.value)}/>
          </div>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">New Balance Receiver</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-lg w-full p-2.5" value={newbalancedest} onChange={(e) => setnewbalancedest(e.target.value)}/>
          </div> */}