
import { useWallet } from "@solana/wallet-adapter-react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"


export interface ProviderType {
    authenticated: boolean,
}
const Provider = createContext<ProviderType>({
    authenticated: false
})

export function CivicAuthProvider({ children }: { children: ReactNode }) {
    
    const [auth, setAuth] = useState<ProviderType>({
        authenticated: false,
    });
    const { connected, connecting, disconnecting } = useWallet()

    useEffect(()=>{

        setAuth(prev => ({
            ...prev,
            authenticated: connected
        }))

    }, [connected, connecting, disconnecting])
  return (
    <Provider.Provider value={auth}>
        {children}
    </Provider.Provider>
  )
}

export const useAuthProvider = () => {
    const context = useContext(Provider);
    if(!context) return;
    return context;
}