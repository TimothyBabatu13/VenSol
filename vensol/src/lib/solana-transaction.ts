import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";


export const SendSol = async ({ recipient, amount } : {
    recipient: string,
    amount: number,
    note?: string
}) => {

    const connection = new Connection('https://api.devnet.solana.com');
    const { publicKey, sendTransaction } = useWallet();
    try {
    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: publicKey!,
            toPubkey: new PublicKey(recipient),
            lamports: LAMPORTS_PER_SOL * amount,
        }));
        
        const signature = await sendTransaction(transaction, connection);
        console.log(signature)    
    } catch (error) {
        console.log(error)
    }
    
}