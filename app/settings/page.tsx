import { getCurrentUser } from '@/lib/actions/auth'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { SettingsForm } from '@/components/settings-form'

export default async function SettingsPage() {
  const userData = await getCurrentUser()

  if (!userData) {
    redirect('/login?redirectTo=/settings')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and profile
          </p>
        </div>

        <SettingsForm profile={userData.profile} />
      </main>
    </div>
  )
}
