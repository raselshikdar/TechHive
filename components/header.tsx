import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCurrentUser, signOut } from '@/lib/actions/auth'
import { SearchBar } from '@/components/search-bar'
import { UserMenu } from '@/components/user-menu'
import { NotificationsDropdown } from '@/components/notifications-dropdown'
import { Menu, PlusCircle } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { MobileNav } from '@/components/mobile-nav'
import { MobileSearchToggle } from '@/components/mobile-search-toggle'

export async function Header() {
  const userData = await getCurrentUser()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold">
            TH
          </div>
          <span className="font-bold text-xl hidden sm:inline">TechHive</span>
        </Link>

        {/* Desktop Search Bar (unchanged) */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Icon */}
          <MobileSearchToggle />

          {userData ? (
            <>
              <Link href="/create-post" className="hidden sm:block">
                <Button size="sm" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create
                </Button>
              </Link>
              <NotificationsDropdown userId={userData.user.id} />
              <UserMenu user={userData.user} profile={userData.profile} signOut={signOut} />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/signup" className="hidden sm:block">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <MobileNav user={userData} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
