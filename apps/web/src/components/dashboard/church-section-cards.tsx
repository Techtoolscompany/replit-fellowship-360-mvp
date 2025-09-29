'use client'

import { TrendingUp, TrendingDown, Users, UserPlus, MessageCircle, Phone } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function ChurchSectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Members</CardDescription>
            <Badge variant="outline">
              <TrendingUp />
              +12.5%
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            234
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Growing congregation <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            New members this month
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>This Week's Visitors</CardDescription>
            <Badge variant="outline">
              <TrendingUp />
              +2
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            8
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            More visitors this week <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Follow-up needed
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Grace Interactions</CardDescription>
            <Badge variant="outline">
              <TrendingUp />
              +15
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            47
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Active AI assistance <MessageCircle className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Yesterday's interactions
          </div>
        </CardFooter>
      </Card>
      
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Follow-ups Pending</CardDescription>
            <Badge variant="outline">
              <Phone />
              3 due today
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Outreach opportunities <Phone className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Requires attention
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
