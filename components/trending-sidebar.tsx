import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Eye } from 'lucide-react'
import Image from 'next/image'

export async function TrendingSidebar() {
  const supabase = await createServerClient()

  // Get trending posts (most views in last 7 days)
  const { data: trendingPosts } = await supabase
    .from('posts')
    .select(
      `
      id,
      title,
      slug,
      thumbnail_url,
      view_count,
      like_count,
      profiles (username, avatar_url)
    `
    )
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .limit(5)

  // Get popular categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, post_count')
    .order('post_count', { ascending: false })
    .limit(8)

  return (
    <div className="space-y-6">
      {/* Trending Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Trending Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingPosts && trendingPosts.length > 0 ? (
            trendingPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/post/${post.slug}`}
                className="flex gap-3 group"
              >
                <span className="text-2xl font-bold text-muted-foreground">
                  {index + 1}
                </span>
                {post.thumbnail_url && (
                  <Image
                    src={post.thumbnail_url || "/placeholder.svg"}
                    alt={post.title}
                    width={60}
                    height={60}
                    className="rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span>{post.view_count.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No trending posts yet</p>
          )}
        </CardContent>
      </Card>

      {/* Popular Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <Badge variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                    {category.name} ({category.post_count})
                  </Badge>
                </Link>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No categories yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-bold mb-2">Share Your Knowledge</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Join thousands of contributors and share your tech tricks with the community.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full"
          >
            Get Started
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
