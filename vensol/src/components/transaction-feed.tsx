
import { ArrowDownLeft, ArrowUpRight, Copy, Link } from "lucide-react"
import { formatAddress, formatDate } from "../lib/utils"
import { useTransactionProvider } from "../context/notification-provider"
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { successToast } from "./my-custom-toast";


export const TransactionFeed = () => {

  const data = useTransactionProvider();
 

  if (data?.isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (data?.realNotification.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    )
  }

  

  return (
    <div className="space-y-4">
      {data?.realNotification.map((tx) => (
        <div key={crypto.randomUUID()} className="flex items-start gap-4 p-4 rounded-lg border">
          <div className={`rounded-full p-2 bg-[#f7f7f7]`}>
            {tx.type === "receive" ? (
              <ArrowDownLeft className="h-5 w-5 text-black" />
            ) : (
              <ArrowUpRight className="h-5 w-5 text-black" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">
                  {tx.type === "receive" ? "Received" : "Sent"} {+tx.amount / LAMPORTS_PER_SOL} {tx.token}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  {tx.type === "receive" ? `From: ${formatAddress(tx.sender)}` : `To: ${formatAddress(tx.recipient)}`}
                  <Copy 
                    size={12}
                    className="cursor-pointer"
                    onClick={()=>{
                      navigator.clipboard.writeText(tx.type === 'receive' ? tx.sender : tx.recipient);
                      successToast('Wallet copied.')
                    }}
                  />
                </p>
                {tx.url && (
                  <a href={tx.url} target="_blank" className="flex text-muted-foreground items-center gap-2">
                    <p className="text-sm mt-1">{formatAddress(tx.url)}</p>
                    <Link cursor={'pointer'} size={12}/>
                  </a>
                )}
                {tx.note && <p className="text-sm mt-1">{tx.note}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">{formatDate(tx.timestamp)}</p>
                <p
                  className={`text-xs ${
                    tx.status === "succesful"
                      ? "text-green-600 font-semibold"
                      : tx.status === "pending"
                        ? "text-yellow-600 font-semibold"
                        : "text-red-600 font-semibold"
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
