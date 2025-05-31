import {  useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { errorToast, successToast } from "./my-custom-toast"
import { useAuthProvider } from "../context/auth-provider"
import { useWalletDetailsProvider } from "../context/wallet-info"
import QRCode from "./qr-code"
import { QrCodeData, type qrCodeData } from "../lib/firebase-helpers"

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  token: z.string(),
  note: z.string().optional(),
})



export const RequestTokensForm = () => {
  
  const auth = useAuthProvider();
  const { walletAddress } = useWalletDetailsProvider();

  const [qrData, setQrData] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      token: "SOL",
      note: "",
    },
  })

  const onSubmit = async (values: {
    amount: string,
    token: string,
    note?: string
  }) => {
 
    if(!auth?.authenticated) {
      errorToast('You need to be logged in to send tokens');
      return;
    }

    if(!walletAddress) {
      errorToast('You need to be logged in to send tokens');
      return;
    }
 
    const paymentData: qrCodeData = {
      action: "request",
      recipient: walletAddress,
      amount: values.amount,
      // token: values.token,
      note: values.note || "",
    }

    const result = await QrCodeData(paymentData);

    setQrData(`https://vensol.vercel.app/send-token?data=${result}`)
    successToast('QR code generated')

  }


  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(()=>onSubmit(form.getValues()))} className="space-y-6">
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
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note (optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="What's this request for?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full cursor-pointer">
            Generate QR Code
          </Button>
        </form>
      </Form>

      {qrData && (
        <QRCode qrData={qrData}/>
      )}
    </div>
  )
}
