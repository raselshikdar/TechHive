export type UserRole = 'user' | 'contributor' | 'author' | 'moderator' | 'admin'

export type PostStatus = 'draft' | 'pending' | 'published' | 'rejected'

export interface Profile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  role: UserRole
  is_suspended: boolean
  total_posts: number
  total_likes: number
  total_views: number
  total_comments: number
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  author_id: string
  category_id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  thumbnail_url: string | null
  status: PostStatus
  view_count: number
  like_count: number
  comment_count: number
  is_featured: boolean
  published_at: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
  categories?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  post_count: number
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  parent_id: string | null
  content: string
  is_edited: boolean
  created_at: string
  updated_at: string
  profiles?: Profile
  replies?: Comment[]
}

export interface Like {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export interface View {
  id: string
  post_id: string
  user_id: string | null
  ip_address: string | null
  created_at: string
}

export interface Bookmark {
  id: string
  post_id: string
  user_id: string
  created_at: string
  posts?: Post
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  content: string
  link: string | null
  is_read: boolean
  created_at: string
}
