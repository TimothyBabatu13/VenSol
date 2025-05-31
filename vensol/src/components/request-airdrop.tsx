import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "./ui/button"
import { useState } from "react"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { useWalletDetailsProvider } from "../context/wallet-info"
import { errorToast, successToast } from "./my-custom-toast"
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

const formSchema = z.object({
  title: z.string().min(1, "The amount of SOL is required"),
})
type FormValues = z.infer<typeof formSchema>

const RequestAirdrop = () => {

    const { width, height } = useWindowSize()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showConfetti, setIsShowConfetti] = useState(false);

    const { connection } = useConnection()
    const { publicKey } = useWallet();
    const wallet = useWalletDetailsProvider();

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
        }
      })

      const onSubmit = async (values : FormValues) => {
        setIsSubmitting(true)

        try {
            const amount = parseInt(values.title)
            const signature = await connection.requestAirdrop(new PublicKey(publicKey!), amount * LAMPORTS_PER_SOL )
            await connection.confirmTransaction(signature, "confirmed")
            successToast(`Airdop gotten.`)
            wallet.refresh();
            setIsShowConfetti(true);
        } catch (error) {
            console.log(error)
            const err = error as Error;
            errorToast(err.message);
        }
        finally{
            setIsSubmitting(false)
        }
      }

  return (
    <Form {...form}>
        {
          showConfetti && <Confetti
            width={width}
            height={height}
        />
        }
        <form onSubmit={form.handleSubmit(()=>onSubmit(form.getValues()))} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">Amount of SOL</FormLabel>
                <FormControl>
                  <Input placeholder="Amount of SOL you want to be airdropped" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting ? (
                <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
            ): (
                <div>Request for airdrop</div>
            )}
        </Button>
    </form>
</Form>
)
}

export default RequestAirdrop