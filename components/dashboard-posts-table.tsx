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
import { Eye, Heart, MessageCircle, MoreVertical, Edit, Trash2, ExternalLink } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { deletePost } from '@/lib/actions/create-post'
import { useRouter } from 'next/navigation'

interface DashboardPostsTableProps {
  posts: any[]
}

export function DashboardPostsTable({ posts }: DashboardPostsTableProps) {
  const router = useRouter()

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      await deletePost(postId)
      router.refresh()
    }
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
                  <Link
                    href={`/post/${post.slug}`}
                    className="hover:text-primary line-clamp-1"
                  >
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">
                    {post.categories?.name || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {post.status === 'published' ? (
                    <Badge className="text-xs">Published</Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Draft
                    </Badge>
                  )}
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
                      <DropdownMenuItem asChild>
                        <Link href={`/edit-post/${post.id}`} className="cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
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
