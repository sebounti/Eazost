"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ShoppingBag, Key, CreditCard, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Component() {
  const router = useRouter();
  const buttons = [
    { icon: Home, label: "Logement", color: "text-blue-500 hover:text-blue-600", route: () => router.push("/dashboard/property") },
    { icon: ShoppingBag, label: "Shop Management", color: "text-orange-500 hover:text-orange-600", route: () => router.push("/dashboard/shop") },
    { icon: Key, label: "Code Access", color: "text-green-500 hover:text-green-600", route: () => router.push("/dashboard/AccessCode") },
    { icon: CreditCard, label: "Card Info", color: "text-red-500 hover:text-red-600", route: () => router.push("/dashboard/infoCard") },
    { icon: MessageCircle, label: "Messagerie", color: "text-yellow-500 hover:text-yellow-600", route: () => router.push("/dashboard/message") },
  ]

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {buttons.map((button, index) => (
          <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-0">
              <Button
                variant="ghost"
                className="w-full h-full flex flex-col items-center justify-center p-2 space-y-2"
              >
                <button.icon className={`w-12 h-12 ${button.color}`} />
                <span className={`text-lg font-medium ${button.color}`}>{button.label}</span>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
