import { LogOut, Wallet as WalletIcon } from "lucide-react"
import { useAuthProvider } from "../context/auth-provider";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserProfile } from "./component/user";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { HoverCardDemo } from "../components/hover-text";
import { Notification } from "./component/notification";

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

    return (
    <div className="flex items-center gap-4 ml-auto">
      <Notification />

      <HoverCardDemo text="Profile">
        <UserProfile />
      </HoverCardDemo>
       
       <HoverCardDemo text="Logout">
          <WalletDisconnectButton 
            children={<LogOut height={16} width={16}/>}
          />
       </HoverCardDemo>
    </div>
        
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
              
              <div className="loogedin">
              <LoggedInHeader />
              {/* <WalletMultiButton style={{background: 'blue'}} />  */}
              </div>             
 :
              <>
                <WalletMultiButton 
                  children={
                  <h1>Sign In</h1>
                  }
                  style={{
                    background: 'black',
                    borderRadius: '10px',
                    fontSize: '0.875rem',
                  }}
                />
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