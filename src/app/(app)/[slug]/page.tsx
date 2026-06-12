import { notFound } from "next/navigation";
import { universities, getUniversityBySlug, generalUniversity } from "@/lib/universities/registry";
import { Metadata } from "next";

// Import SEO components
import { SeoCGPACalculator } from "@/components/seo/SeoCGPACalculator";
import { SeoSGPACalculator } from "@/components/seo/SeoSGPACalculator";
import { SeoCGPAToPercentage } from "@/components/seo/SeoCGPAToPercentage";
import { SeoGradeCalculator } from "@/components/seo/SeoGradeCalculator";
import { SeoGradingSystem } from "@/components/seo/SeoGradingSystem";
import { SeoPercentageToCGPA } from "@/components/seo/SeoPercentageToCGPA";
import { SeoSGPAToCGPA } from "@/components/seo/SeoSGPAToCGPA";
import { SeoGPAToCGPA } from "@/components/seo/SeoGPAToCGPA";
import { SeoMarksToCGPA } from "@/components/seo/SeoMarksToCGPA";
import { SeoGuide } from "@/components/seo/SeoGuide";
import { guideTypes, guides, GuideType } from "@/lib/guides/content";
import { StructuredData } from "@/components/seo/StructuredData";
import { RelatedLinks } from "@/components/seo/RelatedLinks";

type PageType = 
  "cgpa-calculator" | 
  "sgpa-calculator" | 
  "cgpa-to-percentage" | 
  "percentage-to-cgpa-calculator" |
  "sgpa-to-cgpa-calculator" |
  "gpa-to-cgpa-calculator" |
  "marks-to-cgpa-calculator" |
  "grade-calculator" | 
  "grading-system";

const pageTypes: PageType[] = [
  "cgpa-calculator",
  "sgpa-calculator",
  "cgpa-to-percentage",
  "percentage-to-cgpa-calculator",
  "sgpa-to-cgpa-calculator",
  "gpa-to-cgpa-calculator",
  "marks-to-cgpa-calculator",
  "grade-calculator",
  "grading-system"
];

export async function generateStaticParams() {
  const paths: { slug: string }[] = [];
  
  // Generic Routes (no university prefix)
  for (const type of pageTypes) {
    paths.push({ slug: type });
  }

  // Guide Routes
  for (const guide of guideTypes) {
    paths.push({ slug: guide });
  }

  // University specific routes - Limit to top 100 to prevent OOM
  // Remaining 9,900 universities will be generated On-Demand (dynamicParams = true)
  const topUniversities = universities.slice(0, 100);
  for (const uni of topUniversities) {
    const slugPrefix = uni.shortName ? uni.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : uni.id;
    for (const type of pageTypes) {
      // Use the shortName for cleaner URLs (e.g. vit-cgpa-calculator)
      paths.push({ slug: `${slugPrefix}-${type}` });
      // Also generate the ID-based one just in case
      if (slugPrefix !== uni.id) {
        paths.push({ slug: `${uni.id}-${type}` });
      }
    }
  }
  return paths;
}

function parseSlug(slug: string): { uniId: string; pageType: PageType | GuideType; isGuide?: boolean } | null {
  // First, check if it's an educational guide
  if ((guideTypes as string[]).includes(slug)) {
    return { uniId: 'general', pageType: slug as GuideType, isGuide: true };
  }

  // Check exact matches for generic tools
  for (const type of pageTypes) {
    if (slug === type) {
      return { uniId: 'general', pageType: type };
    }
  }

  // Then, check suffix matches, sorting by length descending to prevent overlapping matches
  const sortedTypes = [...pageTypes].sort((a, b) => b.length - a.length);
  for (const type of sortedTypes) {
    if (slug.endsWith(`-${type}`)) {
      const uniId = slug.replace(`-${type}`, '');
      return { uniId, pageType: type };
    }
  }
  
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const parsed = parseSlug(resolvedParams.slug);
  if (!parsed) return {};
  
  const uni = parsed.uniId === 'general' ? generalUniversity : getUniversityBySlug(parsed.uniId);
  if (!uni) return {};

  const isGeneric = parsed.uniId === 'general';
  const prefix = isGeneric ? '' : `${uni.shortName} `;
  const nirfText = uni.nirfRanking ? ` (NIRF 2025: ${uni.nirfRanking.includes('-') ? uni.nirfRanking + ' Band' : 'Rank #' + uni.nirfRanking})` : '';
  const nameDesc = isGeneric ? 'all universities' : `${uni.name}${nirfText}`;

  if (parsed.isGuide) {
    const guideContent = guides[parsed.pageType as GuideType];
    return {
      title: guideContent.title,
      description: guideContent.description,
      keywords: [guideContent.title.toLowerCase().replace(/ /g, ','), "guide", "education", "cgpa", "sgpa"],
      alternates: {
        canonical: `https://gradeflow.app/${resolvedParams.slug}`
      },
      openGraph: {
        title: guideContent.title,
        description: guideContent.description,
        type: "article",
        url: `https://gradeflow.app/${resolvedParams.slug}`
      },
      twitter: {
        card: "summary_large_image",
        title: guideContent.title,
        description: guideContent.description,
      }
    };
  }

  let title = "";
  let description = "";

  switch (parsed.pageType) {
    case "cgpa-calculator":
      title = `${prefix}CGPA Calculator | Fast & Accurate ${isGeneric ? 'Online' : `for ${uni.shortName}`}${uni.nirfRanking ? ` - NIRF 2025 ${uni.nirfRanking.includes('-') ? 'Band ' + uni.nirfRanking : '#' + uni.nirfRanking}` : ''}`;
      description = `Calculate your ${prefix}CGPA instantly with our official grading scale tool. Free, online CGPA calculator tailored for ${nameDesc} students.`;
      break;
    case "sgpa-calculator":
      title = `${prefix}SGPA Calculator | Semester Grade Point Average${uni.nirfRanking ? ` (NIRF 2025 ${uni.nirfRanking.includes('-') ? 'Band ' + uni.nirfRanking : '#' + uni.nirfRanking})` : ''}`;
      description = `Calculate your ${prefix}SGPA accurately using the official credit system and grading formula for ${nameDesc}.`;
      break;
    case "cgpa-to-percentage":
      title = `${prefix}CGPA to Percentage Converter | Official Formula`;
      description = `Convert your ${prefix}CGPA to percentage using the official ${nameDesc} conversion formula.`;
      break;
    case "percentage-to-cgpa-calculator":
      title = `${prefix}Percentage to CGPA Calculator | Fast Converter`;
      description = `Convert your percentage into a precise ${prefix}CGPA using the official ${nameDesc} formula. Accurate percentage to CGPA converter.`;
      break;
    case "sgpa-to-cgpa-calculator":
      title = `${prefix}SGPA to CGPA Calculator | Semester Average`;
      description = `Calculate your overall ${prefix}CGPA from your semester SGPAs instantly. Easy to use SGPA to CGPA calculator for ${nameDesc}.`;
      break;
    case "gpa-to-cgpa-calculator":
      title = `${prefix}GPA to CGPA Calculator | Grade Point Converter`;
      description = `Convert GPA to ${prefix}CGPA seamlessly. Use our free tool to convert your grade point average to a standard 10-point CGPA.`;
      break;
    case "marks-to-cgpa-calculator":
      title = `${prefix}Marks to CGPA Calculator | Subject Score to Grade`;
      description = `Enter your subject marks to calculate your ${prefix}CGPA, SGPA, and Grades instantly based on standard grading scales.`;
      break;
    case "grade-calculator":
      title = `${prefix}Grade Calculator & Points Table`;
      description = `Check ${prefix}grading system, letter grades, and equivalent grade points. Accurate grade calculator for ${nameDesc}.`;
      break;
    case "grading-system":
      title = `${prefix}Grading System & Rules Explained (${new Date().getFullYear()})`;
      description = `Understand the complete ${prefix}grading system, passing marks, regulations, and SGPA/CGPA calculation rules for ${nameDesc}.`;
      break;
  }

  const slugPrefix = uni.shortName ? uni.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : uni.id;
  const canonicalSlug = isGeneric ? resolvedParams.slug : `${slugPrefix}-${parsed.pageType}`;

  return {
    title,
    description,
    keywords: [uni.shortName, "calculator", parsed.pageType.replace(/-/g, ' '), "university", "grading system", "CGPA", "SGPA", "Percentage"],
    alternates: {
      canonical: `https://gradeflow.app/${canonicalSlug}`
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://gradeflow.app/${canonicalSlug}`
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    }
  };
}

export default async function SEOUniversityPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const parsed = parseSlug(resolvedParams.slug);
  if (!parsed) return notFound();

  const university = parsed.uniId === 'general' ? generalUniversity : getUniversityBySlug(parsed.uniId);
  if (!university) return notFound();

  const slugPrefix = university.shortName ? university.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-') : university.id;
  const canonicalSlug = parsed.uniId === 'general' ? resolvedParams.slug : `${slugPrefix}-${parsed.pageType}`;
  const url = `https://gradeflow.app/${canonicalSlug}`;
  
  const schema = <StructuredData university={university} pageType={parsed.pageType} url={url} isGuide={parsed.isGuide} />;
  const relatedLinks = parsed.isGuide ? null : <RelatedLinks university={university} currentPage={parsed.pageType} />;

  if (parsed.isGuide) {
    const guideContent = guides[parsed.pageType as GuideType];
    return (
      <>
        {schema}
        <SeoGuide guide={guideContent} slug={resolvedParams.slug} />
      </>
    );
  }

  let content;
  switch (parsed.pageType as PageType) {
    case "cgpa-calculator":
      content = <SeoCGPACalculator university={university} />; break;
    case "sgpa-calculator":
      content = <SeoSGPACalculator university={university} />; break;
    case "cgpa-to-percentage":
      content = <SeoCGPAToPercentage university={university} />; break;
    case "percentage-to-cgpa-calculator":
      content = <SeoPercentageToCGPA university={university} />; break;
    case "sgpa-to-cgpa-calculator":
      content = <SeoSGPAToCGPA university={university} />; break;
    case "gpa-to-cgpa-calculator":
      content = <SeoGPAToCGPA university={university} />; break;
    case "marks-to-cgpa-calculator":
      content = <SeoMarksToCGPA university={university} />; break;
    case "grade-calculator":
      content = <SeoGradeCalculator university={university} />; break;
    case "grading-system":
      content = <SeoGradingSystem university={university} />; break;
    default:
      return notFound();
  }

  return (
    <>
      {schema}
      {content}
      {relatedLinks}
    </>
  );
}
