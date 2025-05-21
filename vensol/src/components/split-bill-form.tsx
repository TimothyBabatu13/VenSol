"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { errorToast } from "./my-custom-toast"
import { useWalletDetailsProvider } from "../context/wallet-info"
import QRCode from "./qr-code"


const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  totalAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  token: z.string(),
  numberOfPeople: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 2 && Number(val) <= 20, {
    message: "Number of people must be between 2 and 20",
  }),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export const SplitBillForm = () => {
  
  const { walletAddress } = useWalletDetailsProvider();
  const [qrData, setQrData] = useState<string | null>(null);
  

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      totalAmount: "",
      token: "SOL",
      numberOfPeople: "2",
      note: "",
    }
  })

  const onSubmit = (values: FormValues) => {  

    const totalAmount = Number.parseFloat(values.totalAmount);
    const numberOfPeople = Number.parseInt(values.numberOfPeople);
    const amountPerPerson = totalAmount / numberOfPeople;

    const recipient = walletAddress;
    if(!recipient) {
      errorToast('You need to be logged in to generate QR codes')
      return;
    }
    const splitBillData = {
      action: "splitBill",
      recipient,
      title: values.title,
      totalAmount: totalAmount.toString(),
      amountPerPerson: amountPerPerson.toString(),
      token: values.token,
      numberOfPeople,
      note: values.note || "",
    }

    const qrCodeData = JSON.stringify(splitBillData)
    
    const hashData = encodeURIComponent(qrCodeData);
    const link = `http://localhost:5173/send-token?data=${hashData}`

    setQrData(link)

  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(()=>onSubmit(form.getValues()))} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Title</FormLabel>
                <FormControl>
                  <Input placeholder="Dinner at Restaurant" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="totalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Amount</FormLabel>
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
                      {/* Add SPL tokens here */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="numberOfPeople"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of People</FormLabel>
                <FormControl>
                  <Input type="number" min="2" max="20" {...field} />
                </FormControl>
                <FormDescription>How many people are splitting this bill (including you)?</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note (optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Additional details about this bill" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full cursor-pointer">
            Generate Split Bill QR
          </Button>
        </form>
      </Form>

      {qrData && (
        <QRCode qrData={qrData}/>
      )}
    </div>
  )
}
