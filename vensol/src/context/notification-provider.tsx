import { createContext, useContext, useEffect, useState } from "react"

interface Transaction {
  id: string
  type: "send" | "receive"
  amount: number
  token: string
  recipient: string
  sender: string
  timestamp: number
  note?: string
  status: "pending" | "confirmed" | "failed",
  seen: boolean
}

type TransactionType = {
    transcations: Transaction[]
}

interface Notification extends TransactionType {
    isLoading: boolean,
    numberOfNotifications: number
}

const context = createContext<Notification | null>(null);

const initialData: Transaction[] = [
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
    seen: false
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
    seen: false
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
    seen: true
  },
]

const NotificationProvider = ({ children }: {
    children: React.ReactNode
}) => {

    const [transaction, setTransaction] = useState<Transaction[]>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [numberOfNotifications, setNumberOfNotifications] = useState<number>()

    useEffect(() => {
    
        const fetchTransactions = async () => {
            setIsLoading(true)
          //get users wallet address and username
          //check db to see to see if wallet address or username is sender or sender or receiver
          //write logic to check if current logged in user is the sender or reciver
          try {
            
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const user = {
              walletAddress: '5KKsLVU6TcbVDK4BS6K1DGDxnh4Q9xjYJ8XaDCG5t8ht'
            };
    
            
            const userTransactions = initialData.filter((tx) => {
              if (!user?.walletAddress) return false
              return tx.sender === user.walletAddress || tx.recipient === user.walletAddress
            })
    
            setTransaction([...userTransactions])
          } catch (error) {
            console.error("Error fetching transactions:", error)
          } finally {
            setIsLoading(false)
          }
        }
    
        const getNumberOfNotifications = () => {
            const number = initialData.filter(item => item.seen).length;
            setNumberOfNotifications(number);
        }
        getNumberOfNotifications()
        fetchTransactions()
        
      }, [])

  return (
    <context.Provider
        value={{
            isLoading,
            transcations: transaction!,
            numberOfNotifications: numberOfNotifications!
        }}
    >
        {children}
    </context.Provider>
  )
}

export default NotificationProvider

export const useTransactionProvider = () => {
    const Context = useContext(context);
    if(!context) {
        throw new Error('useTransaction must be used in context');
    }
    return Context
}