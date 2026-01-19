'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getComments(postId: string) {
  const supabase = await createServerClient()

  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (
        id,
        username,
        display_name,
        avatar_url,
        role
      )
    `)
    .eq('post_id', postId)
    .is('parent_id', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching comments:', error)
    return []
  }

  // Fetch all nested replies recursively
  const fetchReplies = async (parentId: string): Promise<any[]> => {
    const { data: replies } = await supabase
      .from('comments')
      .select(`
        *,
        profiles:user_id (
          id,
          username,
          display_name,
          avatar_url,
          role
        )
      `)
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true })

    if (!replies) return []

    // Recursively fetch replies for each reply
    for (const reply of replies) {
      reply.replies = await fetchReplies(reply.id)
    }

    return replies
  }

  // Fetch all nested replies for each top-level comment
  for (const comment of comments) {
    comment.replies = await fetchReplies(comment.id)
  }

  return comments
}

export async function createComment(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to comment' }
  }

  const postId = formData.get('postId') as string
  const content = formData.get('content') as string
  const parentId = formData.get('parentId') as string | null

  if (!content || !postId) {
    return { error: 'Content and post ID are required' }
  }

  const { error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
      parent_id: parentId || null,
    })

  if (error) {
    console.error('[v0] Error creating comment:', error)
    return { error: 'Failed to create comment' }
  }

  revalidatePath(`/post/[slug]`)
  return { success: true }
}

export async function deleteComment(commentId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to delete comments' }
  }

  // Check if user owns the comment or is admin/moderator
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const canDelete = profile?.role === 'admin' || profile?.role === 'moderator'

  if (canDelete) {
    await supabase.from('comments').delete().eq('id', commentId)
  } else {
    await supabase.from('comments').delete().eq('id', commentId).eq('user_id', user.id)
  }

  revalidatePath(`/post/[slug]`)
  return { success: true }
}
