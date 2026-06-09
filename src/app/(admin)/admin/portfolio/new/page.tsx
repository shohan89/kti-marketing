import type { Metadata } from 'next'
import PortfolioItemForm from '../PortfolioItemForm'

export const metadata: Metadata = { title: 'New Portfolio Item — KTI Admin' }

export default function NewPortfolioItemPage() {
  return <PortfolioItemForm initialData={null} />
}
