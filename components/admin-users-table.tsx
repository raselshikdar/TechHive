'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateUserRole } from '@/lib/actions/admin'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'

interface AdminUsersTableProps {
  users: any[]
  currentUserId: string
}

const roleColors: Record<string, string> = {
  admin: 'bg-red-600',
  moderator: 'bg-orange-600',
  author: 'bg-blue-600',
  contributor: 'bg-green-600',
  user: 'bg-gray-600',
}

export function AdminUsersTable({ users, currentUserId }: AdminUsersTableProps) {
  const router = useRouter()

  const handleRoleChange = async (userId: string, newRole: string) => {
    await updateUserRole(userId, newRole)
    router.refresh()
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Posts</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Change Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => {
            const initials = user.full_name
              ?.split(' ')
              .map((n: string) => n[0])
              .join('')
              .toUpperCase() || 'U'

            return (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>@{user.username}</TableCell>
                <TableCell>
                  <Badge className={roleColors[user.role] || roleColors.user}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.posts_count || 0}</TableCell>
                <TableCell>{user.comments_count || 0}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {user.id === currentUserId ? (
                    <span className="text-sm text-muted-foreground">You</span>
                  ) : (
                    <Select
                      value={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="contributor">Contributor</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
