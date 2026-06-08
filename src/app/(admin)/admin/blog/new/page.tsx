import type { Metadata } from 'next'
import BlogForm from '../BlogForm'

export const metadata: Metadata = { title: 'New Post — KTI Admin' }

export default function NewBlogPostPage() {
  return <BlogForm initialData={null} />
}
