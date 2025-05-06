import { CivicAuthProvider, UserButton } from "@civic/auth-web3/react";

export function CivicProvider({ children }: {
    children: React.ReactNode
}) {

  const API_KEY = import.meta.env.VITE_CIVIC_KEY
  
  return (
    <CivicAuthProvider 
        clientId={API_KEY}
    >
      <UserButton />
      {children}
    </CivicAuthProvider>
  )
}