
import { useUser } from "@civic/auth-web3/react"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { any } from "zod"

interface ProviderType {
    authenticated: boolean,
    refreshBalances: () => any
}
const Provider = createContext<ProviderType>({
    authenticated: false,
    refreshBalances: () =>{}
    
})

export function CivicAuthProvider({ children }: { children: ReactNode }) {
    const [userState, setUserState] = useState<ProviderType>({
        authenticated: false,
        refreshBalances: ()=>{
            console.log('')
        }
    })
    const user = useUser();

    const authStat = user.authStatus;
    
    useEffect(()=>{
        setUserState(prev => ({
            ...prev,
            authenticated: authStat === 'authenticated'
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