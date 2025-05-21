import { useEffect, useRef, useState, type ChangeEvent } from "react"
import { AtSign, Calendar, Camera, FileText, User, Wallet } from "lucide-react"

import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet"
import { Label } from "../../components/ui/label"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { getUserDetails, uploadImage, type userType } from "../../lib/firebase-helpers"
import { useWalletDetailsProvider } from "../../context/wallet-info"

interface user extends userType {
    previewURL: string,
    image: File | undefined
}

const ProfilePanel = ({isOpen, onClose, userDetails}: {
    isOpen: boolean,
    userDetails: userType,
    onClose: () => void
    
}) => {

    const [saving, setIsSaving] = useState(false);
    const [editableUserDetails, setEditableUsersDetail] = useState<user>({
        bio: userDetails.bio,
        profileURL: userDetails.profileURL,
        username: userDetails.username,
        walletAddress: userDetails.walletAddress,
        previewURL: '',
        image: undefined
    })

    const fileInputRef = useRef<HTMLInputElement>(null)


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setEditableUsersDetail(prev => ({
            ...prev,
            previewURL: result,
            image: file
        }))
      }
      reader.readAsDataURL(file)
    }
    console.log(file)
  }

  const handleSave = async () => {
    setIsSaving(true);

    try {
        const result = await uploadImage({
            walletAddress: userDetails.walletAddress,
            file: editableUserDetails.image!,
            bio: editableUserDetails.bio,
            username: editableUserDetails.username
        })
        console.log(result)
    } catch (error) {
        console.log(error as string)
    }
    finally {
        setIsSaving(false)
    }
  }

  const handleUserDetailsChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditableUsersDetail(prev => ({
        ...prev,
        [name]: value
    }))
  }

    return(
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-md overflow-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-2xl">Your Profile</SheetTitle>
                    <SheetDescription>Update your profile information and save your changes.</SheetDescription>
                </SheetHeader>
                <div className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                                <AvatarImage 
                                    src={editableUserDetails.previewURL ?  editableUserDetails.previewURL : editableUserDetails.profileURL} 
                                    alt={`${editableUserDetails.username} image`} 
                                />
                                <AvatarFallback 
                                    className="text-lg">{editableUserDetails.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                            <input 
                                ref={fileInputRef} 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageChange} 
                            />
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar 
                                className="h-3 w-3" 
                            /> 
                            Joined {editableUserDetails.profileURL}
                        </p>
                    </div>
                    <div className="space-y-4 mx-3">
                        <div className="space-y-2">
                            <Label 
                                htmlFor="username" 
                                className="flex items-center gap-2"
                            >
                                <AtSign 
                                    className="h-4 w-4" 
                                /> 
                                Username
                            </Label>
                            <Input 
                                id="username" 
                                name="username" 
                                value={editableUserDetails.username} 
                                onChange={handleUserDetailsChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Wallet className="h-4 w-4" /> 
                                Wallet Address
                            </Label>
                            <Input 
                                id="wallet-address" 
                                name="walletAddress" 
                                value={userDetails.walletAddress} 
                                disabled 
                                className="bg-muted" 
                            />
                            <p 
                                className="text-xs text-muted-foreground"
                            >
                                Wallet Address cannot be changed
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" /> Bio
                            </Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={editableUserDetails.bio}
                                onChange={handleUserDetailsChange}
                                className="min-h-[100px] resize-none"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-8 mx-3 pb-3 flex justify-end space-x-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button 
                        onClick={handleSave}
                        className="cursor-pointer"
                        disabled={saving}
                    >
                        {
                            saving ? '' : 'Save Changes'
                        }
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export function UserProfile() {
    
    const [isOpen, setIsOpen] = useState(false);
    const [userDetail, setUserDetail] = useState<userType>({
        profileURL: '',
        username:'',
        walletAddress:'',
        bio: ''
    });
    const userDetails = useWalletDetailsProvider();
    
    useEffect(()=>{
        if(userDetails.walletAddress){
            getUserDetails({userWallet: userDetails.walletAddress, callBack: (user)=>{
            setUserDetail(user[0]);
        }});
    }
  }, [userDetails.walletAddress])
  return (
    <div className="relative">
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer h-full w-full shadow-sm hover:shadow-md transition-all"
          onClick={() => setIsOpen(true)}
        >
          {userDetail && userDetail.profileURL ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={userDetail.profileURL} alt={'profile.username'} />
              <AvatarFallback>{userDetail.walletAddress.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          ) : (
            <User className="h-5 w-5 text-slate-600" />
          )}
        </Button>
      </div>

      <ProfilePanel isOpen={isOpen} userDetails={userDetail} onClose={() => setIsOpen(false)}  />
    </div>
  )
}
