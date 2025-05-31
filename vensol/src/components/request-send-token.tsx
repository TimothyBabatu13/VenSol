import { useState } from "react"
import { Copy, ExternalLink, Wallet } from "lucide-react"
import { errorToast, successToast } from "./my-custom-toast"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "@radix-ui/react-select"
import { Button } from "./ui/button"
import { AddFinalTransaction, AddInitialTransaction, AddTransactionFailed, type qrCodeData } from "../lib/firebase-helpers"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { useWalletDetailsProvider } from "../context/wallet-info"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { network } from "../lib/utils"

export default function Component({ data } : {
  data: qrCodeData
}) {
  const [isProcessing, setIsProcessing] = useState(false)
  const wallet = useWalletDetailsProvider();
  const { connection } = useConnection()
  const { sendTransaction } = useWallet()


  const truncateAddress = (address: string) => {
    if(!address) return
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      successToast("Address copied to clipboard")
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const handleSendPayment = async () => {

    if(!wallet.walletAddress){
        errorToast(`Please sign in to do this transaction`)
        return
      }

    setIsProcessing(true)
    
    const uniqueId = crypto.randomUUID();

    try {
      
      const lamports = parseInt(data.amount) * LAMPORTS_PER_SOL;
      const fromPubkey = new PublicKey(wallet.walletAddress);
      const toPubkey = new PublicKey(data.recipient)
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports,
        }));
        
        AddInitialTransaction({
          amount: lamports.toString(),
          receiver: toPubkey.toString(),
          sender: fromPubkey.toString(),
          uniqueId,
          note: data.note
        });
        
        const { context: { slot: minContextSlot }, value: { blockhash, lastValidBlockHeight }} = await connection.getLatestBlockhashAndContext();

        const signature = await sendTransaction(transaction, connection, { minContextSlot });
        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
        const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=${network}`;
        successToast(`${data.amount}SOL sent 🚀🚀`)
        wallet.refresh()
        console.log(explorerUrl)
        
        await AddFinalTransaction({uniqueId, url: explorerUrl});
    } catch (error) {
      const err = error as Error
      console.log(err)
      errorToast(err.message)
      await AddTransactionFailed({uniqueId}) 
    }
    finally{
      setIsProcessing(false)
    }
    
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-['oklab(0.994745 0 0)'] p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r bg-black rounded-full flex items-center justify-center">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Payment Request</CardTitle>
          {/* <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100">
            Solana Network
          </Badge> */}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {data?.amount}SOL
            </div>
            <div className="text-sm text-gray-500">Amount to send</div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Recipient Address</label>
              <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                <code className="flex-1 text-sm font-mono text-gray-800">{truncateAddress(data?.recipient)}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(data.recipient)}
                  className="h-8 w-8 p-0 cursor-pointer"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 cursor-pointer"
                  onClick={() => window.open(`https://explorer.solana.com/address/${data?.recipient}?cluster=devnet`, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            
          </div>

          <Button
            onClick={handleSendPayment}
            disabled={isProcessing}
            className="w-full cursor-pointer"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              `Send ${data?.amount} SOL`
            )}
          </Button>
          <div className="text-xs text-gray-500 text-center">
            Make sure you have sufficient balance and network fees
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
