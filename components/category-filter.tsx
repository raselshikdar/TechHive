'use client'

import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

interface CategoryFilterProps {
  categories: any[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category')

  const handleCategoryClick = (categoryId: string | null) => {
    if (categoryId) {
      router.push(`/?category=${categoryId}`)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={!currentCategory ? 'default' : 'outline'}
        size="sm"
        onClick={() => handleCategoryClick(null)}
        className={!currentCategory ? '' : 'bg-transparent'}
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={currentCategory === category.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleCategoryClick(category.id)}
          className={currentCategory === category.id ? '' : 'bg-transparent'}
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
