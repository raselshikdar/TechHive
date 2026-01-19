import { PostForm } from '@/components/post-form'
import { getCategories } from '@/lib/actions/posts'
import { getCurrentUser } from '@/lib/actions/auth'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { redirect } from 'next/navigation'

export default async function CreatePostPage() {
  const userData = await getCurrentUser()
  
  if (!userData) {
    redirect('/login?redirectTo=/create-post')
  }

  // Check if user can create posts
  const allowedRoles = ['user', 'contributor', 'author', 'moderator', 'admin']
  if (!allowedRoles.includes(userData.profile.role)) {
    redirect('/')
  }

  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
          <p className="text-muted-foreground">
            Share your knowledge with the TrickBD community
          </p>
        </div>

        <PostForm categories={categories} />
      </div>
      <Footer />
    </div>
  )
}
