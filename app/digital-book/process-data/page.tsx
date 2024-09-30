"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useFirestore } from "@/app/hooks/useFirestore"

const ProcessDataReport = () => {
  const router = useRouter()
  const { getTransactionsByUserId } = useFirestore()
  const [data, setData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [inputYear, setInputYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    const userId = localStorage.getItem('user_id_branch_book_app');
    if (!userId) {
      router.push('/auth/login');
    } else {
      handleProcess();
    }
  }, [router, selectedMonth, inputYear]);

  const handleProcess = () => {
    const userId = localStorage.getItem('user_id_branch_book_app');
    if (userId) {
      getTransactionsByUserId(userId, selectedMonth, inputYear).then(res => setData(res));
    }
  };

  return (
    <div>
      <h2>Process Data Report</h2>
      <div>
        <label>Select Month:</label>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
          {[...Array(12)].map((_, index) => (
            <option key={index} value={index + 1}>
              {new Date(0, index).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Input Year:</label>
        <input
          type="number"
          value={inputYear}
          onChange={(e) => setInputYear(Number(e.target.value))}
          min="2000" // Set a minimum year
        />
      </div>
      <button onClick={handleProcess}>Process</button>
      <div>
        {/* Render the data here if needed */}
        {data.length > 0 && (
          <ul>
            {data.map((transaction, index) => (
              <li key={index}>{JSON.stringify(transaction)}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ProcessDataReport