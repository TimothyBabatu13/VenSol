
import { useEffect, useState } from "react"
import { Wallet, Send, QrCode, Clock, RefreshCw, Users, Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { SendTokensForm } from "./send-tokens-form"
import { RequestTokensForm } from "./request-tokens-form"
import { TransactionFeed } from "./transaction-feed"
import { SplitBillForm } from "./split-bill-form"
import { useUser } from "@civic/auth-web3/react"
import { userHasWallet } from "@civic/auth-web3";
import { toast } from "sonner"
import { UseWallet } from "../lib/use-wallet"
import { formatAddress } from "../lib/utils"
import { useWallet } from "@solana/wallet-adapter-react"
import type { WalletName } from "@solana/wallet-adapter-base"
import { successToast } from "./my-custom-toast"

export const Dashboard = () => {
  const user = useUser();
  const { connect, select } = useWallet()
  const [activeTab, setActiveTab] = useState("send")
  const { getWalletAddress } = UseWallet();
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const { getBalance } = UseWallet();
  
  useEffect(() => {
    setWalletAddress(getWalletAddress()!)

    const createWallet = async () => {
      if (!user || !user.user) return;
      if (user.user && !userHasWallet(user)) {
        await user.createWallet();
      }
      if (userHasWallet(user)) {
        select('Civic Wallet' as WalletName);
        await connect();
      }
    };
    createWallet();
  }, [user]);

  useEffect(()=>{
    //go through this
    /*
    I dont know why the hell this code is not working
    */
    console.log(getBalance())
    setWalletBalance(getBalance()!)
  }, [user.user])

  const refreshBalance = () => {
    const response = getBalance();
    setWalletBalance(response!);
    toast('Wallet updated 🚀🚀')
  }
 

  return (
      <main className="flex-1 py-6">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Wallet</CardTitle>
                <CardDescription>Your Solana wallet details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage 
                      src={user?.user?.picture}
                      draggable={false}
                    />
                    <AvatarFallback>
                      {user.user?.username ? user.user?.username.substring(0, 2).toUpperCase() : "WA"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.user?.username || "Wallet Owner"}</p>
                    <p className="text-xs text-muted-foreground">
                      {walletAddress ? <span className="flex w-full items-center">
                        {formatAddress(walletAddress)}
                        <Copy 
                          className="ml-5 cursor-pointer" 
                          size={12}
                          onClick={() => {
                            navigator.clipboard.writeText(walletAddress);
                            successToast('Wallet address copied')
                          }}
                        />
                      </span>
                       : "No wallet connected"}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">SOL Balance</p>
                    <p className="font-medium">{walletBalance?.toFixed(4)} SOL</p>
                  </div>
                  {/* {Object.entries(user.tokenBalances).map(([token, balance]) => (
                    <div key={token} className="flex justify-between">
                      <p className="text-sm text-muted-foreground">{token}</p>
                      <p className="font-medium">{balance}</p>
                    </div>
                  ))} */}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full cursor-pointer" 
                onClick={refreshBalance}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Balances
                </Button>
              </CardFooter>
            </Card>

            <div className="hidden md:block">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Quick Actions</h3>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start cursor-pointer" onClick={() => setActiveTab("send")}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Tokens
                  </Button>
                  <Button variant="outline" className="justify-start cursor-pointer" onClick={() => setActiveTab("request")}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Request Tokens
                  </Button>
                  <Button variant="outline" className="justify-start cursor-pointer" onClick={() => setActiveTab("history")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Transaction History
                  </Button>
                  <Button variant="outline" className="justify-start cursor-pointer" onClick={() => setActiveTab("split")}>
                    <Users className="mr-2 h-4 w-4" />
                    Split Bill
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-5 md:grid-cols-5">
                <TabsTrigger value="wallet" className="cursor-pointer">
                  <Wallet className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Wallet</span>
                </TabsTrigger>
                <TabsTrigger value="send" className="cursor-pointer">
                  <Send className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Send</span>
                </TabsTrigger>
                <TabsTrigger value="request" className="cursor-pointer">
                  <QrCode className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Request</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="cursor-pointer">
                  <Clock className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">History</span>
                </TabsTrigger>
                <TabsTrigger value="split" className="cursor-pointer">
                  <Users className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Split Bill</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wallet" className="md:hidden">
                {/* Mobile wallet view - already shown in sidebar for desktop */}
              </TabsContent>

              <TabsContent value="send">
                <Card>
                  <CardHeader>
                    <CardTitle>Send Tokens</CardTitle>
                    <CardDescription>Send SOL or SPL tokens to another user</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SendTokensForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="request">
                <Card>
                  <CardHeader>
                    <CardTitle>Request Tokens</CardTitle>
                    <CardDescription>Generate a QR code to request tokens</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RequestTokensForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Your recent transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TransactionFeed />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="split">
                <Card>
                  <CardHeader>
                    <CardTitle>Split Bill</CardTitle>
                    <CardDescription>Create a bill for multiple people to pay</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SplitBillForm />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
  )
}
