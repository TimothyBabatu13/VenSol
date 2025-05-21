import { QRCodeCanvas } from "qrcode.react"
import { Card, CardContent } from "./ui/card"
import { Copy, Download, Share } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"
import { handleDownloadImage } from "../lib/handle-download-qrCode"
import { successToast } from "./my-custom-toast"

const QRCode = ({ qrData } : {
    qrData: string
}) => {

    const [isCanvaHovered, setIsCanvaHovered] = useState<boolean>(false);

    const handleDownloadImages = () => {
        handleDownloadImage('#generate-qrCode');
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

  return (
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
  )
}

export default QRCode