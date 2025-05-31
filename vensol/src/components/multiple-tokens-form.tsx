
import { useEffect, useState } from "react"
import { Copy, Receipt, Users, Info, ArrowRight } from "lucide-react"
import { errorToast, successToast } from "./my-custom-toast"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Separator } from "@radix-ui/react-select"
import { Progress } from "./ui/progress"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { AddFinalTransaction, AddInitialTransaction, AddTransactionFailed, UpdateReadCodeCount, type qrCodeData } from "../lib/firebase-helpers"
import { useWalletDetailsProvider } from "../context/wallet-info"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { network } from "../lib/utils"
import { useLocation } from "react-router-dom"

export default function SplitBillComponent({ data, } : {
    data: qrCodeData,
}) {
  const [isContributing, setIsContributing] = useState(false)
  const [contributorsCount, setContributorsCount] = useState(0)
  const [arrayOfContributors, setArrayOfContributors] = useState<Array<string>>([])
  const [contributed, setIsContributed] = useState<boolean>(false)
  const wallet = useWalletDetailsProvider();
  const { connection } = useConnection();
  const { sendTransaction } = useWallet()

  const location = useLocation();
  const id = location.search.split('?data=')[1];

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      successToast("Address copied to clipboard")
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const handleContribute = async () => {

    if(!wallet.walletAddress){
        errorToast(`Please sign in to do this transaction`);
        return;
    }

    setIsContributing(true)
    const uniqueId = crypto.randomUUID();

    try {

        const lamports = parseInt(data?.amountPerPerson!) * LAMPORTS_PER_SOL;
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
        successToast(`${data?.amountPerPerson}SOL sent 🚀🚀`)
        wallet.refresh()

        UpdateReadCodeCount({id, walletAddress: wallet.walletAddress});
        await AddFinalTransaction({uniqueId, url: explorerUrl});
        
    } catch (error) {
        const err = error as Error
        console.log(err)
        errorToast(err.message)
        await AddTransactionFailed({uniqueId}) 
    }
    finally{
        setIsContributing(false)
    }

  }

  useEffect(() =>{
    setContributorsCount(data.arrayOfPeoplePaid?.length!);
    const checkIfContributed = () => {
      return data.arrayOfPeoplePaid?.includes(wallet.walletAddress);
    }
    setIsContributed(checkIfContributed()!);
    setArrayOfContributors(data.arrayOfPeoplePaid!)
    
  }, [data.arrayOfPeoplePaid?.length])
  const progressPercentage = (contributorsCount / data?.numberOfPeople!) * 100

  return (
    <div className="flex justify-center min-h-screen bg-gradient-to-br bg-['oklab(0.994745 0 0) p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        {/* <div className="h-2 bg-gradient-to-r from-teal-400 to-emerald-500"></div> */}
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <div className="text-black bg-[#E7E7E8] px-3 py-1 rounded-full text-xs font-medium">Split Bill</div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                    <Info className="h-4 w-4 text-gray-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Split bill request on Solana</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardTitle className="text-xl font-bold text-gray-800">{data?.title && data?.title}</CardTitle>
          <p className="text-sm text-gray-500 mt-1">{data?.note && data?.note}</p>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {data?.totalAmount} SOL
              </p>
            </div>
            <div className="flex items-center space-x-1 bg-[#E7E7E8] px-3 py-2 rounded-lg">
              <Users className="h-4 w-4 text-black" />
              <span className="text-sm font-medium text-black">{data?.numberOfPeople} people</span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Receipt className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Your share</span>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {data?.amountPerPerson} SOL
              </p>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Recipient</span>
              </div>
              <div className="flex items-center space-x-2">
                <code className="text-xs font-mono text-gray-600">{truncateAddress(data?.recipient)}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(data?.recipient)}
                  className="h-6 w-6 p-0 cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-gray-700">Progress</span>
              <span className="font-medium">
                {contributorsCount} of {data?.numberOfPeople} paid
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className="h-2 bg-gray-100"
            //   indicatorClassName="bg-gradient-to-r from-teal-400 to-emerald-500"
            />

            <div className="flex justify-center mt-2 space-x-2">
              {Array.from({ length: data?.numberOfPeople! }).map((_, i) => (
                <Avatar
                  key={i}
                  className={`h-8 w-8 bg-transparent`}
                >
                  <AvatarFallback
                    className={`bg-transparent`}
                  >
                    {
                      i === 0 ? (
                        <span className={`${contributed ? "border-2 bg-[#E7E7E8]" : "opacity-40"} h-full w-full flex items-center justify-center`}>
                          {wallet.walletAddress}
                        </span>
                      ) : (
                        
                        <span className={`${arrayOfContributors && !!arrayOfContributors![i] && "border-2 bg-[#E7E7E8]"} h-full w-full flex items-center justify-center`}>
                          {`P${i + 1}`}
                        </span>
                      )
                    }
                    <span></span>
                    
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            onClick={handleContribute}
            disabled={isContributing || contributorsCount >= data?.numberOfPeople!}
            className="w-full cursor-pointer"
          >
            {isContributing ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : contributorsCount >= data?.numberOfPeople! ? (
              <span>All Contributions Received</span>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <span>Contribute Your Share</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
