import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Eye, Heart, MessageCircle, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface FeaturedPostCardProps {
  post: any
}

export function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all shadow-lg">
      <div className="grid md:grid-cols-2 gap-0">
        {/* Image Section */}
        <div className="relative h-64 md:h-full">
          <Image
            src={post.thumbnail_url || '/placeholder.svg'}
            alt={post.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-primary-foreground font-semibold px-3 py-1">
              Featured
            </Badge>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-6 md:p-8 flex flex-col justify-center">
          {/* Category */}
          {post.categories && (
            <Link href={`/categories/${post.categories.slug}`}>
              <Badge variant="secondary" className="w-fit mb-3">
                {post.categories.name}
              </Badge>
            </Link>
          )}

          {/* Title */}
          <Link href={`/post/${post.slug}`}>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 hover:text-primary transition-colors text-balance line-clamp-2">
              {post.title}
            </h2>
          </Link>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-muted-foreground mb-4 line-clamp-2 text-pretty">
              {post.excerpt}
            </p>
          )}

          {/* Author & Stats */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t">
            <Link href={`/profile/${post.profiles.username}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.profiles.avatar_url || '/placeholder.svg'} />
                <AvatarFallback>{post.profiles.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{post.profiles.full_name || post.profiles.username}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-muted-foreground text-sm">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.view_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {post.like_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {post.comment_count || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
