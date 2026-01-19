# API Documentation

## Overview

TrickBD uses Server Actions for most data operations, with a REST API route for file uploads. All operations require proper authentication and authorization.

## Authentication

The application uses Supabase Auth for user authentication. Sessions are managed via HTTP-only cookies.

### Auth Actions

Located in `/lib/actions/auth.ts`

#### `signUp(formData: FormData)`
Create a new user account.

**Parameters:**
- `email`: User's email address
- `password`: User's password (min 6 characters)
- `username`: Unique username (3-20 chars, alphanumeric + underscore)
- `full_name`: User's display name

**Returns:** `{ success: boolean, error?: string }`

#### `signIn(formData: FormData)`
Sign in existing user.

**Parameters:**
- `email`: User's email
- `password`: User's password

**Returns:** `{ success: boolean, error?: string }`

#### `signOut()`
Sign out current user.

**Returns:** `void`

#### `getCurrentUser()`
Get currently authenticated user with profile.

**Returns:** `{ user: User, profile: Profile } | null`

---

## Posts

Located in `/lib/actions/posts.ts` and `/lib/actions/create-post.ts`

### `getPosts(page, limit, category?)`
Fetch published posts with pagination.

**Parameters:**
- `page`: Page number (default: 1)
- `limit`: Posts per page (default: 20)
- `category`: Optional category slug filter

**Returns:** `Post[]`

### `getPostBySlug(slug)`
Get single post by slug.

**Parameters:**
- `slug`: Post URL slug

**Returns:** `Post | null`

### `createPost(formData: FormData)`
Create a new post (authenticated).

**Parameters:**
- `title`: Post title
- `content`: Markdown content
- `excerpt`: Short description
- `category_id`: Category UUID
- `thumbnail_url`: Uploaded image URL
- `status`: 'draft' | 'pending' | 'published'

**Returns:** `{ success: boolean, slug?: string, error?: string }`

**Role Requirements:**
- Contributors: Posts set to 'pending'
- Authors+: Posts can be 'published'

### `updatePost(postId, formData: FormData)`
Update existing post.

**Authorization:** Author of post, or Moderator+

### `deletePost(postId)`
Delete a post.

**Authorization:** Author of post, or Moderator+

### `likePost(postId)`
Toggle like on a post (authenticated).

**Returns:** `{ success: boolean, liked: boolean }`

### `bookmarkPost(postId)`
Toggle bookmark on a post (authenticated).

**Returns:** `{ success: boolean, bookmarked: boolean }`

### `recordView(postId, ipAddress?)`
Record a post view (increments view count).

---

## Comments

Located in `/lib/actions/comments.ts`

### `getComments(postId)`
Get all comments for a post, including nested replies.

**Returns:** `Comment[]`

### `createComment(formData: FormData)`
Add a comment to a post (authenticated).

**Parameters:**
- `post_id`: Post UUID
- `content`: Comment text
- `parent_id`: Optional parent comment for replies

**Returns:** `{ success: boolean, error?: string }`

### `updateComment(commentId, content)`
Edit a comment (within 15 minutes of creation).

**Authorization:** Comment author only

### `deleteComment(commentId)`
Delete a comment.

**Authorization:** Comment author, or Moderator+

---

## Categories

### `getCategories()`
Get all categories with post counts.

**Returns:** `Category[]`

---

## User Profiles

Located in `/lib/actions/profile.ts`

### `getUserProfile(username)`
Get user profile by username.

**Returns:** `Profile | null`

### `getUserPosts(userId)`
Get all posts by a user.

**Returns:** `Post[]`

### `updateProfile(formData: FormData)`
Update current user's profile (authenticated).

**Parameters:**
- `full_name`: Display name
- `bio`: User bio
- `avatar_url`: Profile picture URL

**Returns:** `{ success: boolean, error?: string }`

---

## Dashboard

Located in `/lib/actions/dashboard.ts`

### `getUserStats()`
Get current user's statistics (authenticated).

**Returns:** `{ totalPosts, totalLikes, totalViews, totalComments }`

### `getUserDashboard()`
Get user's recent posts and activity.

**Returns:** `{ posts: Post[], stats: Stats }`

---

## Admin

Located in `/lib/actions/admin.ts`

**Role Required:** Admin or Moderator

### `getAllUsers()`
Get all users for management.

**Returns:** `Profile[]`

### `getAllPosts()`
Get all posts (including pending/rejected).

**Returns:** `Post[]`

### `getSystemStats()`
Get site-wide statistics.

**Returns:** `{ totalUsers, totalPosts, publishedPosts, totalComments, totalCategories }`

### `updateUserRole(userId, newRole)`
Change a user's role.

**Authorization:** Admin only

**Parameters:**
- `userId`: User UUID
- `newRole`: 'user' | 'contributor' | 'author' | 'moderator' | 'admin'

### `suspendUser(userId)`
Suspend/unsuspend a user.

**Authorization:** Admin only

### `deleteUser(userId)`
Permanently delete a user and their content.

**Authorization:** Admin only

### `approvePost(postId)`
Approve a pending post.

**Authorization:** Moderator+

### `rejectPost(postId, reason?)`
Reject a pending post.

**Authorization:** Moderator+

---

## File Upload

### `POST /api/upload`

Upload images for posts.

**Content-Type:** `multipart/form-data`

**Parameters:**
- `file`: Image file (max 5MB)
- `type`: 'thumbnail' | 'content'

**Returns:**
```json
{
  "url": "https://supabase-storage-url/image.jpg",
  "path": "images/uuid.jpg"
}
```

**Authentication:** Required

**Supported Formats:** JPG, PNG, GIF, WebP

---

## Database Schema

### Tables

- **profiles**: User profiles and stats
- **posts**: Blog posts with content
- **categories**: Post categories
- **comments**: Post comments (nested)
- **likes**: Post likes tracking
- **views**: Post view tracking
- **bookmarks**: User bookmarks
- **notifications**: User notifications

### Row Level Security (RLS)

All tables have RLS enabled with policies for:
- Public read access (published content)
- Authenticated write access (own content)
- Role-based access (moderators, admins)

### Storage Buckets

- **post-images**: Post thumbnails and content images
- **avatars**: User profile pictures

---

## Rate Limiting

- **Posts:** Max 10 per hour per user
- **Comments:** Max 30 per hour per user
- **Uploads:** Max 20 per hour per user

---

## Error Handling

All actions return consistent error formats:

```typescript
{
  success: false,
  error: "Error message description"
}
```

Common errors:
- `"Not authenticated"` - User must be logged in
- `"Unauthorized"` - Insufficient permissions
- `"Not found"` - Resource doesn't exist
- `"Invalid input"` - Validation failed

---

## Best Practices

1. **Always check authentication** before calling protected actions
2. **Handle errors gracefully** in your UI
3. **Use optimistic updates** for better UX
4. **Validate input** on the client before submitting
5. **Cache data** where appropriate with SWR

---

## Examples

### Creating a Post

```typescript
const formData = new FormData()
formData.append('title', 'My Awesome Tutorial')
formData.append('content', '# Introduction\n\nThis is my post...')
formData.append('excerpt', 'Learn how to...')
formData.append('category_id', 'uuid-here')
formData.append('thumbnail_url', '/uploads/image.jpg')
formData.append('status', 'published')

const result = await createPost(formData)
if (result.success) {
  router.push(`/post/${result.slug}`)
}
```

### Liking a Post

```typescript
const result = await likePost(postId)
if (result.success) {
  console.log(result.liked ? 'Liked!' : 'Unliked!')
}
```

### Updating Profile

```typescript
const formData = new FormData()
formData.append('full_name', 'John Doe')
formData.append('bio', 'Tech enthusiast')

const result = await updateProfile(formData)
```
