# TrickBD Clone - Bangladeshi Tech Forum

A full-featured tech forum and community platform inspired by TrickBD, built with Next.js 16, React 19, Supabase, and TypeScript.

## Features

### Core Functionality
- **User System**: Complete authentication with 5 role levels (User, Contributor, Author, Moderator, Admin)
- **Post Management**: Create, edit, delete posts with rich markdown editor
- **Direct Image Upload**: Upload thumbnail and inline images directly to Supabase Storage
- **Comments System**: Nested comments with edit, delete, and moderation
- **Social Features**: Likes, views, bookmarks, and notifications
- **Categories**: Organized content by topics (Android, iOS, Web Dev, Security, etc.)
- **Search**: Full-text search across posts and users
- **Responsive Design**: Optimized for mobile and desktop

### Role-Based Features

#### User (Default)
- Read posts and comments
- Like and bookmark posts
- View author profiles
- Basic profile customization

#### Contributor
- All User features
- Create posts (pending approval)
- Comment on posts
- Build reputation

#### Author
- All Contributor features
- Posts auto-approved
- Edit own posts anytime
- Access to basic analytics

#### Moderator
- All Author features
- Approve/reject pending posts
- Edit/delete any post or comment
- Manage user content
- Access moderation dashboard

#### Admin
- All Moderator features
- User management (roles, suspend, delete)
- Site-wide statistics
- Full administrative control

### Dashboard Features
- Personal stats (posts, likes, views, comments)
- Recent posts management
- Quick actions
- Role-based controls

### Admin Panel
- User management table with role assignment
- Content moderation tools
- Site statistics overview
- Post approval system

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Rich Text**: Custom markdown editor with image upload

## Database Schema

### Tables
- `profiles` - User profiles with role, stats, and metadata
- `posts` - Blog posts with status, views, likes
- `categories` - Post categories
- `comments` - Nested comment system
- `likes` - Post likes tracking
- `views` - Post view tracking
- `bookmarks` - User bookmarks
- `notifications` - User notifications

### Security
- Row Level Security (RLS) enabled on all tables
- Role-based access control
- Secure file upload policies

## Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- Vercel account (optional, for deployment)

### Environment Variables

The following variables are automatically configured when you connect Supabase integration:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

For development redirects:
```
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### Installation

1. Connect Supabase integration in v0
2. Run the database migrations (already executed):
   - `001_initial_schema.sql` - Create tables
   - `002_rls_policies.sql` - Set up security
   - `003_triggers_functions.sql` - Add automation
   - `004_seed_data.sql` - Add default categories
   - `005_storage_buckets.sql` - Configure storage

3. Your site is ready to use!

### Default Categories

The following categories are pre-loaded:
- Android
- iOS  
- Windows
- Mac
- Linux
- Web Development
- Programming
- Security
- Networking
- Hardware
- Software
- Gaming
- Tips & Tricks
- Tutorials
- News

## Usage

### Creating Your First Post

1. Sign up for an account (starts as User role)
2. Navigate to "Create Post"
3. Upload a thumbnail image
4. Write your post using the markdown editor
5. Upload inline images directly in the editor
6. Select a category
7. Publish (Contributor posts need approval, Author+ auto-approved)

### User Roles Hierarchy

```
User → Contributor → Author → Moderator → Admin
```

Admins can promote/demote users through the Admin Panel.

### Image Upload

- **Thumbnail**: Max 5MB, optimized automatically
- **Body Images**: Drag & drop or click to upload
- **Formats**: JPG, PNG, GIF, WebP
- **Storage**: Securely stored in Supabase Storage

## Project Structure

```
/app                  # Next.js app directory
  /admin             # Admin panel
  /auth              # Auth callback
  /categories        # Category pages
  /create-post       # Post creation
  /dashboard         # User dashboard
  /login             # Login page
  /post              # Post detail pages
  /profile           # User profiles
  /search            # Search results
  /settings          # User settings
  /signup            # Registration
/components          # React components
/lib
  /actions          # Server actions
  /supabase         # Supabase clients
  /utils            # Utility functions
/scripts            # Database migrations
```

## Key Features Implementation

### Authentication
- Email/password authentication via Supabase Auth
- Automatic profile creation on signup
- Secure session management with middleware
- Role-based route protection

### Post Creation
- Rich markdown editor with preview
- Direct image upload to Supabase Storage
- Automatic slug generation from title
- Draft/published status management
- Category assignment

### Comments
- Nested comment threads
- Edit within 15 minutes
- Delete own comments
- Moderator can edit/delete any comment
- Real-time comment counts

### Moderation
- Post approval workflow for Contributors
- Content flagging system
- User suspension capability
- Bulk moderation actions

### Search
- Full-text search in post titles and content
- Author name search
- Category filtering
- Sort by relevance, date, popularity

## Security Features

- Row Level Security on all tables
- Secure file upload policies
- Role-based access control
- XSS protection in markdown rendering
- CSRF protection
- Secure password hashing by Supabase Auth

## Performance Optimizations

- Server-side rendering for SEO
- Image optimization with Next.js Image
- Database query optimization with indexes
- Efficient caching strategies
- Lazy loading for images
- Mobile-first responsive design

## Responsive Design

- Mobile navigation menu
- Touch-friendly interfaces
- Optimized image sizes
- Flexible grid layouts
- Accessible UI components

## Contributing

This is a clone project for educational purposes. Feel free to fork and customize for your own needs.

## License

MIT License - Feel free to use this project for learning and development.

## Credits

- Inspired by [TrickBD.com](https://trickbd.com)
- Built with [v0 by Vercel](https://v0.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)

## Support

For issues or questions, please check the documentation or reach out to the development team.
