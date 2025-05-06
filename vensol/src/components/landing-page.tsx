
import { ArrowRight, Wallet, Send, Clock } from "lucide-react"
import { Button } from "./ui/button"
import { useUser } from "@civic/auth-web3/react";

export const LandingPage = () => {

    const user = useUser();
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">ZeroPay</h1>
          </div>
          <Button onClick={()=>user.signIn()} disabled={user.isLoading}>
            {user.isLoading ? "Loading..." : "Sign In with Civic"}
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Web3 Payments Made Simple</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Send and receive crypto payments with ease. ZeroPay brings the simplicity of Venmo to the Solana
                  blockchain.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" onClick={()=>user.signIn()}>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto">
                <div className="aspect-video overflow-hidden rounded-xl bg-foreground/5 border">
                  <img
                    alt="ZeroPay Dashboard Preview"
                    className="object-cover w-full h-full"
                    src="/placeholder.svg?height=500&width=800"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2 flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Wallet className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Embedded Wallet</h3>
                <p className="text-muted-foreground">
                  Automatically generate a Solana wallet when you sign in with Civic.
                </p>
              </div>
              <div className="space-y-2 flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Send className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Send & Request</h3>
                <p className="text-muted-foreground">
                  Send SOL and SPL tokens to friends or request payments via QR codes.
                </p>
              </div>
              <div className="space-y-2 flex flex-col items-center text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Clock className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Transaction History</h3>
                <p className="text-muted-foreground">View your complete transaction history in a simple feed.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2024 ZeroPay. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
