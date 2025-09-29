import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to GraceCRM
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Multi-tenant church management system with Grace AI assistant
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Learn More</Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Church Management</CardTitle>
              <CardDescription>
                Comprehensive member management with Kanban workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track members, manage follow-ups, and organize your community with powerful CRM tools.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Grace AI Assistant</CardTitle>
              <CardDescription>
                Intelligent voice and text interactions for churches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Handle calls, schedule appointments, and provide 24/7 support with AI-powered Grace.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Multi-Tenant Architecture</CardTitle>
              <CardDescription>
                Secure, isolated environments for each church
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Enterprise-grade security with complete data isolation between churches.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}