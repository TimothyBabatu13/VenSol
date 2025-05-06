import { CivicAuthProvider, UserButton } from "@civic/auth-web3/react";

export function CivicProvider({ children }: {
    children: React.ReactNode
}) {
  return (
    <CivicAuthProvider clientId="71bf97f0-8ffe-4279-ae2d-f45706977fd5">
      <UserButton />
      {children}
    </CivicAuthProvider>
  )
}