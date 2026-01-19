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
    .order('like_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[v0] Error fetching hot posts:', error)
    return []
  }

  return posts
}

/* ===================== UPDATED FUNCTION ===================== */
export async function getPosts(page = 1, limit = 15, categoryId?: string) {
  const supabase = await createServerClient()
  const offset = (page - 1) * limit

  const {
    data: { user },
  } = await supabase.auth.getUser()

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
      comments (count),
      bookmarks!left (
        id
      )
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data: posts, error } = await query

  if (error || !posts) {
    console.error('[v0] Error fetching posts:', error)
    return []
  }

  return posts.map(post => ({
    ...post,
    isBookmarked: user ? post.bookmarks?.length > 0 : false,
  }))
}
/* ============================================================ */

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

  // ✅ Increment view count safely
  await supabase
    .from('posts')
    .update({ view_count: (post.view_count || 0) + 1 })
    .eq('id', post.id)

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

  const { data: existingLike } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existingLike) {
    await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
  } else {
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

export async function toggleBookmark(postId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'LOGIN_REQUIRED' }
  }

  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    await supabase.from('bookmarks').delete().eq('id', existing.id)
    revalidatePath('/')
    return { bookmarked: false }
  } else {
    await supabase.from('bookmarks').insert({
      post_id: postId,
      user_id: user.id,
    })
    revalidatePath('/')
    return { bookmarked: true }
  }
}

export async function isBookmarked(postId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false

  const { data } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()

  return !!data
}
export async function getBookmarkedPosts() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      posts (
        id,
        title,
        slug,
        excerpt,
        thumbnail_url,
        created_at,
        view_count,
        like_count,
        comment_count,
        profiles:author_id (
          username,
          display_name,
          avatar_url
        ),
        categories (
          name,
          slug
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return data.map(b => ({
    ...b.posts,
    isBookmarked: true,
  }))
}
