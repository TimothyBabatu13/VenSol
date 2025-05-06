
import type { AuthStatus } from "@civic/auth-web3";
import { useUser } from "@civic/auth-web3/react"
import { createContext, useEffect, useState, type ReactNode } from "react"

interface ProviderType {
    authenticated: boolean
}
const Provider = createContext<ProviderType>({
    authenticated: false
})

export function CivicAuthProvider({ children }: { children: ReactNode }) {
    const [userState, setUserState] = useState<ProviderType>({
        authenticated: false
    })
    const user = useUser();

    const authStat = user.authStatus;
    console.log(userState)
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
