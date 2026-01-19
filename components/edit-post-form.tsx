'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePost } from '@/lib/actions/create-post'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '@/components/image-uploader'
import { RichTextEditor } from '@/components/rich-text-editor'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface EditPostFormProps {
  post: {
    id: string
    title: string
    content: string
    excerpt?: string
    category_id?: string
    thumbnail_url?: string
    status: string
  }
}

export function EditPostForm({ post }: EditPostFormProps) {
  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)
  const [excerpt, setExcerpt] = useState(post.excerpt || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(post.thumbnail_url || '')
  const [categoryId, setCategoryId] = useState(post.category_id || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (isDraft: boolean) => {
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('excerpt', excerpt)
    formData.append('thumbnailUrl', thumbnailUrl)
    formData.append('categoryId', categoryId)
    formData.append('isDraft', isDraft.toString())

    const result = await updatePost(post.id, formData)

    setIsSubmitting(false)

    if (result?.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Success',
        description: 'Post updated successfully',
      })
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="thumbnail">Thumbnail Image</Label>
        <ImageUploader
          onUpload={(url) => setThumbnailUrl(url)}
          currentImage={thumbnailUrl}
        />
      </div>

      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
          className="mt-1.5"
          required
        />
      </div>

      <div>
        <Label htmlFor="excerpt">Excerpt (Optional)</Label>
        <Input
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief description of your post"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting || !title || !content}
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            'Update Post'
          )}
        </Button>

        <Button
          onClick={() => handleSubmit(true)}
          disabled={isSubmitting || !title || !content}
          variant="outline"
          size="lg"
        >
          Save as Draft
        </Button>

        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
