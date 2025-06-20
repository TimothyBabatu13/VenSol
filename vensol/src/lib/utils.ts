import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { errorToast } from "../components/my-custom-toast"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const network = WalletAdapterNetwork.Devnet


export function formatAddress(address: string): string {
  if (!address) return ""
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }

  return date.toLocaleDateString()
}

export const isUsernameOrPublicKey = (value: string) : ('username' | 'walletAddress' | undefined) => {
  if(!value.trim()) {
    errorToast('Please provide a valid username or wallet address');
    return;
  }
  console.log(value.length)
  if(value.length <= 14){
    return 'username';
  }
  return 'walletAddress';

}

export const uploadImageToCloudinary = async (file: File) => {
  
  const CLOUD_NAME: string = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME!
  const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_CLOUD_UPLOAD_PRESET!
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,{
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  const url = data.url
  return url as string

}