import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { network } from "../lib/utils";
import { useMemo } from "react";
import { clusterApiUrl } from "@solana/web3.js";
import WalletContext from "./wallet-info";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import NotificationProvider from "./notification-provider";
import { CustomAuthProvider } from "./auth-provider";

const Connection = ({ children }: {
    children: React.ReactNode
}) => {
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(()=>[
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ], [network])

  return (
    <ConnectionProvider endpoint={endpoint}> 
    <WalletProvider wallets={wallets} autoConnect> 
      <WalletModalProvider>
        <WalletContext>
          {children}
        </WalletContext>
       </WalletModalProvider>
    </WalletProvider>
    </ConnectionProvider>
    
  )
}

export const CivicProvider = ( { children } : {
  children: React.ReactNode
} ) => {
  // const API_KEY = import.meta.env.VITE_CIVIC_KEY
  return(
    <Connection>
      <CustomAuthProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </CustomAuthProvider>
      
    </Connection>
  )
}