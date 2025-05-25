import { Bell } from "lucide-react"
import { HoverCardDemo } from "../../components/hover-text"
import { Button } from "../../components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../../components/ui/sheet"
import { useTransactionProvider } from "../../context/notification-provider"
import { useState } from "react"
import { formatDate } from "../../lib/utils"

const NotificationCard = () => {

    const data = useTransactionProvider();

    if(data?.headerNotification.length === 0) return <div>No notification</div>

    return(
        <div className="divide-y flex flex-col gap-2">
                  {data?.headerNotification.map((notification) => {
                    return (
                      <div
                        key={crypto.randomUUID()}
                        className={`p-4 hover:bg-gray-50 transition-colors ${
                          notification.seen ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3
                                  className={`text-sm font-medium ${
                                    notification.seen ? "text-gray-900" : "text-gray-700"
                                  }`}
                                >
                                  {`${notification.title}`}
                                  {notification.seen && (
                                    <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                                  )}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                                <p className="text-xs text-gray-500 mt-2">{formatDate(notification.time)}</p>
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