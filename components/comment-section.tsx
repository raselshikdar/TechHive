'use client'

import React from "react"

import { useState, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createComment, deleteComment } from '@/lib/actions/comments'
import { formatDistanceToNow } from 'date-fns'
import { Reply, Trash2, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface CommentSectionProps {
  postId: string
  comments: any[]
  currentUser: any
}

export function CommentSection({ postId, comments, currentUser }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const router = useRouter()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const formData = new FormData()
    formData.append('postId', postId)
    formData.append('content', newComment)

    await createComment(formData)
    setNewComment('')
    router.refresh()
  }

  // Flatten all comments and replies into a single level
  const flattenComments = (commentsList: any[]): any[] => {
    const flattened: any[] = []
    
    const processComment = (comment: any, parentComment?: any) => {
      flattened.push({
        ...comment,
        isReply: !!parentComment,
        replyingTo: parentComment
      })
      
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.forEach((reply: any) => processComment(reply, comment))
      }
    }
    
    commentsList.forEach(comment => processComment(comment))
    return flattened
  }

  const flatComments = flattenComments(comments)

  return (
    <div className="space-y-6">
      {/* New Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment}>
          <Card className="shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentUser.profile?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {currentUser.profile?.display_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Textarea
                    placeholder="What are your thoughts?"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={!newComment.trim()} size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Join the discussion</p>
            <Link href="/login">
              <Button>Sign in to comment</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Comments List - All at same level */}
      {flatComments.length > 0 ? (
        <div className="space-y-4">
          {flatComments.map((comment) => (
            <CommentItem 
              key={comment.id} 
              comment={comment} 
              postId={postId}
              currentUser={currentUser}
              router={router}
            />
          ))}
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No comments yet. Start the conversation!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Separate component to prevent keyboard issues
function CommentItem({ comment, postId, currentUser, router }: any) {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const initials = (comment.profiles?.display_name || comment.profiles?.username)
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U'

  const canDelete =
    currentUser &&
    (currentUser.user.id === comment.user_id ||
      currentUser.profile.role === 'admin' ||
      currentUser.profile.role === 'moderator')

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    const formData = new FormData()
    formData.append('postId', postId)
    formData.append('content', replyContent)
    formData.append('parentId', comment.parent_id || comment.id)

    await createComment(formData)
    setReplyContent('')
    setIsReplying(false)
    router.refresh()
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this comment?')) {
      await deleteComment(comment.id)
      router.refresh()
    }
  }

  return (
    <Card className={`shadow-sm ${comment.isReply ? 'ml-8 border-l-2 border-primary/30' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Link href={`/profile/${comment.profiles?.username}`}>
            <Avatar className="h-9 w-9 flex-shrink-0">
              <AvatarImage src={comment.profiles?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Link
                href={`/profile/${comment.profiles?.username}`}
                className="font-semibold text-sm hover:text-primary transition-colors"
              >
                {comment.profiles?.display_name || comment.profiles?.username || 'Anonymous'}
              </Link>
              {comment.isReply && comment.replyingTo && (
                <span className="text-xs text-muted-foreground">
                  replying to {comment.replyingTo.profiles?.display_name || comment.replyingTo.profiles?.username}
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
            <div className="flex items-center gap-1">
              {currentUser && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(!isReplying)}
                  className="h-7 text-xs px-2"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-7 text-xs px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              )}
            </div>

            {/* Reply Form - separate state per comment */}
            {isReplying && (
              <form onSubmit={handleSubmitReply} className="mt-3 space-y-2">
                <Textarea
                  placeholder="Write your reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={3}
                  className="text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" disabled={!replyContent.trim()}>
                    <Send className="h-3 w-3 mr-1" />
                    Post Reply
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsReplying(false)
                      setReplyContent('')
                    }}
                    className="bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
