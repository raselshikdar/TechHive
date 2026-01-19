'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getFeaturedPost() {
  const supabase = await createServerClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        display_name,
        avatar_url,
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
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('[v0] Error fetching featured post:', error)
    return null
  }

  return post
}

export async function getHotPosts(limit = 4) {
  const supabase = await createServerClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        display_name,
        avatar_url,
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
    .eq('status', 'published')
    .order('view_count', { ascending: false })
    .order('like_count', { ascending: false})
    .limit(limit)

  if (error) {
    console.error('[v0] Error fetching hot posts:', error)
    return []
  }

  return posts
}

export async function getPosts(page = 1, limit = 15, categoryId?: string) {
  const supabase = await createServerClient()
  const offset = (page - 1) * limit

  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        display_name,
        avatar_url,
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
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data: posts, error } = await query

  if (error) {
    console.error('[v0] Error fetching posts:', error)
    return []
  }

  return posts
}

export async function getPostBySlug(slug: string) {
  const supabase = await createServerClient()

  const { data: post, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        display_name,
        avatar_url,
        role,
        bio
      ),
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('[v0] Error fetching post:', error)
    return null
  }

  // Increment view count
await supabase.rpc('increment_post_views', { post_id: post.id })

// 🔥 VERY IMPORTANT: revalidate lists
revalidatePath('/')

  return post
}

export async function getCategories() {
  const supabase = await createServerClient()

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('[v0] Error fetching categories:', error)
    return []
  }

  return categories
}

export async function toggleLike(postId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to like posts' }
  }

  // Check if already liked
  const { data: existingLike } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingLike) {
    // Unlike
    await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
  } else {
    // Like
    await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: user.id })
  }

  revalidatePath('/')
  return { success: true }
}

export async function searchPosts(query: string) {
  const supabase = await createServerClient()

  const { data: posts, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:author_id (
        id,
        username,
        display_name,
        avatar_url
      ),
      categories (
        id,
        name,
        slug
      )
    `)
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('[v0] Error searching posts:', error)
    return []
  }

  return posts
}
