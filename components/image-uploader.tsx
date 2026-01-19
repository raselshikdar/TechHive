'use client'

import React from "react"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, X, Loader2 } from 'lucide-react'
import { uploadImage, validateImage } from '@/lib/utils/image-upload'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'

interface ImageUploaderProps {
  onUpload?: (url: string) => void
  currentImage?: string | null
  label?: string
  bucket?: string
  value?: string | null
  onChange?: (url: string | null) => void
}

export function ImageUploader({
  onUpload,
  currentImage,
  label = 'Upload Image',
  bucket,
  value,
  onChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Support both old and new prop names for backwards compatibility
  const imageUrl = currentImage ?? value
  const handleImageChange = onUpload || onChange

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validation = validateImage(file)
    if (!validation.valid) {
      toast({
        title: 'Invalid Image',
        description: validation.error,
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    try {
      const url = await uploadImage(file, bucket)
      if (handleImageChange) {
        handleImageChange(url)
      }
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      })
    } catch (error) {
      console.error('[v0] Upload error:', error)
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    if (handleImageChange) {
      handleImageChange(null)
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {imageUrl ? (
        <div className="relative rounded-lg overflow-hidden border">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt="Uploaded image"
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full h-48 border-dashed bg-transparent"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8" />
              <span>{label}</span>
              <span className="text-xs text-muted-foreground">
                Click to upload (Max 5MB, JPEG/PNG/WebP/GIF)
              </span>
            </div>
          )}
        </Button>
      )}
    </div>
  )
}
