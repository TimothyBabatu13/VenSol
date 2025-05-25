import { CheckCircle2, LucideAlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const errorToast = (text: string) => {
  toast(text, {
    style: {
      background: 'oklab(0.994745 0 0)',
      color: 'red',
      textAlign: 'center',
      cursor: 'grabbing',
      border: '0px',
      gap: '0'
    },
    icon: <LucideAlertTriangle size={16} color="red" />,
  });
}

export const successToast = (text: string) => {
  toast(text, {
    style: {
      background: 'oklab(0.994745 0 0)',
      color: 'black',
      textAlign: 'center',
      cursor: 'grabbing',
      border: '0px',
      gap:'0'
    },
    icon: <CheckCircle2 size={16} />
  })
}