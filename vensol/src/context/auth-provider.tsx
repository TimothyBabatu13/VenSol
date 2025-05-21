
import { useWallet } from "@solana/wallet-adapter-react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"


export interface ProviderType {
    authenticated: boolean,
    isLoadingInBackground: boolean
}
const Provider = createContext<ProviderType>({
    authenticated: false,
    isLoadingInBackground: true
})

export function CustomAuthProvider({ children }: { children: ReactNode }) {
    
    const [auth, setAuth] = useState<ProviderType>({
        authenticated: false,
        isLoadingInBackground: true
    });

    const { connected, connecting, disconnecting } = useWallet()

    useEffect(()=>{

        setAuth(prev => ({
            ...prev,
            authenticated: connected
        }))
    }, [connected, connecting, disconnecting])

    const delayResponse = () => {
        return new Promise(resolve => {
            setTimeout(()=>{
                resolve('')
            }, 200)
        })
    }
    
    useEffect(()=>{
        delayResponse()
            .then(()=>{
                setAuth(prev => ({
                    ...prev,
                    isLoadingInBackground: false
                }))
        })
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