'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server' // Added import for getSupabaseServerClient

export async function getAllUsers() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching users:', error)
    return []
  }

  return data
}

export async function updateUserRole(userId: string, role: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Unauthorized' }
  }

  // Check if current user is admin
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentProfile?.role !== 'admin') {
    return { error: 'Only admins can update user roles' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId)

  if (error) {
    console.error('[v0] Error updating user role:', error)
    return { error: 'Failed to update user role' }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function getAllPosts() {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        full_name,
        role
      ),
      categories (
        id,
        name,
        slug
      ),
      post_likes (count),
      comments (count)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching posts:', error)
    return []
  }

  return data
}

export async function updatePostStatus(postId: string, status: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('posts')
    .update({ status })
    .eq('id', postId)

  if (error) {
    console.error('[v0] Error updating post status:', error)
    return { error: 'Failed to update post status' }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function togglePostFeatured(postId: string, isFeatured: boolean) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('posts')
    .update({ is_featured: isFeatured })
    .eq('id', postId)

  if (error) {
    console.error('[v0] Error toggling featured status:', error)
    return { error: 'Failed to toggle featured status' }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function deletePostAdmin(postId: string) {
  const supabase = await createServerClient()

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) {
    console.error('[v0] Error deleting post:', error)
    return { error: 'Failed to delete post' }
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function getSystemStats() {
  const supabase = await createServerClient()

  // Total users
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  // Total posts
  const { count: totalPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })

  // Published posts
  const { count: publishedPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  // Total comments
  const { count: totalComments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })

  // Total categories
  const { count: totalCategories } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true })

  return {
    totalUsers: totalUsers || 0,
    totalPosts: totalPosts || 0,
    publishedPosts: publishedPosts || 0,
    totalComments: totalComments || 0,
    totalCategories: totalCategories || 0,
  }
}
