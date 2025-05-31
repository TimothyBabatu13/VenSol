
import { useState } from "react"
import { Wallet, Send, QrCode, Clock, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { SendTokensForm } from "./send-tokens-form"
import { RequestTokensForm } from "./request-tokens-form"
import { TransactionFeed } from "./transaction-feed"
import { SplitBillForm } from "./split-bill-form"
import { WalletComponent } from "./wallet"
import RequestAirdrop from "./request-airdrop"

export const Dashboard = () => {
  
  const [activeTab, setActiveTab] = useState("send")
 
  return (
      <main className="flex-1 py-6">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div className="space-y-6">
            <WalletComponent />

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
                  <Button variant="outline" className="justify-start cursor-pointer" onClick={() => setActiveTab("airdrop")}>
                    <Users className="mr-2 h-4 w-4" />
                    Request Airdrop
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-6 md:grid-cols-6">
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
                <TabsTrigger value="airdrop" className="cursor-pointer">
                  <Users className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Request Airdop</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="wallet">
                <WalletComponent />
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

              <TabsContent value="airdrop">
                <Card>
                  <CardHeader>
                    <CardTitle>Request Airdrop</CardTitle>
                    <CardDescription>Request for airdrop to test out platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RequestAirdrop />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
  )
}
