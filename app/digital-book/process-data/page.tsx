"use client"

import { useState, useEffect } from "react"

import { useFirestore } from "@/app/hooks/useFirestore"


const ProcessDataReport = () => {
	const {getTransactionsByUserId} = useFirestore()
	const [data, setData] = useState([])

  return (
		<div>hello</div>
	)
}

export default ProcessDataReport