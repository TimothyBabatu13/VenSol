import { useLocation } from "react-router-dom";
import SendToken from "../../components/request-send-token";
import { useEffect, useState } from "react";
import { ReadQrCodeData, type qrCodeData } from "../../lib/firebase-helpers";
import { Toaster } from "../../components/ui/sonner";
import MultipleTokenForm from "../../components/multiple-tokens-form";

export const Page = () => {
    
    const location = useLocation();
    const uniqueId = location.search.split('?data=')[1];

    const [data, setData] = useState<qrCodeData>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() =>{
      ReadQrCodeData({
        id: uniqueId,
        callBack: (e) =>{
          setData(e as qrCodeData);
          setIsLoading(false);
        }
      })
    }, [])

    if(isLoading) return <div className="w-16 h-16 mx-auto rounded-full border-4 border-solid border-gray-200 border-t-black animate-spin" />


  return (
    <div className="space-y-6">
      {
        data?.action === 'request' ? (<SendToken data={data!} />) : (<MultipleTokenForm data={data!} />) 
      }
      <Toaster />
    </div>
  )
}