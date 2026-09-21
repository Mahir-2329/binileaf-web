/**
 * Emits one schema.org graph as a script tag. Kept in a component so every
 * page declares its structured data the same way, and so the JSON is never
 * hand-written in JSX.
 */
export default function JsonLd({ id, data }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      // The payload is built from our own data modules, never from user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
