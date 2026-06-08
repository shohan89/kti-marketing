import type { Metadata } from 'next'
import TestimonialForm from '../TestimonialForm'

export const metadata: Metadata = { title: 'New Testimonial — KTI Admin' }

export default function NewTestimonialPage() {
  return <TestimonialForm initialData={null} />
}
