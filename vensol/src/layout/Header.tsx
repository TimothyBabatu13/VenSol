import { Bell, LogOut, Wallet as WalletIcon } from "lucide-react"
import { Button } from "../components/ui/button"
import { useAuthProvider } from "../context/auth-provider";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../components/ui/drawer";
import { Card, CardContent } from "../components/ui/card";
import type { WalletName } from "@solana/wallet-adapter-base";
import { useTransactionProvider } from "../context/notification-provider";
import { UserProfile } from "./component/user";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Footer = () => {
    const date = new Date();
    const year = date.getFullYear();
    return(
    <footer className="border-t py-6 md:py-0">
        <div className="flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                © {year} VenSol. All rights reserved.
            </p>
        </div>
      </footer>
    )
}

const LoggedInHeader = () => {

  const notification = useTransactionProvider();
  const { disconnect } = useWallet();
  const handleLogout = () => {
    disconnect()
  }
    return (
    <div className="flex items-center gap-4 ml-auto">
        <Button className="cursor-pointer relative" variant="ghost" size="icon">
            <Bell />
            {
             notification?.numberOfNotifications && <span className="absolute top-0 right-1.5">{notification?.numberOfNotifications}</span>
            }
        </Button>
        <Button 
          className="cursor-pointer" 
          variant="ghost" 
          size="icon"
          onClick={handleLogout}
        >
            <LogOut  />
        </Button>
       <UserProfile />
       
    </div>
        
    )
}



export function DrawerDemo({ children } : {
  children: React.ReactNode
}) {

  const { select, connect, wallets } = useWallet()
  

  const handleConnect = (name: string) => {
    select(name as WalletName)
    connect()
  }


  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="text-center ">
        <div className="mx-auto w-full max-w-sm ">
          <DrawerHeader>
            <DrawerTitle>
              <p className="text-3xl font-bold tracking-tight">Connect Wallet</p>
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground">
              Select a wallet from the list below to connect
            </DrawerDescription>
          </DrawerHeader>
          
          <DrawerFooter className="grid grid-cols-2">
            {
              wallets.map((wallet) =>(
                <Card key={wallet.adapter.name} className="border border-slate-200">
                  <CardContent className="p-0">
                    {/* flex items-center justify-between */}
                    <div className=" p-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center`}>
                          <img src={wallet.adapter.icon} alt={wallet.adapter.icon} className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-medium">{wallet.adapter.name}</h3>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="rounded-full cursor-pointer"
                        onClick={() => handleConnect(wallet.adapter.name)}
                      >
                        Connect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) )
            }
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

const NotUntheticatedHeader = () => {

    return (
      <>
      <DrawerDemo> 
        <Button
            className="cursor-pointer">
            Sign In
          </Button>
      </DrawerDemo>
      </>
    )
}


const Header = () => {

    const userAuth = useAuthProvider();

    const [headerBg, setHeaderBg] = useState<boolean>(false);

    useEffect(()=>{
      const isActive = () => {
        if(window){
          setHeaderBg(window.scrollY > 30);
        }
      }
      window.addEventListener('scroll', isActive)
      return () => {
        if(window) {
          window.removeEventListener('scroll', isActive)
        }
      }
    })

  return (
    <div className={`flex flex-col justify-between min-h-screen`}>
        <header className={`border-b sticky top-0 z-10 transition-all ${headerBg ? 'bg-white' : ''}`}>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <WalletIcon className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">VenSol</h1>
            </div>
            {
              !userAuth?.isLoadingInBackground 
              ?
              ( userAuth?.authenticated 
                ? 
              <>
              
              <LoggedInHeader />
              <WalletMultiButton style={{background: 'blue'}} /> 
  </>             
 :
              <>
              <NotUntheticatedHeader 
              />
              <WalletMultiButton />
              </> 
              
            ) : 
            (
            <div>Loading apparently</div>
          )            
            }
          </div>
      </header>
      <Outlet />
      <Footer />
    </div>
    
  )
}

export default Header