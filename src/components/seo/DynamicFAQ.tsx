import { University } from "@/lib/universities/types";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import React from "react";

export function DynamicFAQ({ university, pageType }: { university: University, pageType: string }) {
  const isGeneric = university.id === "general";
  const contextualFaqs = [];
  
  if (pageType === "cgpa-calculator") {
    contextualFaqs.push({
      question: `How do I calculate my CGPA for ${university.shortName}?`,
      answerText: `To calculate your CGPA at ${university.name}, you need to multiply the grade points obtained in each subject by their respective credits, sum them up, and divide by the total credits across all semesters. Our automated ${university.shortName} CGPA Calculator does this for you instantly based on official regulations.`,
      answerNode: <>To calculate your CGPA at {university.name}, you need to multiply the grade points obtained in each subject by their respective credits, sum them up, and divide by the total credits across all semesters. Our automated {university.shortName} CGPA Calculator does this for you instantly based on official regulations.</>
    });
    contextualFaqs.push({
      question: `Is this CGPA Calculator accurate for ${university.name}?`,
      answerText: `Yes, this calculator is specifically designed and pre-configured with the official grading scale and rules for ${university.name} (${university.shortName}).`,
      answerNode: <>Yes, this calculator is specifically designed and pre-configured with the official grading scale and rules for {university.name} ({university.shortName}).</>
    });
  } else if (pageType === "sgpa-calculator") {
    contextualFaqs.push({
      question: `How is SGPA calculated at ${university.shortName}?`,
      answerText: `SGPA (Semester Grade Point Average) at ${university.name} is calculated by dividing the total credit points earned in a semester by the total credits registered in that semester.`,
      answerNode: <>SGPA (Semester Grade Point Average) at {university.name} is calculated by dividing the total credit points earned in a semester by the total credits registered in that semester.</>
    });
  } else if (pageType === "cgpa-to-percentage") {
    contextualFaqs.push({
      question: `How does ${university.shortName} convert CGPA to percentage?`,
      answerText: `The official conversion formula for ${university.name} varies by regulation. Our converter automatically applies the correct mathematical formula to generate an accurate percentage.`,
      answerNode: <>The official conversion formula for {university.name} varies by regulation. Our converter automatically applies the correct mathematical formula to generate an accurate percentage.</>
    });
    contextualFaqs.push({
      question: `Do employers accept this percentage conversion?`,
      answerText: `Yes, employers generally accept the percentage calculated using the university's official conversion formula. It is recommended to attach a copy of the official rule if required.`,
      answerNode: <>Yes, employers generally accept the percentage calculated using the university's official conversion formula. It is recommended to attach a copy of the official rule if required.</>
    });
  } else if (pageType === "grade-calculator") {
    contextualFaqs.push({
      question: `What are the official grades at ${university.shortName}?`,
      answerText: `The official grades and their corresponding points are governed by ${university.name}'s academic regulations. Use our Grade Calculator to see the specific mapping for your score.`,
      answerNode: <>The official grades and their corresponding points are governed by {university.name}'s academic regulations. Use our Grade Calculator to see the specific mapping for your score.</>
    });
  } else if (pageType === "grading-system") {
    contextualFaqs.push({
      question: `What is the grading system for ${university.shortName}?`,
      answerText: `${university.name} follows a structured credit-based grading system. You earn letter grades based on your marks, which are then converted to grade points to calculate SGPA and CGPA.`,
      answerNode: <>{university.name} follows a structured credit-based grading system. You earn letter grades based on your marks, which are then converted to grade points to calculate SGPA and CGPA.</>
    });
    contextualFaqs.push({
      question: `What is the minimum passing grade at ${university.shortName}?`,
      answerText: `The passing criteria depends on the specific regulation year. Review the grading tables above for exact threshold marks and minimum passing requirements.`,
      answerNode: <>The passing criteria depends on the specific regulation year. Review the grading tables above for exact threshold marks and minimum passing requirements.</>
    });
  } else if (pageType === "percentage-to-cgpa-calculator") {
    contextualFaqs.push({
      question: `How do I convert percentage to CGPA for ${university.shortName}?`,
      answerText: `To convert your percentage back to CGPA, you must reverse the official conversion formula for ${university.name}. Our tool automatically calculates this for you.`,
      answerNode: <>To convert your percentage back to CGPA, you must reverse the official conversion formula for {university.name}. Our tool automatically calculates this for you.</>
    });
  } else if (pageType === "sgpa-to-cgpa-calculator" || pageType === "gpa-to-cgpa-calculator") {
    const isGpa = pageType === "gpa-to-cgpa-calculator";
    contextualFaqs.push({
      question: `How is CGPA calculated from ${isGpa ? 'GPA' : 'SGPA'} at ${university.shortName}?`,
      answerText: `Your cumulative CGPA is the weighted average of your semester ${isGpa ? 'GPAs' : 'SGPAs'}. You multiply each semester's ${isGpa ? 'GPA' : 'SGPA'} by its total credits, sum them up, and divide by the total credits earned.`,
      answerNode: <>Your cumulative CGPA is the weighted average of your semester {isGpa ? 'GPAs' : 'SGPAs'}. You multiply each semester's {isGpa ? 'GPA' : 'SGPA'} by its total credits, sum them up, and divide by the total credits earned.</>
    });
  } else if (pageType === "marks-to-cgpa-calculator") {
    contextualFaqs.push({
      question: `How are marks converted to CGPA at ${university.shortName}?`,
      answerText: `First, your subject marks out of 100 are mapped to a letter grade based on ${university.name}'s grading scale. Each grade corresponds to specific grade points, which are then used to calculate your SGPA and overall CGPA.`,
      answerNode: <>First, your subject marks out of 100 are mapped to a letter grade based on {university.name}'s grading scale. Each grade corresponds to specific grade points, which are then used to calculate your SGPA and overall CGPA.</>
    });
  }

  if (contextualFaqs.length === 0 && !isGeneric) {
    contextualFaqs.push({
      question: `Where is ${university.name} located?`,
      answerText: `${university.name} (${university.shortName}) is located in ${university.location}.`,
      answerNode: <>{university.name} ({university.shortName}) is located in {university.location}.</>
    });
  }

  const comprehensiveFaqs = [
    {
      question: "What is a CGPA Calculator?",
      answerText: "A CGPA Calculator is a tool used to calculate your Cumulative Grade Point Average based on semester grades, subject grades, and credits. It helps students track academic performance and estimate overall results.",
      answerNode: <>A CGPA Calculator is a tool used to calculate your Cumulative Grade Point Average based on semester grades, subject grades, and credits. It helps students track academic performance and estimate overall results.</>
    },
    {
      question: "How do I calculate CGPA?",
      answerText: "CGPA is calculated by dividing the total weighted grade points earned by the total credits completed. Formula: CGPA = Total Grade Points ÷ Total Credits. The calculator automatically performs this calculation when you enter grades and credits.",
      answerNode: (
        <>
          <p className="mb-2">CGPA is calculated by dividing the total weighted grade points earned by the total credits completed.</p>
          <p className="mb-2 font-semibold">Formula:</p>
          <p className="bg-surface-container-high p-2 rounded mb-2 font-mono text-sm w-fit">CGPA = Total Grade Points ÷ Total Credits</p>
          <p>The calculator automatically performs this calculation when you enter grades and credits.</p>
        </>
      )
    },
    {
      question: "How to Calculate CGPA from SGPA?",
      answerText: "Enter your semester SGPAs and the corresponding credits for each semester. The calculator will compute the weighted average and generate your cumulative CGPA.",
      answerNode: <>Enter your semester SGPAs and the corresponding credits for each semester. The calculator will compute the weighted average and generate your cumulative CGPA.</>
    },
    {
      question: "How to Convert SGPA into CGPA?",
      answerText: "CGPA is usually calculated by taking the weighted average of all semester SGPAs based on credit values. Use the SGPA to CGPA Calculator to perform this automatically.",
      answerNode: (
        <>
          <p className="mb-2">CGPA is usually calculated by taking the weighted average of all semester SGPAs based on credit values.</p>
          <p>Use the <Link href="/sgpa-to-cgpa-calculator" className="text-primary font-medium hover:underline">SGPA to CGPA Calculator</Link> to perform this automatically.</p>
        </>
      )
    },
    {
      question: "How to Convert CGPA to Percentage?",
      answerText: "Many universities use a conversion formula to estimate percentage from CGPA. A common formula is: Percentage = CGPA × 10. However, some universities use different formulas, so always check your university regulations.",
      answerNode: (
        <>
          <p className="mb-2">Many universities use a conversion formula to estimate percentage from CGPA.</p>
          <p className="mb-2">A common formula is:</p>
          <p className="bg-surface-container-high p-2 rounded mb-2 font-mono text-sm w-fit">Percentage = CGPA × 10</p>
          <p>However, some universities use different formulas, so always check your university regulations or use our <Link href="/cgpa-to-percentage" className="text-primary font-medium hover:underline">CGPA to Percentage Calculator</Link>.</p>
        </>
      )
    },
    {
      question: "How to Convert Percentage to CGPA?",
      answerText: "Percentage can be converted into CGPA using your university's approved conversion formula. For example: CGPA = Percentage ÷ 10. Some universities may use different conversion factors. Use the Percentage to CGPA Calculator for accurate results.",
      answerNode: (
        <>
          <p className="mb-2">Percentage can be converted into CGPA using your university's approved conversion formula.</p>
          <p className="mb-2">For example:</p>
          <p className="bg-surface-container-high p-2 rounded mb-2 font-mono text-sm w-fit">CGPA = Percentage ÷ 10</p>
          <p className="mb-2">Some universities may use different conversion factors.</p>
          <p>Use the <Link href="/percentage-to-cgpa-calculator" className="text-primary font-medium hover:underline">Percentage to CGPA Calculator</Link> for accurate results.</p>
        </>
      )
    },
    {
      question: "How to Convert CGPA into Marks?",
      answerText: "There is no universal formula to convert CGPA directly into marks. Marks depend on: University regulations, Grading system, and Credit structure. The Marks to CGPA Calculator provides estimated results where official conversion formulas are unavailable.",
      answerNode: (
        <>
          <p className="mb-2">There is no universal formula to convert CGPA directly into marks.</p>
          <p className="mb-2">Marks depend on:</p>
          <ul className="list-disc pl-5 mb-2 space-y-1">
            <li>University regulations</li>
            <li>Grading system</li>
            <li>Credit structure</li>
          </ul>
          <p>The <Link href="/marks-to-cgpa-calculator" className="text-primary font-medium hover:underline">Marks to CGPA Calculator</Link> provides estimated results where official conversion formulas are unavailable.</p>
        </>
      )
    },
    {
      question: "What is the Multiplying Factor in CGPA Calculation?",
      answerText: "The multiplying factor is the number used by a university to convert CGPA into percentage. Examples: 10, 9.5, 9.25, Other university-specific values. The multiplying factor varies between institutions.",
      answerNode: (
        <>
          <p className="mb-2">The multiplying factor is the number used by a university to convert CGPA into percentage.</p>
          <p className="mb-2">Examples:</p>
          <ul className="list-disc pl-5 mb-2 space-y-1">
            <li>10</li>
            <li>9.5</li>
            <li>9.25</li>
            <li>Other university-specific values</li>
          </ul>
          <p>The multiplying factor varies between institutions.</p>
        </>
      )
    },
    {
      question: "What is 75% as CGPA?",
      answerText: "Using the common conversion formula: CGPA = Percentage ÷ 10, 75% is approximately: CGPA = 7.5. The exact value may differ depending on university regulations.",
      answerNode: (
        <>
          <p className="mb-2">Using the common conversion formula:</p>
          <p className="bg-surface-container-high p-2 rounded mb-2 font-mono text-sm w-fit">CGPA = Percentage ÷ 10</p>
          <p className="mb-2">75% is approximately:</p>
          <p className="bg-surface-container-high p-2 rounded mb-2 font-mono text-sm w-fit">CGPA = 7.5</p>
          <p>The exact value may differ depending on university regulations.</p>
        </>
      )
    },
    {
      question: "What is a 3.0 GPA in CGPA?",
      answerText: "A 3.0 GPA on a 4-point scale is approximately: 7.5 CGPA on a 10-point scale. The exact conversion depends on the grading system being used. Use the GPA to CGPA Calculator for precise conversion.",
      answerNode: (
        <>
          <p className="mb-2">A 3.0 GPA on a 4-point scale is approximately:</p>
          <p className="bg-surface-container-high p-2 rounded mb-2 font-mono text-sm w-fit">7.5 CGPA on a 10-point scale</p>
          <p className="mb-2">The exact conversion depends on the grading system being used.</p>
          <p>Use the <Link href="/gpa-to-cgpa-calculator" className="text-primary font-medium hover:underline">GPA to CGPA Calculator</Link> for precise conversion.</p>
        </>
      )
    },
    {
      question: "Is CGPA More Important Than Percentage?",
      answerText: "Both are important. Many universities and employers accept CGPA directly, while some convert CGPA into percentage during admissions or recruitment processes.",
      answerNode: <>Both are important. Many universities and employers accept CGPA directly, while some convert CGPA into percentage during admissions or recruitment processes.</>
    },
    {
      question: "Can I Calculate CGPA Without Credits?",
      answerText: "For accurate results, credits should always be included. Ignoring credits can produce incorrect CGPA values because most universities use credit-weighted calculations.",
      answerNode: <>For accurate results, credits should always be included. Ignoring credits can produce incorrect CGPA values because most universities use credit-weighted calculations.</>
    }
  ];

  const faqs = [...contextualFaqs, ...comprehensiveFaqs];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answerText
      }
    }))
  };

  return (
    <div className="mt-16 pt-12 border-t border-outline-variant/20 w-full max-w-4xl mx-auto">
      <Script
        id={`faq-${pageType}-${university.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-on-surface">Frequently Asked Questions</h2>
        <p className="text-body-lg text-on-surface-variant">Everything you need to know about calculating and converting your grades.</p>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="group rounded-2xl bg-surface-container-lowest border border-outline-variant/30 hover:border-outline-variant transition-colors shadow-sm [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
              <h3 className="text-title-md md:text-title-lg font-semibold text-on-surface pr-4 group-hover:text-primary transition-colors">
                {faq.question}
              </h3>
              <span className="shrink-0 transition duration-300 group-open:rotate-180 bg-surface-container p-2 rounded-full text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary">
                <ChevronDown size={20} />
              </span>
            </summary>
            <div className="px-5 pb-6 text-body-md md:text-body-lg text-on-surface-variant leading-relaxed animate-in slide-in-from-top-2 fade-in duration-200">
              {faq.answerNode}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
