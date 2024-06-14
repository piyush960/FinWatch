import { useState } from "react"


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


  const handleClick = async (e) => {
    e.preventDefault()

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
      const response = await fetch('http://127.0.0.1:5000/predict', { 
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj)
      })
      const result = await response.json()
      const status = result.predictions[0];
      if(status === -1){
        // to twilio backend
        const response = await fetch('http://127.0.0.1:5000/sendsms', { 
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({phone: mobile, transactionid: transactionId})
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
        <h2 className='text-3xl backdrop-blur-sm text-slate-600 font-bold mt-2 mb-3'>Make a Transaction</h2>
        <form className="mt-5 flex flex-col bg-blue-100 rounded shadow-md p-5 items-center">
          {paymentSuccess ? <div className="flex flex-col gap-2 items-center justify-center"><img src="assets/icons/success.svg" alt="success" /><p className="font-bold text-green-400 text-xl">Success</p></div> : <><p className="flex gap-2 items-center mb-4"><img src="assets/icons/time.svg" alt="time"/><span className="text-gray-700 font-bold">{`${date.getHours()}:${date.getMinutes()}`}</span></p>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">Type</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-sm px-4 py-2" value={type} onChange={(e) => settype(e.target.value)}/>
          </div>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">Amount</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-sm px-4 py-2" value={amount} onChange={(e) => setamount(e.target.value)}/>
          </div>
          {/*  */}
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">Location</label><br />
          <input type="text" className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-sm px-4 py-2" value={location} onChange={(e) => setlocation(e.target.value)}/>
          </div>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">Receiver Mobile</label><br />
          <input type="text" className="bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-sm px-4 py-2" value={mobile} onChange={(e) => setmobile(e.target.value)}/>
          </div>
          <br />
          <button className="btn btn-primary" onClick={handleClick}>{isLoading? 'Initiating...' : 'Make Payment'}</button> </>}
        </form>
    </div>
  )
}

export default Transaction




      {/* <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">Sender ID</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-sm px-4 py-2" value={nameorig} onChange={(e) => setnameorig(e.target.value)}/>
          </div>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">Old Balance</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-sm px-4 py-2" value={oldbalanceorg} onChange={(e) => setoldbalanceorg(e.target.value)}/>
          </div>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">New Balance</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-sm px-4 py-2" value={newbalanceorg} onChange={(e) => setnewbalanceorg(e.target.value)}/>
          </div>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">Receiver ID</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-sm px-4 py-2" value={namedest} onChange={(e) => setnamedest(e.target.value)}/>
          </div>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">Old Balance Receiver</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-sm px-4 py-2" value={oldbalancedest} onChange={(e) => setoldbalancedest(e.target.value)}/>
          </div>
          <div>
          <label htmlFor="" className="text-gray-700 font-semibold pb-1">New Balance Receiver</label><br />
          <input type="text"  className="mb-5 bg-gray-100 outline-none border-none font-semibold text-gray-600 rounded-sm px-4 py-2" value={newbalancedest} onChange={(e) => setnewbalancedest(e.target.value)}/>
          </div> */}