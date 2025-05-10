import { CheckCircle2, LucideAlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const errorToast = (text: string) => {
  toast(text, {
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center',
      cursor: 'grabbing'
    },
    icon: <LucideAlertTriangle />,
  });
}

export const successToast = (text: string) => {
  toast(text, {
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center',
      cursor: 'grabbing',
      border: '0px'
    },
    icon: <CheckCircle2 />
  })
}