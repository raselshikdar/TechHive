import { searchPosts } from '@/lib/actions/posts'
import { Header } from '@/components/header'
import { PostCard } from '@/components/post-card'
import { Search } from 'lucide-react'
import { Suspense } from 'react'
import Loading from './loading'

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const results = query ? await searchPosts(query) : []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          {query && (
            <p className="text-muted-foreground">
              Found {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
            </p>
          )}
        </div>

        <Suspense fallback={<Loading />}>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No results found</h2>
              <p className="text-muted-foreground">
                Try different keywords or browse our categories
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Search for posts</h2>
              <p className="text-muted-foreground">
                Enter a search query to find posts
              </p>
            </div>
          )}
        </Suspense>
      </main>
    </div>
  )
}
