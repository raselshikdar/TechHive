'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RichTextEditor } from '@/components/rich-text-editor'
import { ImageUploader } from '@/components/image-uploader'
import { createPost } from '@/lib/actions/create-post'
import { Loader2, Send, Save } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface PostFormProps {
  categories: any[]
  initialData?: any
  isEdit?: boolean
}

export function PostForm({ categories, initialData, isEdit = false }: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '')
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnail_url || null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!title || !content) {
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('content', content)
    formData.append('excerpt', excerpt)
    formData.append('categoryId', categoryId)
    formData.append('thumbnailUrl', thumbnailUrl || '')
    formData.append('status', status)

    try {
      await createPost(formData)
    } catch (error) {
      console.error('[v0] Error submitting post:', error)
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Post' : 'Create Post'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter an engaging title for your post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            placeholder="Brief summary of your post (optional)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Thumbnail Image</Label>
          <ImageUploader
            value={thumbnailUrl}
            onChange={setThumbnailUrl}
            label="Upload Thumbnail"
            bucket="post-images"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your post content here... Use the toolbar to add images and formatting."
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={() => handleSubmit('draft')}
            variant="outline"
            disabled={isSubmitting || !title || !content}
            className="flex-1 bg-transparent"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save as Draft
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting || !title || !content}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Publish Post
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
