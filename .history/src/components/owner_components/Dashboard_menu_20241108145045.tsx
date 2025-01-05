import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ShoppingBag, Key, CreditCard, MessageCircle } from "lucide-react"

export default function Component() {
  const buttons = [
    { icon: Home, label: "Logement", color: "text-blue-500" },
    { icon: ShoppingBag, label: "Shop Management", color: "text-orange-500" },
    { icon: Key, label: "Code Access", color: "text-green-500" },
    { icon: CreditCard, label: "Card Info", color: "text-red-500" },
    { icon: MessageCircle, label: "Messagerie", color: "text-yellow-500" },
  ]

  return (
    <div className="container mx-auto p-4 bg-slate-50">
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
