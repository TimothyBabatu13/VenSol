import {  useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { QRCodeCanvas } from 'qrcode.react'
import { Copy, Download, Share } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { useAuthProvider } from "../context/auth-provider"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { UseWallet } from "../lib/use-wallet"
import { errorToast, successToast } from "./my-custom-toast"
import { handleDownloadImage } from "../lib/handle-download-qrCode"

const formSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Amount must be a positive number",
  }),
  token: z.string(),
  note: z.string().optional(),
})



export const RequestTokensForm = () => {
  const userAuth = useAuthProvider();
  const { getWalletAddress } = UseWallet();

  const [qrData, setQrData] = useState<string | null>(null)
  const [isCanvaHovered, setIsCanvaHovered] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: '',
      token: "SOL",
      note: "",
    },
  })

  const onSubmit = (values: {
    amount: string,
    token: string,
    note?: string
  }) => {
        
    if(!userAuth?.authenticated) {
      errorToast('You need to be logged in to send tokens');
      return;
    }
    const walletAddress = getWalletAddress();
    if(!walletAddress) {
      errorToast('You need to be logged in to send tokens');
      return;
    }
 
    const paymentData = {
      action: "request",
      recipient: walletAddress,
      amount: values.amount,
      token: values.token,
      note: values.note || "",
    }

    const encodedParams = encodeURIComponent(JSON.stringify(paymentData))
    console.log(encodedParams);

    const url = `http://localhost:5173/send-token?data=${encodedParams}`

    setQrData(url)
    successToast('QR code generated')
  }
  

  const copyToClipboard = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData)
      successToast("Payment request data copied to clipboard")
    }
  }

  const ShareQRCode = async () => {
    if(qrData) {

        await navigator.share({
          text: qrData,
          title: 'Request for token'
        })
      }
    }
  
    const handleDownloadImages = () => {
      handleDownloadImage('#generate-qrCode');
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
        <Card>
          <CardContent className="pt-6 flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg relative">
              <QRCodeCanvas 
                id="generate-qrCode" 
                value={qrData} 
                className={`max-h-[200px] max-w-[200px] cursor-pointer size-[100%] ${isCanvaHovered && 'blur-sm'}`} 
                draggable={false} 
                size={200} 
                onMouseEnter={()=>{setIsCanvaHovered(true)}}
                onMouseLeave={()=>{setIsCanvaHovered(false)}}
              />
              {
                isCanvaHovered && 
                <Download 
                  className="cursor-pointer absolute top-2.5 right-2.5" 
                  onMouseEnter={()=>{setIsCanvaHovered(true)}}
                  onMouseLeave={()=>{setIsCanvaHovered(false)}}
                  onClick={handleDownloadImages}
                />
              }
            </div>
            <p className="mt-4 text-sm text-center text-muted-foreground">Scan this QR code to send payment</p>
            <div className="text-center gap-2 grid-cols-1 grid sm:grid-cols-3 md:grid-cols-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 cursor-pointer" 
                onClick={copyToClipboard}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Payment Data
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 cursor-pointer" 
                onClick={ShareQRCode}
              >
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                size={'sm'}
                className="cursor-pointer mt-2 md:hidden"
                variant={"outline"}
                onClick={handleDownloadImages}
              >
                <Download className="mr-2 h-4 w-4"/>
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
