import { notFound } from 'next/navigation'
import { createServerClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { PostCard } from '@/components/post-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createServerClient()

  // Get category
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) {
    notFound()
  }

  // Get posts in this category
  const { data: posts } = await supabase
    .from('posts')
    .select(
      `
      *,
      profiles (
        id,
        username,
        full_name,
        avatar_url,
        role
      ),
      categories (
        id,
        name,
        slug
      )
    `
    )
    .eq('category_id', category.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <Link href="/categories">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground text-lg">
              {category.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {posts?.length || 0} posts
          </p>
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No posts in this category yet.
            </p>
            <Link href="/create-post">
              <Button>Create First Post</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
