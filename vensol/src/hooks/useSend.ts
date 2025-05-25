import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {  LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";

export const UseSend = async ({ amount, sender, receiver } : {
    amount: number,
    sender: string,
    receiver: string
}) => {

    const { connection } = useConnection()
    const { sendTransaction } = useWallet()

    const lamports = amount * LAMPORTS_PER_SOL;
    const fromPubkey = new PublicKey(sender);
    const toPubkey = new PublicKey(receiver);

    const transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports,
        }));

    const { context: { slot: minContextSlot }, value: { blockhash, lastValidBlockHeight }} = await connection.getLatestBlockhashAndContext();

    const signature = await sendTransaction(transaction, connection, { minContextSlot });
          await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
          const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
          console.log(explorerUrl)
}