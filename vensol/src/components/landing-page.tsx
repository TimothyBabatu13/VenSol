
import { ArrowRight, Wallet, Send, Clock } from "lucide-react"
import { Button } from "./ui/button"
import { DrawerDemo } from "../layout/Header";

interface CardProp {
  icon: React.ReactNode,
  name: string,
  details: string
}
const Card = ({ icon, name, details } : CardProp) => {  
  return(
  <div className="space-y-2 flex flex-col items-center text-center">
    <div className="p-4 bg-primary/10 rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-bold">{name}</h3>
    <p className="text-muted-foreground">
      {details}
    </p>
  </div>)
}

const Cards = () => {
  const data : Array<CardProp> = [
    {
      details: 'Automatically generate a Solana wallet when you sign in with VenSol.',
      icon: <Wallet className="h-10 w-10 text-primary" />,
      name: 'Embedded Wallet'
    },
    {
      details: 'Send SOL and SPL tokens to friends or request payments via QR codes.',
      icon: <Send className="h-10 w-10 text-primary" />,
      name: 'Send & Request'
    },
    {
      details: 'View your complete transaction history in a simple feed.',
      icon: <Clock className="h-10 w-10 text-primary" />,
      name: 'Transaction History'
    }

  ]
  return(
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {data.map(({details, name, icon}) => (
        <Card 
          key={crypto.randomUUID()}
          name={name}
          icon={icon}
          details={details}
        />
      ))}
    </div>
  )
}

export const LandingPage = () => {

  return (
      <main className="flex-1">
        <section className="py-20 bg-gradient-to-b from-background to-muted">
          <div className="px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Web3 Payments Made Simple</h2>
                <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Send and receive crypto payments with ease. VenSol brings the simplicity of Venmo to the Solana
                  blockchain.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <DrawerDemo>
                    <Button 
                      size="lg"
                      className="cursor-pointer"
                    >
                      Get Started <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </DrawerDemo>
                </div>
              </div>
              <div className="mx-auto lg:ml-auto">
                <div className="aspect-video overflow-hidden rounded-xl bg-foreground/5 border">
                  <img
                    alt="ZeroPay Dashboard Preview"
                    className="object-cover w-full h-full"
                    src="/landing-page.jpg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="px-4 md:px-6">
            <Cards />
          </div>
        </section>
      </main>
  )
}
