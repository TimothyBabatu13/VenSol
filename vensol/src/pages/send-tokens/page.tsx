import { useLocation } from "react-router-dom";
import SendToken from "../../components/request-send-token";
import { useEffect, useState } from "react";
import { ReadQrCodeData, type qrCodeData } from "../../lib/firebase-helpers";
import { Toaster } from "../../components/ui/sonner";

export const Page = () => {
    
    const location = useLocation();
    const uniqueId = location.search.split('?data=')[1];

    const [data, setData] = useState<qrCodeData>();

    useEffect(() =>{
      ReadQrCodeData({
        id: uniqueId,
        callBack: (e) =>{
          setData(e as qrCodeData);
        }
      })
    }, [])
  return (
    <div className="space-y-6">
      <SendToken data={data!} />
      <Toaster />
    </div>
  )
}