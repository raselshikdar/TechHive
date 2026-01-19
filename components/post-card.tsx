'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  Eye,
  MessageCircle,
  Heart,
  Clock,
  Bookmark,
  Share2,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
// ✅ ADD THESE IMPORTS
import { toggleBookmark, isBookmarked } from '@/lib/actions/posts'

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
  const [isBookmarkedState, setIsBookmarkedState] = useState(false)

  const author = post.profiles
  const category = post.categories

  // ✅ INITIAL BACKEND CHECK (VERY IMPORTANT)
  useEffect(() => {
  const check = async () => {
    const supabase = getSupabaseBrowserClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsBookmarkedState(false)
      return
    }

    const { data } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('post_id', post.id)
      .eq('user_id', user.id)
      .maybeSingle()

    setIsBookmarkedState(!!data)
  }

  check()
}, [post.id])

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/post/${post.slug}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
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

  // ✅ BACKEND BOOKMARK TOGGLE
  const handleBookmark = async () => {
    const res = await toggleBookmark(post.id)

    if (res?.error === 'LOGIN_REQUIRED') {
      toast({
        title: 'Login required',
        description: 'Please sign in to bookmark posts',
      })
      return
    }

    setIsBookmarkedState(res.bookmarked)

    toast({
      title: res.bookmarked ? 'Added to bookmarks' : 'Removed from bookmarks',
      description: post.title,
    })
  }

  /* -------------------- COMPACT CARD (UNCHANGED) -------------------- */
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

  /* -------------------- FULL CARD -------------------- */
  return (
    <article className="border rounded-xl overflow-hidden bg-card hover:shadow-lg transition-shadow duration-300">
      {/* CLICKABLE CONTENT */}
      <Link href={`/post/${post.slug}`} className="block group">
        {/* Thumbnail */}
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

        <div className="p-4 space-y-2">
          {/* META ROW */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {author?.avatar_url && (
              <Image
                src={author.avatar_url}
                alt={author.display_name || 'Author'}
                width={20}
                height={20}
                className="h-5 w-5 rounded-full object-cover"
              />
            )}

            <span className="hidden sm:inline font-medium text-foreground">
              {author?.display_name || 'Anonymous'}
            </span>

            {category && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  {category.name}
                </span>
              </>
            )}

            <span className="text-muted-foreground">•</span>

            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: false,
              })}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {post.excerpt}
            </p>
          )}
        </div>
      </Link>

      {/* NON-CLICKABLE: STATS & ACTIONS */}
      <div className="px-4 pb-4 pt-2 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-foreground">
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleBookmark}
              title="Bookmark"
            >
              <Bookmark
                className={`h-4 w-4 ${
                  isBookmarkedState ? 'fill-current text-primary' : ''
                }`}
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleShare}
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
