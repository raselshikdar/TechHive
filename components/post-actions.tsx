'use client'

import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { toggleLike } from '@/lib/actions/posts'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

interface PostActionsProps {
  post: any
  user: any
}

export function PostActions({ post, user }: PostActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLiking, setIsLiking] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleLike = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'You must be signed in to like posts',
        variant: 'destructive',
      })
      return
    }

    setIsLiking(true)
    await toggleLike(post.id)
    setIsLiking(false)
    router.refresh()
  }

  const handleBookmark = () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'You must be signed in to bookmark posts',
        variant: 'destructive',
      })
      return
    }

    setIsBookmarked(!isBookmarked)
    toast({
      title: isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks',
      description: post.title,
    })
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: 'Link copied',
        description: 'Post link copied to clipboard',
      })
    }
  }

  return (
    <div className="flex items-center gap-2 py-4 border-y flex-wrap">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={isLiking}
        className="gap-2"
      >
        <Heart className="h-4 w-4" />
        Like ({post.like_count || 0})
      </Button>
      <Button variant="ghost" size="sm" className="gap-2">
        <MessageCircle className="h-4 w-4" />
        Comment
      </Button>
      <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2">
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBookmark}
        className={`gap-2 ${isBookmarked ? 'text-primary' : ''}`}
      >
        <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
        Save
      </Button>
    </div>
  )
}
