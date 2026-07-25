import { safeJsonLd } from '@/lib/sanitize'

interface Props {
  data: object | object[]
}

export default function JsonLd({ data }: Props) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // safeJsonLd escapes `<`, `>` and `&` so an admin-authored SEO field
          // containing `</script>` cannot break out of this tag.
          dangerouslySetInnerHTML={{ __html: safeJsonLd(item) }}
        />
      ))}
    </>
  )
}
