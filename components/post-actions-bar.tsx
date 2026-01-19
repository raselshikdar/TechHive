'use client'

import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { toggleLike } from '@/lib/actions/posts'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useState, useEffect } from 'react'
import { createBrowserClient } from '@/lib/supabase/client'

interface PostActionsBarProps {
  post: any
  user: any
}

export function PostActionsBar({ post, user }: PostActionsBarProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLiking, setIsLiking] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.like_count || 0)
  const [isBookmarked, setIsBookmarked] = useState(false)

  // Check if user has liked the post
  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!user) return

      const supabase = createBrowserClient()
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.user.id)
        .single()

      setIsLiked(!!data)
    }

    checkLikeStatus()
  }, [post.id, user])

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
    
    // Optimistically update UI
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)

    try {
      await toggleLike(post.id)
      router.refresh()
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked)
      setLikeCount(post.like_count || 0)
      toast({
        title: 'Error',
        description: 'Failed to update like. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLiking(false)
    }
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

  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.title,
          url: url,
        })
      } catch (err) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url)
      toast({
        title: 'Link copied',
        description: 'Post link copied to clipboard',
      })
    }
  }

  const scrollToComments = () => {
    const commentsSection = document.querySelector('h2')
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="sticky top-16 z-40 bg-card border rounded-xl shadow-sm p-3">
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Button
          variant={isLiked ? "default" : "ghost"}
          size="sm"
          onClick={handleLike}
          disabled={isLiking}
          className={`gap-2 transition-all ${isLiked ? '' : 'bg-transparent'}`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span className="font-medium">{likeCount}</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={scrollToComments}
          className="gap-2 bg-transparent"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="font-medium">Comment</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleShare} 
          className="gap-2 bg-transparent"
        >
          <Share2 className="h-4 w-4" />
          <span className="font-medium">Share</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className={`gap-2 ${isBookmarked ? 'text-primary' : 'bg-transparent'}`}
        >
          <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          <span className="font-medium">Save</span>
        </Button>
      </div>
    </div>
  )
}
