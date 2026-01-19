'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'
import { SearchBar } from '@/components/search-bar'

export function MobileSearchToggle() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Toggle button (only when search is closed) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 rounded-md hover:bg-muted"
          aria-label="Open search"
        >
          <Search className="h-5 w-5" />
        </button>
      )}

      {/* Search bar (full width, mobile only) */}
      {open && (
        <div className="md:hidden w-full border-t bg-background px-4 py-3 flex items-center gap-2">
          <div className="flex-1">
            <SearchBar />
          </div>

          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-muted"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </>
  )
}
