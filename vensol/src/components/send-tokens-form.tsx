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

const formSchema = z.object({
  recipient: z.string().min(1, "Recipient is required"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  token: z.string().default("SOL"),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function SendTokensForm() {
    const userAuth = useAuthProvider(); 
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

//   const onSubmit = async (values: FormValues) => {
//     if (!user?.walletAddress) {
//       toast({
//         title: "Error",
//         description: "You need to be logged in to send tokens",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsSubmitting(true)

//     try {
//       // Check if recipient is a valid Solana address
//       let recipientAddress: string

//       try {
//         // Check if it's a valid public key
//         new PublicKey(values.recipient)
//         recipientAddress = values.recipient
//       } catch (error) {
//         // If not a valid public key, assume it's a username
//         // In a real app, you would query your backend to resolve the username to an address
//         toast({
//           title: "Username not found",
//           description: "Please enter a valid Solana address or registered username",
//           variant: "destructive",
//         })
//         setIsSubmitting(false)
//         return
//       }

//       const amount = Number.parseFloat(values.amount)

//       if (values.token === "SOL") {
//         // Create a Solana connection
//         const connection = new Connection(clusterApiUrl("mainnet-beta"))

//         // Create a transaction
//         const transaction = new Transaction().add(
//           SystemProgram.transfer({
//             fromPubkey: new PublicKey(user.walletAddress),
//             toPubkey: new PublicKey(recipientAddress),
//             lamports: amount * 1e9, // Convert SOL to lamports
//           }),
//         )

//         // Get recent blockhash
//         const { blockhash } = await connection.getLatestBlockhash()
//         transaction.recentBlockhash = blockhash
//         transaction.feePayer = new PublicKey(user.walletAddress)

//         // Sign and send transaction using Civic Auth
//         const signedTransaction = await civicAuth.signTransaction(transaction)
//         const signature = await connection.sendRawTransaction(signedTransaction.serialize())

//         // Wait for confirmation
//         await connection.confirmTransaction(signature)

//         // Store transaction details (in a real app, you would store this in your backend)
//         // For this demo, we're just showing a success message

//         toast({
//           title: "Transaction successful",
//           description: `You sent ${amount} SOL to ${values.recipient}`,
//         })

//         // Refresh balances
//         await refreshBalances()

//         // Reset form
//         form.reset()
//       } else {
//         // For SPL tokens, you would use the Token Program
//         // This is more complex and requires additional libraries
//         toast({
//           title: "Not implemented",
//           description: "SPL token transfers are not implemented in this demo",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       console.error("Transaction error:", error)
//       toast({
//         title: "Transaction failed",
//         description: (error as Error).message || "Please try again",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() =>{
        console.log('')
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
              <FormDescription>Enter a Solana wallet address or ZeroPay username</FormDescription>
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
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
