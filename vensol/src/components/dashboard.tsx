
import { useState } from "react"
import { Wallet, Send, QrCode, Clock, RefreshCw, LogOut, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { SendTokensForm } from "./send-tokens-form"
import { RequestTokensForm } from "./request-tokens-form"
import { TransactionFeed } from "./transaction-feed"
import { SplitBillForm } from "./split-bill-form"
import { useAuthProvider } from "../context/auth-provider"
import { useUser } from "@civic/auth-web3/react"

export const Dashboard = () => {
  const userAuth = useAuthProvider();
  const user = useUser();
  const [activeTab, setActiveTab] = useState("wallet")

  if (!userAuth?.authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">ZeroPay</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={userAuth.refreshBalances}>
              <RefreshCw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={user.signOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
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
                    <AvatarFallback>
                      {user.user?.username ? user.user?.username.substring(0, 2).toUpperCase() : "WA"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.user?.username || "Wallet Owner"}</p>
                    <p className="text-xs text-muted-foreground">
                      {/* {user.user.walletAddress ? formatAddress(user.walletAddress) : "No wallet connected"} */}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm text-muted-foreground">SOL Balance</p>
                    {/* <p className="font-medium">{user.solBalance.toFixed(4)} SOL</p> */}
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
                <Button variant="outline" className="w-full" onClick={userAuth.refreshBalances}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Balances
                </Button>
              </CardFooter>
            </Card>

            <div className="hidden md:block">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Quick Actions</h3>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start" onClick={() => setActiveTab("send")}>
                    <Send className="mr-2 h-4 w-4" />
                    Send Tokens
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => setActiveTab("request")}>
                    <QrCode className="mr-2 h-4 w-4" />
                    Request Tokens
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => setActiveTab("history")}>
                    <Clock className="mr-2 h-4 w-4" />
                    Transaction History
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => setActiveTab("split")}>
                    <Users className="mr-2 h-4 w-4" />
                    Split Bill
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid grid-cols-4 md:grid-cols-5">
                <TabsTrigger value="wallet" className="md:hidden">
                  <Wallet className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Wallet</span>
                </TabsTrigger>
                <TabsTrigger value="send">
                  <Send className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Send</span>
                </TabsTrigger>
                <TabsTrigger value="request">
                  <QrCode className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Request</span>
                </TabsTrigger>
                <TabsTrigger value="history">
                  <Clock className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">History</span>
                </TabsTrigger>
                <TabsTrigger value="split">
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
    </div>
  )
}
