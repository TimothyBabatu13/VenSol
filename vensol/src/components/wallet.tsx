
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { formatAddress } from "../lib/utils";
import { Copy, RefreshCw } from "lucide-react";
import { successToast } from "./my-custom-toast";
import { Button } from "./ui/button";
import { useWalletDetailsProvider } from "../context/wallet-info";
import { useEffect, useState } from "react";
import { createAccount, getUserDetails, type userType } from "../lib/firebase-helpers";
import { useAuthProvider } from "../context/auth-provider";

export const WalletComponent = () => {

    const wallet = useWalletDetailsProvider();
    const auth = useAuthProvider();
    const [user, setUser] = useState<userType>()

    const handleRefresh = () => {
        wallet.refresh();
        successToast('Wallet refreshed 🚀')
    }

    const getUser = async ({ wallet } : {
        wallet: string
      }) => {
        await getUserDetails({
          userWallet: wallet,
          callBack: (e)=>{
            const data = e[0];
            setUser(data)
          }
        })
      }
    
      useEffect(()=>{

        if(!wallet.walletAddress) return
        getUser({wallet: wallet.walletAddress});

      }, [wallet.walletAddress])


      useEffect(()=>{
        if(wallet.walletAddress.trim()){
            if(!auth?.authenticated){
              return;
            }
      
            if(wallet.walletAddress) {
              createAccount({
                userWallet: wallet.walletAddress
              })
            }
          }
          
        },[wallet.walletAddress, auth?.authenticated])

    return(
        <Card>
            <CardHeader className="pb-3">
                <CardTitle>Wallet</CardTitle>
                <CardDescription>Your Solana wallet details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage 
                            src={user?.profileURL}
                            draggable={false}
                        />
                        <AvatarFallback>
                            {user?.username ? user.username.substring(0, 2).toUpperCase() : "WA"}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{user?.username || "Wallet Owner"}</p>
                        <p className="text-xs text-muted-foreground">
                            {wallet.walletAddress ? <span className="flex w-full items-center">
                                {formatAddress(wallet.walletAddress)}
                                <Copy 
                                    className="ml-5 cursor-pointer" 
                                    size={12}
                                    onClick={() => {
                                        navigator.clipboard.writeText(wallet.walletAddress);
                                        successToast('Wallet address copied')
                                    }}
                                />
                              </span>
                               : "No wallet connected"}
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <p className="text-sm text-muted-foreground">SOL Balance</p>
                        <p className="font-medium">{wallet.walletBalance?.toFixed(4)} SOL</p>
                    </div>
                </div>
                </CardContent>
                <CardFooter>
                    <Button 
                        variant="outline" 
                        className="w-full cursor-pointer"
                        onClick={handleRefresh}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Balances
                    </Button>
                </CardFooter>
        </Card>
    )
}