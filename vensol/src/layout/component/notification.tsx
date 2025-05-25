import { Bell } from "lucide-react"
import { HoverCardDemo } from "../../components/hover-text"
import { Button } from "../../components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet"
import { useTransactionProvider } from "../../context/notification-provider"
import { useState } from "react"

const notifications = [
  {
    id: 1,
    title: "Transfer from",
    address: 'BX63NWWAFaiMDE7ccRTUzMivXYy2XZTHyDMi2mkGSLQs',
    description: "You received 20SOL from BX63NWWAFaiMDE7ccRTUzMivXYy2XZTHyDMi2mkGSLQs",
    time: "2 minutes ago",
    unread: true,
  },
  
]

const NotificationCard = () => {

    const shortenLength = (address: string) => {
        if(address.length < 10) return address
        return `${address.slice(0, 4)}...${address.slice(-4)}`
    }

    return(
        <div className="divide-y flex flex-col gap-2">
                  {notifications.map((notification) => {
                    return (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          notification.unread ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3
                                  className={`text-sm font-medium ${
                                    notification.unread ? "text-gray-900" : "text-gray-700"
                                  }`}
                                >
                                  {`${notification.title} ${shortenLength(notification.address)}`}
                                  {notification.unread && (
                                    <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                                  )}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                                <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
    )
}

const NotificationPanel = ({ isOpen, onClose } : {
    isOpen: boolean,
    onClose: () => void
}) => {

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="sm:max-w-md overflow-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-[20px] font-medium flex items-center gap-2"><Bell size={20}/> <span>Notifications</span></SheetTitle>
                    <SheetDescription>
                        <NotificationCard />
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
  )
}

export const Notification = () => {

    const notification = useTransactionProvider();

    const [open, setIsOpen] = useState<boolean>(false);
    return(
        <div>
            <HoverCardDemo text="Notifications">
                <Button 
                    className="cursor-pointer relative" 
                    variant="ghost" 
                    size="icon"
                    onClick={()=>setIsOpen(true)}
                >
                    <Bell />
                    {
                    notification?.numberOfNotifications && <span className="absolute top-0 right-1.5">{notification?.numberOfNotifications}</span>
                    }
                </Button>
            </HoverCardDemo>
            <NotificationPanel isOpen={open} onClose={()=>{setIsOpen(false)}}/>
        </div>
    )
}