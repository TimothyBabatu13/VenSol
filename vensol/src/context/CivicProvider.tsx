import { CivicAuthProvider } from "@civic/auth-web3/react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

const Connection = ({ children }: {
    children: React.ReactNode
}) => {

  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}> 
    <WalletProvider wallets={[]} autoConnect> 
      <WalletModalProvider>
        {children}
       </WalletModalProvider>
    </WalletProvider>
    </ConnectionProvider>
    
  )
}

export const CivicProvider = ( { children } : {
  children: React.ReactNode
} ) => {
  const API_KEY = import.meta.env.VITE_CIVIC_KEY
  return(
    <Connection>
      <CivicAuthProvider 
        clientId={API_KEY}
      >
        {children}
      </CivicAuthProvider>
    </Connection>
  )
}