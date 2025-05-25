import { Button } from "./ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card"

export const HoverCardDemo = ({ children, text } : {
    children: React.ReactNode,
    text: string
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button asChild variant="link">{children}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <div className="flex justify-between space-x-4 text-sm text-muted-foreground">
            {text}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
