import { createContext, useContext, useEffect, useState } from "react"
import { TransactionNotifications, } from "../lib/firebase-helpers"
import { useWalletDetailsProvider } from "./wallet-info"
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

interface HeaderNotificationType {
  title: string;
  address: string;
  description: string;
  time: number;
  seen: boolean;
}

interface RealTransactionType {
  type: string;
  amount: string;
  token: string;
  recipient: string;
  sender: string;
  timestamp: number;
  note: string | undefined;
  status: string;
  seen: boolean;
}

interface Notification {
  headerNotification: HeaderNotificationType[],
  realNotification: RealTransactionType[],
  isLoading: boolean,
  numberOfNotifications: number
}

const context = createContext<Notification | null>(null);


const NotificationProvider = ({ children }: {
    children: React.ReactNode
}) => {
  
    const user = useWalletDetailsProvider();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [numberOfNotifications, setNumberOfNotifications] = useState<number>()
    const [headerNotification, setHeaderNotification] = useState<HeaderNotificationType[]>([])
    const [transactionNotification, setTransactionNotification] = useState<RealTransactionType[]>([]);

     const shortenLength = (address: string) => {
        if(address.length < 10) return address
        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }

    useEffect(() => {
    
        const fetchTransactions = async () => {
            setIsLoading(true)

            try {
              
              TransactionNotifications({
              callBack: (e)=>{

                const moneyReceived = e.filter((trn) => trn.receiver === 'BX63NWWAFaiMDE7ccRTUzMivXYy2XZTHyDMi2mkGSLQs').map(trn => ({
                  title: `Transfer from ${shortenLength(trn.sender)}`,
                  address: trn.sender,
                  description: `You received ${+trn.amount/LAMPORTS_PER_SOL}SOL from ${trn.sender}`,
                  time: trn.time,
                  seen: trn.seen
                }))
                setHeaderNotification(moneyReceived)
                setNumberOfNotifications(moneyReceived.filter(item => !item.seen).length)

                const realNotification = e.filter(trn => ((trn.sender === user.walletAddress) || (trn.receiver === user.walletAddress))).map(trn => ({
                  type: trn.sender === user.walletAddress ? 'send' : 'receive',
                  amount: trn.amount,
                  token: "SOL",
                  recipient: trn.receiver,
                  sender: trn.sender,
                  timestamp: trn.time,
                  note: trn.note,
                  status: trn.status,
                  seen: trn.seen
                })).sort((a, b) => b.timestamp - a.timestamp)

                setTransactionNotification(realNotification)
              }
            })

            setIsLoading(false);
              
            } catch (error) {
              console.log(error as string)
            }
            finally {
              setIsLoading(false)
            }
          
        }
    
        fetchTransactions()
        
      }, [user.walletAddress])

  return (
    <context.Provider
        value={{
            isLoading,
            headerNotification: headerNotification,
            realNotification: transactionNotification,
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