import { CivicAuthProvider } from "@civic/auth-web3/react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";

export function CivicProvider({ children }: {
    children: React.ReactNode
}) {

  const API_KEY = import.meta.env.VITE_CIVIC_KEY
  const network = WalletAdapterNetwork.Devnet
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  return (
    <ConnectionProvider endpoint={endpoint}> 
    <WalletProvider wallets={[]} autoConnect> 
      <WalletModalProvider>
        <CivicAuthProvider 
          clientId={API_KEY}
          // autoCreateWallet
          >
            {/* <WalletMultiButton /> */}
          {/* <UserButton /> */}
        {children}
      </CivicAuthProvider>  
       </WalletModalProvider>
    </WalletProvider>
    </ConnectionProvider>
    
  )
}