'use client';

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Home, Grid, PlusCircle, User, LogIn, UserPlus, X } from 'lucide-react'

interface MobileNavProps {
  user: any
  onClose?: () => void
}

export function MobileNav({ user, onClose }: MobileNavProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm">
            TH
          </div>
          <span className="font-bold text-lg">TechHive</span>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* User Section */}
      {user && (
        <div className="p-4 border-b bg-muted/20">
          <Link 
            href={`/profile/${user.profile?.username}`}
            onClick={onClose}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-12 w-12 border-2">
              <AvatarImage src={user.profile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>
                {user.profile?.display_name?.charAt(0) || user.profile?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">
                {user.profile?.display_name || user.profile?.username}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                @{user.profile?.username}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <Link 
          href="/" 
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
        >
          <Home className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Home</span>
        </Link>
        
        <Link 
          href="/categories" 
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
        >
          <Grid className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Categories</span>
        </Link>

        {user && (
          <>
            <Separator className="my-3" />
            
            <Link 
              href="/create-post" 
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              <span className="font-medium">Create Post</span>
            </Link>

            <Link 
              href="/dashboard" 
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
            >
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">Dashboard</span>
            </Link>
          </>
        )}
      </nav>

      {/* Footer Actions */}
      {!user && (
        <div className="p-4 border-t space-y-2">
          <Link href="/login" onClick={onClose}>
            <Button className="w-full justify-center gap-2" size="lg">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link href="/signup" onClick={onClose}>
            <Button variant="outline" className="w-full justify-center gap-2 bg-transparent" size="lg">
              <UserPlus className="h-4 w-4" />
              Sign Up
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
