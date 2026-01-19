import { getSupabaseServerClient } from '@/lib/supabase/server'
import { Header } from '@/components/header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function AuthorsPage() {
  const supabase = await getSupabaseServerClient()

  const { data: authors } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['author', 'moderator', 'admin'])
    .order('posts_count', { ascending: false })

  const roleColors: Record<string, string> = {
    admin: 'bg-red-600',
    moderator: 'bg-orange-600',
    author: 'bg-blue-600',
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Authors</h1>
          <p className="text-muted-foreground">
            Meet the talented writers of TrickBD
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {authors?.map((author) => {
            const initials = author.full_name
              ?.split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase() || 'U'

            return (
              <Link key={author.id} href={`/profile/${author.username}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarImage src={author.avatar_url || "/placeholder.svg"} alt={author.full_name} />
                        <AvatarFallback className="text-xl">{initials}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-bold text-lg mb-1">{author.full_name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">@{author.username}</p>
                      <Badge className={`mb-3 ${roleColors[author.role] || 'bg-gray-600'}`}>
                        {author.role}
                      </Badge>
                      {author.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {author.bio}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="font-bold">{author.posts_count || 0}</span>
                          <span className="text-muted-foreground ml-1">Posts</span>
                        </div>
                        <div>
                          <span className="font-bold">{author.comments_count || 0}</span>
                          <span className="text-muted-foreground ml-1">Comments</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {!authors || authors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No authors found</p>
          </div>
        )}
      </main>
    </div>
  )
}
