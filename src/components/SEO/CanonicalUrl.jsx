// components/SEO/CanonicalUrl.jsx
export default function CanonicalUrl({ path }) {
    const baseUrl = 'https://www.ajithkumarr.com';
    const canonicalUrl = `${baseUrl}${path}`;
    
    return <link rel="canonical" href={canonicalUrl} />;
  }