import React from "react";
import Script from "next/script";
import { University } from "@/lib/universities/types";
import { GuideType, guides } from "@/lib/guides/content";

export function StructuredData({ 
  university, 
  pageType, 
  url,
  isGuide
}: { 
  university: University, 
  pageType: string,
  url: string,
  isGuide?: boolean
}) {
  const isGeneric = university.id === "general";
  const organizationName = isGeneric ? "GradeFlow" : university.name;
  const prefix = isGeneric ? '' : `${university.shortName} `;
  const nameDesc = isGeneric ? 'all universities' : `${university.name}`;

  let title = "";
  let description = "";

  if (isGuide) {
    const guideContent = guides[pageType as GuideType];
    title = guideContent.title;
    description = guideContent.description;
  } else {
    switch (pageType) {
      case "cgpa-calculator":
        title = `${prefix}CGPA Calculator | Fast & Accurate`;
        description = `Calculate your ${prefix}CGPA instantly.`;
        break;
      case "sgpa-calculator":
        title = `${prefix}SGPA Calculator`;
        description = `Calculate your ${prefix}SGPA accurately.`;
        break;
      case "cgpa-to-percentage":
        title = `${prefix}CGPA to Percentage Converter`;
        description = `Convert your ${prefix}CGPA to percentage.`;
        break;
      case "percentage-to-cgpa-calculator":
        title = `${prefix}Percentage to CGPA Calculator`;
        description = `Convert your percentage into ${prefix}CGPA.`;
        break;
      case "sgpa-to-cgpa-calculator":
        title = `${prefix}SGPA to CGPA Calculator`;
        description = `Calculate your overall ${prefix}CGPA from your semester SGPAs.`;
        break;
      case "gpa-to-cgpa-calculator":
        title = `${prefix}GPA to CGPA Calculator`;
        description = `Convert GPA to ${prefix}CGPA.`;
        break;
      case "marks-to-cgpa-calculator":
        title = `${prefix}Marks to CGPA Calculator`;
        description = `Enter your subject marks to calculate your ${prefix}CGPA.`;
        break;
      case "grade-calculator":
        title = `${prefix}Grade Calculator`;
        description = `Check ${prefix}grading system.`;
        break;
      case "grading-system":
        title = `${prefix}Grading System Explained`;
        description = `Understand the ${prefix}grading system.`;
        break;
      default:
        title = `${prefix}${pageType.replace(/-/g, ' ')}`;
        description = `Use the ${title} tool for ${nameDesc}.`;
    }
  }

  // 1. Breadcrumb Schema
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://gradeflow.app"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": isGeneric ? "Tools" : organizationName,
        "item": isGeneric ? "https://gradeflow.app" : `https://gradeflow.app/university-hub`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": title,
        "item": url
      }
    ]
  };

  // 2. SoftwareApplication Schema for Calculator pages
  const isCalculator = pageType.includes("calculator") || pageType.includes("to");
  
  const softwareApplication = isCalculator ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": title,
    "description": description,
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "GradeFlow"
    }
  } : null;

  return (
    <>
      <Script
        id={`breadcrumb-${pageType}-${university.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      {softwareApplication && (
        <Script
          id={`software-${pageType}-${university.id}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplication) }}
        />
      )}
    </>
  );
}
