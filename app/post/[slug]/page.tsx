import { getPostBySlug } from '@/lib/actions/posts'
import { getComments } from '@/lib/actions/comments'
import { getCurrentUser } from '@/lib/actions/auth'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { MarkdownContent } from '@/components/markdown-content'
import { CommentSection } from '@/components/comment-section'
import { PostActionsBar } from '@/components/post-actions-bar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Eye, Heart, MessageCircle } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const comments = await getComments(post.id)
  const userData = await getCurrentUser()

  const initials = (post.profiles?.display_name || post.profiles?.username)
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase() || 'U'

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = post.content?.split(/\s+/).length || 0
  const readTime = Math.ceil(wordCount / 200)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Thumbnail */}
      {post.thumbnail_url && (
        <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] bg-gradient-to-b from-muted to-background">
          <div className="absolute inset-0">
            <Image
              src={post.thumbnail_url || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background" />
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div className="container mx-auto px-4 -mt-20 md:-mt-32 relative z-10">
        <article className="max-w-3xl mx-auto">
          {/* Post Header */}
          <div className="bg-card border rounded-xl shadow-lg p-6 md:p-8 mb-6">
            {/* Category Badge */}
            {post.categories && (
              <Link href={`/categories/${post.categories.slug}`}>
                <Badge variant="secondary" className="mb-4">
                  {post.categories.name}
                </Badge>
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-lg text-muted-foreground mb-6 text-pretty">
                {post.excerpt}
              </p>
            )}

            {/* Author & Meta Info */}
            <div className="flex items-center gap-4 mb-6">
              <Link href={`/profile/${post.profiles?.username}`}>
                <Avatar className="h-12 w-12 border-2 border-background ring-2 ring-primary/20">
                  <AvatarImage src={post.profiles?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-sm font-semibold">{initials}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <Link 
                  href={`/profile/${post.profiles?.username}`}
                  className="font-semibold hover:text-primary transition-colors"
                >
                  {post.profiles?.display_name || post.profiles?.username || 'Anonymous'}
                </Link>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(post.created_at), 'MMMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {readTime} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {post.view_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                {post.like_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {comments.length}
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mb-6">
            <PostActionsBar post={post} user={userData} />
          </div>

          {/* Content */}
          <div className="bg-card border rounded-xl shadow-sm p-6 md:p-8 mb-8">
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-pre:bg-muted prose-pre:border">
              <MarkdownContent content={post.content} />
            </div>
          </div>

          {/* Author Card */}
          <div className="bg-card border rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-start gap-4">
              <Link href={`/profile/${post.profiles?.username}`}>
                <Avatar className="h-16 w-16 border-2 border-background ring-2 ring-primary/20">
                  <AvatarImage src={post.profiles?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">
                  {post.profiles?.display_name || post.profiles?.username || 'Author'}
                </h3>
                {post.profiles?.bio && (
                  <p className="text-sm text-muted-foreground mb-3">{post.profiles.bio}</p>
                )}
                <Link href={`/profile/${post.profiles?.username}`}>
                  <span className="text-sm text-primary hover:underline">View Profile</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">
              Discussion ({comments.length})
            </h2>
            <CommentSection postId={post.id} comments={comments} currentUser={userData} />
          </div>
        </article>
      </div>

      <Footer />
    </div>
  )
}
