import { useAuthProvider } from "../context/auth-provider"
import { Dashboard } from "../components/dashboard";
import { Toaster } from "../components/ui/sonner";
import { useEffect, useState } from "react";
import { useUser } from "@civic/auth-web3/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { LandingPage } from "../components/landing-page";
import { createAccount } from "../lib/firebase-helpers";

const Home = () => {
  const auth = useAuthProvider();
  const user = useUser();

  const [loading, setIsLoading] = useState<boolean>(true);
  const { publicKey } = useWallet();

  const ceateAccount = async () => {
    if (publicKey) {
      const wallet = publicKey.toString();
      console.log(wallet)
      createAccount({
        userWallet: wallet
      })
    }
  }

  useEffect(() =>{
    ceateAccount()
  }, [user.user])

  
  useEffect(()=>{
    if(auth?.loading){
      setIsLoading(false);
    }
    console.log(loading, user.isLoading)
  }, [user])

  if (loading || user.isLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div className="">
      {
        auth?.authenticated ? <Dashboard /> : <LandingPage />
      }
      <Toaster />
    </div>
  )
}

export default Home
