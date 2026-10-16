interface JsonLdProps {
  data: object
}

// Rendered on the server so structured data is present in the initial HTML
// response instead of being injected client-side after hydration.
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
