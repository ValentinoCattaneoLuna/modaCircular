import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { MessageCircle } from "lucide-react"

export default function ChatsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chats</h1>
          <p className="text-gray-600">Conversaciones con otros usuarios</p>
        </div>

        <Card className="max-w-md mx-auto border-0 shadow-xl bg-white ">
          <CardContent className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <MessageCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Función en desarrollo</h3>
            <p className="text-gray-600">
              El sistema de chat interno estará disponible en una próxima versión. Por ahora, puedes contactar a los
              usuarios a través de WhatsApp.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
