import { useAuthProvider } from "../context/auth-provider"
import { Dashboard } from "../components/dashboard";
import { Toaster } from "../components/ui/sonner";
// import { LandingPage } from "../components/landing-page";
import { useEffect, useState } from "react";
import { useUser } from "@civic/auth-web3/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const Home = () => {
  const auth = useAuthProvider();
  const user = useUser();
  // console.log(auth?.authenticated)
  const [loading, setIsLoading] = useState<boolean>(true);

  const connection = useConnection();
  const { publicKey } = useWallet();

  const arr = async () => {
console.log(connection)
    // console.log(publicKey)
    if (publicKey) {
      // console.log(publicKey)
      // const balance = await connection.connection.getBalance(publicKey);
      // console.log(balance, 'from balance')
    }
  }

  useEffect(() =>{

    arr()
  }, [])

  
  useEffect(()=>{

    if(auth?.loading){
      setIsLoading(false);
    }
  }, [user])

  if(loading) return <Dashboard />

  return (
    <div className="">
      {
        auth?.authenticated ? <Dashboard /> : <Dashboard />
      }
      <Toaster />
    </div>
  )
}

export default Home