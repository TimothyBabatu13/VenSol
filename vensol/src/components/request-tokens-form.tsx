import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
// import QRCode from "qrcode.react"
import { Copy } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { useAuthProvider } from "../context/auth-provider"
import { toast } from 'sonner'
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  token: z.string().default("SOL"),
  note: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export function RequestTokensForm() {
  const userAuth = useAuthProvider();
  
  const [qrData, setQrData] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
      token: "SOL",
      note: "",
    },
  })

  // const onSubmit = (values: FormValues) => {
  //   if (!user?.walletAddress) {
  //     return
  //   }

  //   // Create payment request data
  //   const paymentData = {
  //     action: "request",
  //     recipient: user.walletAddress,
  //     amount: values.amount,
  //     token: values.token,
  //     note: values.note || "",
  //   }

  //   // Convert to JSON string and encode for QR code
  //   const qrCodeData = JSON.stringify(paymentData)
  //   setQrData(qrCodeData)
  // }

  const copyToClipboard = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData)
      toast("Payment request data copied to clipboard")
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() =>{

        })} className="space-y-6">
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

          <Button type="submit" className="w-full">
            Generate QR Code
          </Button>
        </form>
      </Form>

      {qrData && (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg">
              {/* <QRCode value={qrData} size={200} /> */}
            </div>
            <p className="mt-4 text-sm text-center text-muted-foreground">Scan this QR code to send payment</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Payment Data
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
