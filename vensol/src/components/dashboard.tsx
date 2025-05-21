
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
import { formatAddress } from "../lib/utils"
import { successToast } from "./my-custom-toast"
import { WalletComponent } from "./wallet"
import { useWalletDetailsProvider } from "../context/wallet-info"
import { createAccount } from "../lib/firebase-helpers"
import { useAuthProvider } from "../context/auth-provider"

export const Dashboard = () => {
  
  
  const [activeTab, setActiveTab] = useState("send")
  const auth = useAuthProvider();
  const wallet = useWalletDetailsProvider();

  const refreshBalance = () => {
    wallet.refresh();
    successToast('Balance updated 🚀🚀') 
  }

  useEffect(()=>{

    if(wallet.walletAddress.trim()){
      if(!auth?.authenticated){
        return;
      }
      createAccount({
        userWallet: wallet.walletAddress
      })
    }
    
  },[wallet.walletAddress])
  
 
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
                      // src={user?.user?.picture}
                      draggable={false}
                    />
                    <AvatarFallback>
                      {/* {user.user?.username ? user.user?.username.substring(0, 2).toUpperCase() : "WA"} */}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{false || "Wallet Owner"}</p>
                    <p className="text-xs text-muted-foreground">
                      {wallet.walletAddress ? <span className="flex w-full items-center">
                        {formatAddress(wallet.walletAddress)}
                        <Copy 
                          className="ml-5 cursor-pointer" 
                          size={12}
                          onClick={() => {
                            navigator.clipboard.writeText(wallet.walletAddress);
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
                    <p className="font-medium">{wallet.walletBalance?.toFixed(4)} SOL</p>
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

              <TabsContent value="wallet">
                <WalletComponent 
                  // user={user}
                  walletAddress={wallet.walletAddress}
                  walletBalance={wallet.walletBalance}
                />
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
