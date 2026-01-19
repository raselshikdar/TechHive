'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Image from 'next/image'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="prose prose-slate max-w-none dark:prose-invert
        prose-headings:font-bold prose-headings:text-foreground
        prose-p:text-foreground prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-bold
        prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded
        prose-pre:bg-muted prose-pre:p-0
        prose-ul:text-foreground prose-ol:text-foreground
        prose-li:text-foreground prose-li:marker:text-muted-foreground
        prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
        prose-img:rounded-lg prose-img:shadow-md"
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="div"
              className="rounded-lg"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
        img({ src, alt, ...props }: any) {
          return (
            <span className="block my-4">
              <Image
                src={src || '/placeholder.svg'}
                alt={alt || 'Image'}
                width={800}
                height={400}
                className="rounded-lg w-full h-auto"
                {...props}
              />
            </span>
          )
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
