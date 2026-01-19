import { getBookmarkedPosts } from '@/lib/actions/posts'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'

export default async function BookmarksPage() {
  const posts = await getBookmarkedPosts()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Bookmarks</h1>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            No bookmarks yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
