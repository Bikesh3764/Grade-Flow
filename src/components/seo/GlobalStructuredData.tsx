import Script from "next/script";

/**
 * Global structured data for the entire website.
 * Renders Organization and WebSite JSON-LD schema in the root layout.
 */
export function GlobalStructuredData() {
  const baseUrl = "https://cgpacalculator.xyz";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GradeFlow",
    "url": baseUrl,
    "logo": `${baseUrl}/icon.png`,
    "description": "The all-in-one CGPA, SGPA, and academic performance calculator for 1000+ Indian universities.",
    "foundingDate": "2024",
    "sameAs": []
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "GradeFlow - CGPA Calculator",
    "alternateName": "cgpacalculator.xyz",
    "url": baseUrl,
    "description": "Calculate your CGPA, SGPA, and convert percentages to CGPA instantly for VIT, SRM, Anna University, KTU, VTU, IPU, and 1000+ more universities.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/university-hub?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
