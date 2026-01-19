'use server'

import { createServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Declare the getSupabaseServerClient function
async function getSupabaseServerClient() {
  return createServerClient()
}

export async function getUserProfile(username: string) {
  const supabase = await createServerClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (error) {
    console.error('[v0] Error fetching profile:', error)
    return null
  }

  return profile
}

export async function getUserPostsByUsername(username: string) {
  const supabase = await createServerClient()

  // First get the user
  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (!profile) return []

  const { data: posts, error } = await supabase
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
    .eq('author_id', profile.id)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching user posts:', error)
    return []
  }

  return posts
}

export async function updateProfile(formData: FormData) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update your profile' }
  }

  const fullName = formData.get('fullName') as string
  const bio = formData.get('bio') as string
  const avatarUrl = formData.get('avatarUrl') as string
  const website = formData.get('website') as string
  const location = formData.get('location') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: fullName,
      bio,
      avatar_url: avatarUrl || null,
    })
    .eq('id', user.id)

  if (error) {
    console.error('[v0] Error updating profile:', error)
    return { error: 'Failed to update profile' }
  }

  revalidatePath('/settings')
  return { success: true }
}
