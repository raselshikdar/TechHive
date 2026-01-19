'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function createPost(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to create a post' }
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string
  const categoryId = formData.get('categoryId') as string
  const thumbnailUrl = formData.get('thumbnailUrl') as string
  const isDraft = formData.get('isDraft') === 'true'

  if (!title || !content) {
    return { error: 'Title and content are required' }
  }

  const slug = generateSlug(title)

  // Check if slug already exists
  const { data: existingPost } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()

  const finalSlug = existingPost ? `${slug}-${Date.now()}` : slug

  // Determine status based on role and draft flag
  let status = 'pending'
  if (profile?.role === 'admin' || profile?.role === 'moderator' || profile?.role === 'author') {
    status = isDraft ? 'draft' : 'published'
  } else if (profile?.role === 'contributor') {
    status = isDraft ? 'draft' : 'pending'
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      title,
      slug: finalSlug,
      content,
      excerpt: excerpt || content.substring(0, 200),
      category_id: categoryId || null,
      thumbnail_url: thumbnailUrl || null,
      author_id: user.id,
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating post:', error)
    return { error: 'Failed to create post' }
  }

  revalidatePath('/')
  revalidatePath('/dashboard')
  redirect(`/post/${data.slug}`)
}

export async function updatePost(postId: string, formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update a post' }
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string
  const categoryId = formData.get('categoryId') as string
  const thumbnailUrl = formData.get('thumbnailUrl') as string
  const isDraft = formData.get('isDraft') === 'true'

  // Determine status based on role and draft flag
  let status = 'pending'
  if (profile?.role === 'admin' || profile?.role === 'moderator' || profile?.role === 'author') {
    status = isDraft ? 'draft' : 'published'
  } else if (profile?.role === 'contributor') {
    status = isDraft ? 'draft' : 'pending'
  }

  const { error } = await supabase
    .from('posts')
    .update({
      title,
      content,
      excerpt,
      category_id: categoryId,
      thumbnail_url: thumbnailUrl,
      status,
      published_at: status === 'published' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) {
    console.error('[v0] Error updating post:', error)
    return { error: 'Failed to update post' }
  }

  revalidatePath('/')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deletePost(postId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to delete a post' }
  }

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) {
    console.error('[v0] Error deleting post:', error)
    return { error: 'Failed to delete post' }
  }

  revalidatePath('/')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function getPostForEdit(postId: string) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in' }
  }

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .eq('author_id', user.id)
    .single()

  if (error) {
    console.error('[v0] Error fetching post:', error)
    return { error: 'Post not found' }
  }

  return { post }
}
