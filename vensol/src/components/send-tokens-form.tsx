"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PublicKey, Transaction, SystemProgram, Connection, clusterApiUrl } from "@solana/web3.js"
import { Loader2 } from "lucide-react"
import { Button } from "./ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useAuthProvider } from "../context/auth-provider"
import { errorToast, successToast } from "./my-custom-toast"
// import { getUserName } from "../lib/firebase-helpers"
import { isUsernameOrPublicKey } from "../lib/utils"
import { SendSol } from "../lib/solana-transaction"
// import { useWallet } from "@solana/wallet-adapter-react"


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
  // const { publicKey } = useWallet();
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
    const result = isUsernameOrPublicKey(values.recipient);

    const checkIfPublicKeyIsValid = (value: string) => {
      try {
        const result = new PublicKey(value);
        console.log(result)
        return true;
      } catch (error) {
        return false
      }
    }

    if(result === 'walletAddress') {
      const result = checkIfPublicKeyIsValid(values.recipient);
      console.log(result); 
    }
    

    // const TransferSol = async (recipientAddress: string) => {
    //   try {
    //     const amount = Number.parseFloat(values.amount);
        
    //       const connection = new Connection(clusterApiUrl('devnet'))
    //       const transaction = new Transaction().add(
    //         SystemProgram.transfer({
    //           fromPubkey: new PublicKey(''),
    //           toPubkey: new PublicKey(recipientAddress),
    //           lamports: amount * 1e9, 
    //         }),
    //       )
  
    //       // Get recent blockhash
    //       const { blockhash } = await connection.getLatestBlockhash()
    //       transaction.recentBlockhash = blockhash
    //       transaction.feePayer = new PublicKey('user.walletAddress')
  
    //       // Sign and send transaction using Civic Auth
    //       // const signedTransaction = await .signTransaction(transaction)
    //       let signedTransaction: any
    //       const signature = await connection.sendRawTransaction(signedTransaction.serialize())
  
    //       // Wait for confirmation
    //       await connection.confirmTransaction(signature)

    //       successToast(`You sent ${amount} SOL to ${values.recipient}`)
  
    //       // Refresh balances
    //       // await refreshBalances()
  
    //       // Reset form
    //       form.reset()
    //   } catch (error) {
    //     console.error("Transaction error:", error)
    //       errorToast((error as Error).message || "Please try again")
    //   }
    // }

    setIsSubmitting(true)

    SendSol({amount: 2, recipient: '8w6gHKvRHpNiBDUwH1YbpMfM2wAJk5exnqn3bvMXVonK'})
    try {
      const validPublicKey = checkIfPublicKeyIsValid(values.recipient);
        if(validPublicKey) {
          //transfer the token this way
          // TransferSol(values.recipient);
        }
        else {
          
          //check db for the person with the username
          //get the wallet address of the person and append it to the transaction
          // TransferSol('');
        }
    } catch (error) {
      errorToast("Please enter a valid Solana address or registered username")
        setIsSubmitting(false)
        return
    } 
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
