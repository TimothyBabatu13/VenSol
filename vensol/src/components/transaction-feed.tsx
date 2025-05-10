"use client"

import { useEffect, useState } from "react"

import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { formatAddress, formatDate } from "../lib/utils"

// Mock transaction data - in a real app, this would come from your backend
const MOCK_TRANSACTIONS : Array<Transaction> = [
  {
    id: "tx1",
    type: "send",
    amount: 0.5,
    token: "SOL",
    recipient: "8xDrJGHdx4GxKBG9XuPUTpXZXnRFJEpLLhrMr5Lc1cHx",
    sender: "5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjYJ8XaDCG5t8ht",
    timestamp: new Date().getTime() - 1000 * 60 * 5, // 5 minutes ago
    note: "Lunch payment",
    status: "confirmed",
  },
  {
    id: "tx2",
    type: "receive",
    amount: 1.2,
    token: "SOL",
    recipient: "5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjYJ8XaDCG5t8ht",
    sender: "8xDrJGHdx4GxKBG9XuPUTpXZXnRFJEpLLhrMr5Lc1cHx",
    timestamp: new Date().getTime() - 1000 * 60 * 60, // 1 hour ago
    note: "For the concert tickets",
    status: "confirmed",
  },
  {
    id: "tx3",
    type: "send",
    amount: 0.1,
    token: "SOL",
    recipient: "7YarYNAzJbGTrF2fSrBpCQvCUHZrYrGoLcGZEXWSxn8P",
    sender: "5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjYJ8XaDCG5t8ht",
    timestamp: new Date().getTime() - 1000 * 60 * 60 * 24, // 1 day ago
    note: "Coffee",
    status: "confirmed",
  },
]

interface Transaction {
  id: string
  type: "send" | "receive"
  amount: number
  token: string
  recipient: string
  sender: string
  timestamp: number
  note?: string
  status: "pending" | "confirmed" | "failed"
}

export function TransactionFeed() {

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    const fetchTransactions = async () => {
      //get users wallet address and username
      //check db to see to see if wallet address or username is sender or sender or receiver
      //write logic to check if current logged in user is the sender or reciver
      try {
        
        await new Promise((resolve) => setTimeout(resolve, 1000))
        const user = {
          walletAddress: '5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjYJ8XaDCG5t8ht'
        };

        
        const userTransactions = MOCK_TRANSACTIONS.filter((tx) => {
          if (!user?.walletAddress) return false
          return tx.sender === user.walletAddress || tx.recipient === user.walletAddress
        })

        setTransactions([...userTransactions])
      } catch (error) {
        console.error("Error fetching transactions:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
    
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.id} className="flex items-start gap-4 p-4 rounded-lg border">
          <div className={`rounded-full p-2 ${tx.type === "receive" ? "bg-green-100" : "bg-red-100"}`}>
            {tx.type === "receive" ? (
              <ArrowDownLeft className="h-5 w-5 text-green-600" />
            ) : (
              <ArrowUpRight className="h-5 w-5 text-red-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {tx.type === "receive" ? "Received" : "Sent"} {tx.amount} {tx.token}
                </p>
                <p className="text-sm text-muted-foreground">
                  {tx.type === "receive" ? `From: ${formatAddress(tx.sender)}` : `To: ${formatAddress(tx.recipient)}`}
                </p>
                {tx.note && <p className="text-sm mt-1">{tx.note}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{formatDate(tx.timestamp)}</p>
                <p
                  className={`text-xs ${
                    tx.status === "confirmed"
                      ? "text-green-600"
                      : tx.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
