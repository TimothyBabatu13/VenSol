import { LogOut, RefreshCw, Wallet } from "lucide-react"
import { Button } from "../components/ui/button"
import { useUser } from "@civic/auth-web3/react";
import { useAuthProvider, type ProviderType } from "../context/auth-provider";
import type { Web3UserContextType } from "@civic/auth-web3";
import { Outlet } from "react-router-dom";

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

const LoggedInHeader = ({ userAuth, user } : {
    userAuth: ProviderType | undefined,
    user: Web3UserContextType
}) => {

    return (
    <div className="flex items-center gap-4 ml-auto">
        <Button className="cursor-pointer" variant="ghost" size="icon" onClick={userAuth?.refreshBalances}>
            <RefreshCw className="h-5 w-5" />
        </Button>
        <Button className="cursor-pointer" variant="ghost" size="icon" onClick={user.signOut}>
            <LogOut className="h-5 w-5" />
        </Button>
    </div>
        
    )
}

const NotUntheticatedHeader = ({ user } : {
    user: Web3UserContextType
}) => {
    return (
          <Button
            className="cursor-pointer" 
            onClick={()=>user.signIn()} disabled={user.isLoading}>
            {user.isLoading ? "Loading..." : "Sign In with Civic"}
          </Button>
    )
}

const Header = () => {

    const userAuth = useAuthProvider();
    const user = useUser();
    // userAuth?.authenticated
  return (
    <div className="flex flex-col min-h-screen">
        <header className="border-b sticky top-0 z-10">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">VenSol</h1>
          </div>
          {
            true ? 
            <LoggedInHeader 
                user={user} 
                userAuth={userAuth} 
            /> : 
            <NotUntheticatedHeader 
                user={user}
            />
          }
        </div>
      </header>
      <Outlet />
      <Footer />
    </div>
    
  )
}

export default Header