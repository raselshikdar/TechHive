'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye, Heart, MessageCircle, MoreVertical, ExternalLink, Trash2, Star } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { updatePostStatus, deletePostAdmin, togglePostFeatured } from '@/lib/actions/admin'
import { useRouter } from 'next/navigation'

interface AdminPostsTableProps {
  posts: any[]
  isAdmin: boolean
}

export function AdminPostsTable({ posts, isAdmin }: AdminPostsTableProps) {
  const router = useRouter()

  const handleStatusChange = async (postId: string, status: string) => {
    await updatePostStatus(postId, status)
    router.refresh()
  }

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      await deletePostAdmin(postId)
      router.refresh()
    }
  }

  const handleToggleFeatured = async (postId: string, isFeatured: boolean) => {
    await togglePostFeatured(postId, !isFeatured)
    router.refresh()
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No posts found</p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Views</TableHead>
            <TableHead className="text-center">Likes</TableHead>
            <TableHead className="text-center">Comments</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => {
            const likesCount = post.post_likes?.[0]?.count || 0
            const commentsCount = post.comments?.[0]?.count || 0

            return (
              <TableRow key={post.id}>
                <TableCell className="font-medium max-w-xs">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/post/${post.slug}`}
                      className="hover:text-primary line-clamp-1"
                    >
                      {post.title}
                    </Link>
                    {post.is_featured && (
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{post.profiles?.full_name}</div>
                    <div className="text-xs text-muted-foreground">
                      @{post.profiles?.username}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {post.categories?.name || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={post.status}
                    onValueChange={(value) => handleStatusChange(post.id, value)}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    {post.views || 0}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Heart className="h-3 w-3 text-muted-foreground" />
                    {likesCount}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <MessageCircle className="h-3 w-3 text-muted-foreground" />
                    {commentsCount}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/post/${post.slug}`} className="cursor-pointer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Post
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem
                          onClick={() => handleToggleFeatured(post.id, post.is_featured)}
                          className="cursor-pointer"
                        >
                          <Star className="mr-2 h-4 w-4" />
                          {post.is_featured ? 'Unfeature' : 'Feature'}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(post.id)}
                        className="cursor-pointer text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
