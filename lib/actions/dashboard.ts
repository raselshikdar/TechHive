'use server'

import { createServerClient } from '@/lib/supabase/server'
import { getSupabaseServerClient } from '@/lib/supabase/server' // Declared the missing variable

export async function getUserPosts(userId: string, status?: string) {
  const supabase = await createServerClient()

  let query = supabase
    .from('posts')
    .select(`
      *,
      categories (
        id,
        name,
        slug
      ),
      post_likes (count),
      comments (count)
    `)
    .eq('author_id', userId)
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('[v0] Error fetching user posts:', error)
    return []
  }

  return data
}

export async function getUserStats(userId: string) {
  const supabase = await createServerClient()

  // Get total posts
  const { count: totalPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', userId)

  // Get published posts
  const { count: publishedPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', userId)
    .eq('status', 'published')

  // Get draft posts
  const { count: draftPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', userId)
    .eq('status', 'draft')

  // Get total views
  const { data: posts } = await supabase
    .from('posts')
    .select('views')
    .eq('author_id', userId)

  const totalViews = posts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0

  // Get total likes
  const { count: totalLikes } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .in(
      'post_id',
      (await supabase.from('posts').select('id').eq('author_id', userId)).data?.map((p) => p.id) || []
    )

  // Get total comments
  const { count: totalComments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  return {
    totalPosts: totalPosts || 0,
    publishedPosts: publishedPosts || 0,
    draftPosts: draftPosts || 0,
    totalViews,
    totalLikes: totalLikes || 0,
    totalComments: totalComments || 0,
  }
}

export async function getNotifications(userId: string) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error) {
    console.error('[v0] Error fetching notifications:', error)
    return []
  }

  return data
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createServerClient()

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
}
