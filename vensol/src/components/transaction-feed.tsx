
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { formatAddress, formatDate } from "../lib/utils"
import { useTransactionProvider } from "../context/notification-provider"


export const TransactionFeed = () => {

  const data = useTransactionProvider();

  if (data?.isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (data?.transcations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No transactions found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {data?.transcations.map((tx) => (
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
