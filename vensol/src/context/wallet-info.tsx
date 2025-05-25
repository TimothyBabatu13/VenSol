import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { createContext, useContext, useEffect, useState } from "react"

interface contextType {
    walletAddress: string,
    walletBalance: number,
    refresh: () => void
}


const initialData: contextType = {
    walletAddress: '',
    walletBalance: 0,
    refresh: () => {

    }
}

const context = createContext<contextType>(initialData);

const WalletContext = ({ children } : {
    children: React.ReactNode
}) => {

    const [walletData, setWalletData] = useState<contextType>(initialData)

    const { connection } = useConnection();
    const { publicKey, connected, connecting } = useWallet();
    
    const getBalance = async () => {
        if (publicKey) {
            const res = await connection.getBalance(publicKey) / LAMPORTS_PER_SOL
            return res
        }
    }
    
    const refresh = async () => {
        const res = await getBalance()
        if(res) {
            setWalletData(prev => ({
                ...prev,
                walletBalance: res
            }))
        }
    }

    useEffect(() =>{
        if(publicKey){
            const address = publicKey.toString();
            setWalletData(prev => ({
                ...prev,
                walletAddress: address
            }))
        }
    }, [connected, connecting])

    useEffect(() =>{
        const rrr = async () => {
            if(publicKey) {
                const res = await getBalance();
                if(res) {
                    setWalletData(prev => ({
                        ...prev,
                        walletBalance: res
                    }))
                }
            }
        }
        rrr();
    }, [connected, connecting])

  return (
    <context.Provider value={{...walletData, refresh}}>
        {children}
    </context.Provider>
  )
}

export const useWalletDetailsProvider = () => {
    const Context = useContext(context);
    if(!Context){
        throw new Error('Context must be used in provider')
    }

    return Context
} 

export default WalletContext