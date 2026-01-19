'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { SearchBar } from '@/components/search-bar'

export function MobileSearchToggle() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Search icon (mobile only) */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="md:hidden p-2 rounded-md hover:bg-muted"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Search bar (mobile only, toggle) */}
      {open && (
        <div className="md:hidden border-t bg-background px-4 py-3">
          <SearchBar />
        </div>
      )}
    </>
  )
}
