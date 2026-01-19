import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/actions/auth'
import { getPostForEdit } from '@/lib/actions/create-post'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { EditPostForm } from '@/components/edit-post-form'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const userData = await getCurrentUser()

  if (!userData) {
    redirect('/login')
  }

  const result = await getPostForEdit(id)

  if ('error' in result) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
          <EditPostForm post={result.post} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
