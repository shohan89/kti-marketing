import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BlogForm from '../../BlogForm'

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await prisma.blogPost.findUnique({ where: { id } }).catch(() => null)
  if (!post) notFound()
  return <BlogForm initialData={post as Parameters<typeof BlogForm>[0]['initialData']} />
}
