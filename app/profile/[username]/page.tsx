import { getUserProfile, getUserPostsByUsername } from '@/lib/actions/profile'
import { Header } from '@/components/header'
import { PostCard } from '@/components/post-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Link as LinkIcon, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { notFound } from 'next/navigation'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params
  const profile = await getUserProfile(username)

  if (!profile) {
    notFound()
  }

  const posts = await getUserPostsByUsername(username)

  const initials = profile.full_name
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U'

  const roleColors: Record<string, string> = {
    admin: 'bg-red-600',
    moderator: 'bg-orange-600',
    author: 'bg-blue-600',
    contributor: 'bg-green-600',
    user: 'bg-gray-600',
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name} />
                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{profile.full_name}</h1>
                  <Badge className={roleColors[profile.role] || roleColors.user}>
                    {profile.role}
                  </Badge>
                </div>
                <p className="text-muted-foreground mb-4">@{profile.username}</p>

                {profile.bio && (
                  <p className="text-foreground mb-4 text-pretty">{profile.bio}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {profile.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {profile.location}
                    </span>
                  )}
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-primary"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Website
                    </a>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                  </span>
                </div>

                <div className="flex items-center gap-6 mt-4 text-sm">
                  <div>
                    <span className="font-bold text-foreground">{profile.posts_count || 0}</span>
                    <span className="text-muted-foreground ml-1">Posts</span>
                  </div>
                  <div>
                    <span className="font-bold text-foreground">{profile.comments_count || 0}</span>
                    <span className="text-muted-foreground ml-1">Comments</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Posts */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Posts by {profile.full_name}</h2>
          <p className="text-muted-foreground">{posts.length} published posts</p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={{ ...post, profiles: profile }} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No published posts yet</p>
          </div>
        )}
      </main>
    </div>
  )
}
