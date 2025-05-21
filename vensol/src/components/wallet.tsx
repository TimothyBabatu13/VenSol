
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { formatAddress } from "../lib/utils";
import { Copy, RefreshCw } from "lucide-react";
import { successToast } from "./my-custom-toast";
import { Button } from "./ui/button";
import { useWalletDetailsProvider } from "../context/wallet-info";

export const WalletComponent = ({ walletAddress, walletBalance } : {
    walletAddress: string,
    walletBalance: number
}) => {

    const wallet = useWalletDetailsProvider();

    const handleRefresh = () => {
        wallet.refresh();
        successToast('Wallet refreshed 🚀')
    }

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
                            // src={user?.user?.picture}
                            draggable={false}
                        />
                        <AvatarFallback>
                            {/* {user.user?.username ? user.user?.username.substring(0, 2).toUpperCase() : "WA"} */}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{false || "Wallet Owner"}</p>
                        <p className="text-xs text-muted-foreground">
                            {walletAddress ? <span className="flex w-full items-center">
                                {formatAddress(walletAddress)}
                                <Copy 
                                    className="ml-5 cursor-pointer" 
                                    size={12}
                                    onClick={() => {
                                        navigator.clipboard.writeText(walletAddress);
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
                        <p className="font-medium">{walletBalance?.toFixed(4)} SOL</p>
                    </div>
                    {/* {Object.entries(user.tokenBalances).map(([token, balance]) => (
                    <div key={token} className="flex justify-between">
                    <p className="text-sm text-muted-foreground">{token}</p>
                    <p className="font-medium">{balance}</p>
                    </div>
                    ))} */}
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