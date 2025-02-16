"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/_components/_ui/Table"
import { Input } from "@/app/_components/_ui/Input"
import { Button } from "@/app/_components/_ui/Button"

async function fetchTransactions(page = 1, limit = 10, filter = "") {
  const res = await fetch(`/api/admin/transactions?page=${page}&limit=${limit}&filter=${filter}`, { cache: "no-store" })
  return res.json()
}

export default function TransactionsList() {
  const [page, setPage] = useState(1)
  const [filter, setFilter] = useState("")
  const [transactions, setTransactions] = useState([])

  const loadTransactions = async () => {
    const data = await fetchTransactions(page, 10, filter)
    setTransactions(data)
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Input
          type="text"
          placeholder="Filter transactions"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={loadTransactions}>Apply Filter</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.id}</TableCell>
              <TableCell>{transaction.transactionType}</TableCell>
              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
              <TableCell>{new Date(transaction.date).toLocaleString()}</TableCell>
              <TableCell>{transaction.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </Button>
        <Button onClick={() => setPage(page + 1)}>Next</Button>
      </div>
    </div>
  )
}

