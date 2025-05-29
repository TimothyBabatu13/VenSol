"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useAuthProvider } from "../context/auth-provider"
import { errorToast, successToast } from "./my-custom-toast"
import { useWalletDetailsProvider } from "../context/wallet-info"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { AddFinalTransaction, AddInitialTransaction, AddTransactionFailed } from "../lib/firebase-helpers"
import { network } from "../lib/utils"

const formSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  token: z.string(),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export const SendTokensForm = () => {

  const userAuth = useAuthProvider();
  const wallet = useWalletDetailsProvider()
  const { sendTransaction } = useWallet()
  const { connection } = useConnection()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      amount: "",
      token: "SOL",
      note: "",
    },
  })

  const onSubmit = async (values: FormValues) => {

    if(!userAuth?.authenticated){
      errorToast("You need to be logged in to send tokens")
      return;
    }
    // 32PnHdJiXaLZjcx3RtJin8TJYysbwGvvDcHLYDeSVmbf

    const uniqueId = crypto.randomUUID();

    const SendSol =  async ()=>{
      setIsSubmitting(true)
      try {
        const lamports = Number(values.amount) * LAMPORTS_PER_SOL;
        const fromPubkey = new PublicKey(wallet.walletAddress);
        const toPubkey = new PublicKey(values.recipient)

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports,
          }));
          
          AddInitialTransaction({
            amount: lamports.toString(),
            receiver: toPubkey.toString(),
            sender: fromPubkey.toString(),
            uniqueId,
            note: values.note
          });
        
          const { context: { slot: minContextSlot }, value: { blockhash, lastValidBlockHeight }} = await connection.getLatestBlockhashAndContext();

          const signature = await sendTransaction(transaction, connection, { minContextSlot });
          await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
          const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=${network}`;
          successToast(`${values.token} sent 🚀🚀`)
          wallet.refresh()
          console.log(explorerUrl)

          await AddFinalTransaction({uniqueId, url: explorerUrl});
          
      } catch (error) {
        const err = error as Error
        console.log(err)
        errorToast(err.message)
        await AddTransactionFailed({uniqueId})
      }
      finally{
        setIsSubmitting(false)
      }

    }


    SendSol()
    // const sendSol = async () => {
    //   setIsSubmitting(true)
    //   try {
    //     const toPubkey = new PublicKey(values.recipient);
    //   const lamports = Number(values.amount) * LAMPORTS_PER_SOL as number;
    //   const fromPubkey = new PublicKey(wallet.walletAddress)

    //   const transaction = new Transaction().add(
    //     SystemProgram.transfer({
    //       fromPubkey,
    //       toPubkey,
    //       lamports,
    //     })
    //   );

    //   await AddInitialTransaction({
    //     amount: lamports.toString(),
    //     receiver: toPubkey.toString(),
    //     sender: fromPubkey.toString(),
    //   });

    //   /* 
    //     optimize this to be very fast. It's fucking slow.
    //   */

    //   const signature = await sendTransaction(transaction, connection);
    //   const latestBlockhash = await connection.getLatestBlockhash();
    //   await connection.confirmTransaction({
    //     signature,
    //     blockhash: latestBlockhash.blockhash,
    //     lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
    //   },
    //   "confirmed");
    //   await AddFinalTransaction({
    //     amount: lamports.toString(),
    //     receiver: toPubkey.toString(),
    //     sender: fromPubkey.toString(),
    //   });
    //   const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
    //   successToast(`${values.token} sent 🚀🚀`)
    //   wallet.refresh()
    //   console.log(explorerUrl)
    //   } catch (error) {

    //   }
    //   finally{
    //     setIsSubmitting(false)
    //   }

    // }
    
    // sendSol()

    // setIsSubmitting(true)

    // SendSol({amount: 2, recipient: '8w6gHKvRHpNiBDUwH1YbpMfM2wAJk5exnqn3bvMXVonK'})
    
    
  }
    
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() =>{
        onSubmit(form.getValues())
      })} className="space-y-6">
        <FormField
          control={form.control}
          name="recipient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient</FormLabel>
              <FormControl>
                <Input placeholder="Solana address or username" {...field} />
              </FormControl>
              <FormDescription>Enter a Solana wallet address or VenSol username</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" step="0.000001" min="0" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SOL">SOL</SelectItem>
                    {/* I can add any SPL token here */}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="What's this payment for?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Tokens"
          )}
        </Button>
      </form>
    </Form>
  )
}
