import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";

export const UseWallet = () => {
    const [balance, setBalance] = useState<number>();
    const [walletAddress, setWalletAddress] = useState<string>();
    const { connection } = useConnection();
    const { publicKey } = useWallet();

    const getBalance = () => {
        if (publicKey) {
            connection.getBalance(publicKey).then(setBalance);
        }
        return balance;
    }

    const getWalletAddress = () => {

        if(publicKey) {
            setWalletAddress(publicKey.toString())
        }
        return walletAddress
    }
  
    return {
        getBalance,
        getWalletAddress
    }
  
}
