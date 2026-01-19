import { getPosts, getCategories, getFeaturedPost, getHotPosts } from '@/lib/actions/posts'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { PostCard } from '@/components/post-card'
import { FeaturedPostCard } from '@/components/featured-post-card'
import { CategoryFilter } from '@/components/category-filter'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, Flame } from 'lucide-react'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>
}) {
  const params = await searchParams
  const page = Number.parseInt(params.page || '1', 10)
  
  const [featuredPost, hotPosts, recentPosts, categories] = await Promise.all([
    getFeaturedPost(),
    getHotPosts(4),
    getPosts(page, 15, params.category),
    getCategories()
  ])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 mb-8 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-balance">
            Welcome to TechHive
          </h1>
          <p className="text-lg md:text-xl mb-6 text-blue-100 text-pretty">
            Your ultimate tech community hub. Share knowledge, discover innovations, and connect with tech enthusiasts.
          </p>
          <Link href="/create-post">
            <Button size="lg" variant="secondary" className="gap-2">
              <PlusCircle className="h-5 w-5" />
              Create Post
            </Button>
          </Link>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              Featured Post
            </h2>
            <FeaturedPostCard post={featuredPost} />
          </section>
        )}

        {/* Hot Posts */}
        {hotPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Flame className="h-6 w-6 text-orange-500" />
              Hot Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hotPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {recentPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No posts found. Be the first to create one!</p>
            </div>
          )}

          {/* Pagination */}
          {recentPosts.length === 15 && (
            <div className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <Link href={`/?page=${page - 1}${params.category ? `&category=${params.category}` : ''}`}>
                  <Button variant="outline">Previous</Button>
                </Link>
              )}
              <Link href={`/?page=${page + 1}${params.category ? `&category=${params.category}` : ''}`}>
                <Button variant="outline">Next</Button>
              </Link>
            </div>
          )}
        </section>

        {/* Categories Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
          <CategoryFilter categories={categories} />
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
