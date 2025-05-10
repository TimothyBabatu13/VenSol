
import { useUser } from "@civic/auth-web3/react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { UseWallet } from "../lib/use-wallet"

export interface ProviderType {
    authenticated: boolean,
    refreshBalances: () => number,
    loading: boolean
}
const Provider = createContext<ProviderType>({
    authenticated: false,
    refreshBalances: () => 0,
    loading: true
    
})

export function CivicAuthProvider({ children }: { children: ReactNode }) {
    const { getBalance } = UseWallet()
    const [userState, setUserState] = useState<ProviderType>({
        authenticated: false,
        refreshBalances: ()=>{
            return getBalance()!
        },
        loading: true
    })
    const user = useUser();

    const authStat = user.authStatus;
    
    useEffect(()=>{
        setUserState(prev => ({
            ...prev,
            authenticated: authStat === 'authenticated',
            loading: user.isLoading
        }))
    }, [user])
  return (
    <Provider.Provider value={userState}>
        {children}
    </Provider.Provider>
  )
}

export const useAuthProvider = () => {
    const context = useContext(Provider);
    if(!context) return;
    return context;
}