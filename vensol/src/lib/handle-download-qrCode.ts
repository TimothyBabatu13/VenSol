import { successToast } from "../components/my-custom-toast";

export const handleDownloadImage = (id: string) : void => {
    const canva = document.querySelector(id) as HTMLCanvasElement;
    canva.toBlob((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob!);
      link.download = 'request token'
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      successToast('QR code downloaded succesfully')
      URL.revokeObjectURL(link.href)
    }, 'image/png', 100)
}