'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Eye, MessageCircle, Heart, Clock, Bookmark, Share2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string
    thumbnail_url?: string
    created_at: string
    view_count: number
    like_count: number
    comment_count: number
    profiles?: {
      username: string
      display_name?: string
      avatar_url?: string
    }
    categories?: {
      name: string
      slug: string
    }
  }
  compact?: boolean
}

export function PostCard({ post, compact = false }: PostCardProps) {
  const { toast } = useToast()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const author = post.profiles
  const category = post.categories

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${post.slug}`
    const shareTitle = post.title

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: post.excerpt,
          url: shareUrl,
        })
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl)
      toast({
        title: 'Copied to clipboard',
        description: shareUrl,
      })
    }
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
      description: post.title,
    })
  }

  if (compact) {
    return (
      <Link href={`/post/${post.slug}`}>
        <article className="group p-3.5 border rounded-lg hover:border-primary/50 hover:shadow-md transition-all duration-200 bg-card hover:bg-card/80 cursor-pointer">
          <div className="space-y-2.5">
            {category && (
              <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary">
                {category.name}
              </span>
            )}

            <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors leading-snug">
              {post.title}
            </h3>

            {post.excerpt && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>
        </article>
      </Link>
    )
  }

  return (
    <article className="border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card">
      {/* CLICKABLE CONTENT (image + title + excerpt) */}
      <Link href={`/post/${post.slug}`} className="block group">
        {post.thumbnail_url && (
          <div className="relative w-full h-48 overflow-hidden bg-muted">
            <Image
              src={post.thumbnail_url || '/placeholder.svg'}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        )}

        <div className="p-4 space-y-3">
          <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}
        </div>
      </Link>

      {/* NON-CLICKABLE CONTENT (unchanged behavior) */}
      <div className="px-4 pb-4 space-y-3">
        {category && (
          <Link href={`/categories/${category.slug}`}>
            <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              {category.name}
            </span>
          </Link>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <div className="flex items-center gap-2">
            {author?.avatar_url && (
              <Image
                src={author.avatar_url || '/placeholder.svg'}
                alt={author.display_name || 'Author'}
                width={24}
                height={24}
                className="h-6 w-6 rounded-full object-cover"
              />
            )}
            <Link
              href={`/profile/${author?.username}`}
              className="hover:text-primary transition-colors font-medium"
            >
              {author?.display_name || 'Anonymous'}
            </Link>
          </div>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: false })}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {post.view_count}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              {post.like_count}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3.5 w-3.5" />
              {post.comment_count}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBookmark}>
              <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
