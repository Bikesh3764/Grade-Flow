import React from "react";
import Link from "next/link";
import { DynamicFAQ } from "@/components/seo/DynamicFAQ";
import { generalUniversity } from "@/lib/universities/registry";

export type GuideType = 
  | "what-is-cgpa"
  | "how-to-calculate-cgpa"
  | "how-to-calculate-sgpa"
  | "cgpa-vs-gpa"
  | "cgpa-to-percentage-formula"
  | "percentage-to-cgpa-formula"
  | "what-is-sgpa"
  | "is-8-cgpa-good"
  | "is-9-cgpa-good"
  | "cgpa-for-placements"
  | "cgpa-for-higher-studies";

export const guideTypes: GuideType[] = [
  "what-is-cgpa",
  "how-to-calculate-cgpa",
  "how-to-calculate-sgpa",
  "cgpa-vs-gpa",
  "cgpa-to-percentage-formula",
  "percentage-to-cgpa-formula",
  "what-is-sgpa",
  "is-8-cgpa-good",
  "is-9-cgpa-good",
  "cgpa-for-placements",
  "cgpa-for-higher-studies"
];

export interface GuideContent {
  title: string;
  description: string;
  content: React.ReactNode;
}

export const guides: Record<GuideType, GuideContent> = {
  "what-is-cgpa": {
    title: "What is CGPA? Cumulative Grade Point Average Explained",
    description: "Learn what CGPA is, why it matters, and how it differs from SGPA and percentage systems used by global universities.",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Understanding CGPA</h2>
        <p><strong>CGPA (Cumulative Grade Point Average)</strong> is a measure of a student's overall academic performance across all completed semesters in a degree program.</p>
        <p>Unlike SGPA (Semester Grade Point Average) which only measures performance in a single semester, CGPA provides a comprehensive average of your entire academic journey.</p>
        
        <h3 className="text-xl font-semibold mt-8">Why is CGPA Important?</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Placements & Jobs:</strong> Many top companies set a strict CGPA cutoff (typically 7.0, 8.0, or 9.0) for campus recruitment.</li>
          <li><strong>Higher Studies:</strong> Universities abroad evaluate your application based on your overall CGPA.</li>
          <li><strong>Scholarships:</strong> Academic scholarships often require maintaining a minimum CGPA.</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-8">How is it different from Percentage?</h3>
        <p>While percentages are measured out of 100, CGPA is typically measured on a 10-point scale (or 4.0 scale in the US). A high CGPA does not always mathematically equate to the exact same percentage, as most universities apply a specific conversion formula (e.g., CGPA × 9.5 or CGPA × 10).</p>
      </div>
    )
  },
  "how-to-calculate-cgpa": {
    title: "How to Calculate CGPA (With Formula & Examples)",
    description: "A complete guide on calculating your CGPA from SGPA and credits, complete with mathematical formulas and real-world examples.",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">The CGPA Formula</h2>
        <p>To calculate your CGPA, you cannot simply average your SGPAs. You must calculate the weighted average based on the number of credits completed in each semester.</p>
        
        <div className="bg-surface-container p-6 rounded-xl font-mono text-sm overflow-x-auto my-6">
          <p>CGPA = (SGPA₁ × Credits₁ + SGPA₂ × Credits₂ + ... + SGPAₙ × Creditsₙ) / (Total Credits)</p>
        </div>

        <h3 className="text-xl font-semibold mt-8">Step-by-Step Example</h3>
        <p>Let's say you have completed two semesters:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Semester 1:</strong> SGPA = 8.5, Total Credits = 20</li>
          <li><strong>Semester 2:</strong> SGPA = 9.0, Total Credits = 22</li>
        </ul>
        <p>1. Multiply SGPA by Credits for each semester:</p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Sem 1: 8.5 × 20 = 170</li>
          <li>Sem 2: 9.0 × 22 = 198</li>
        </ul>
        <p>2. Sum the values and divide by total credits (20 + 22 = 42):</p>
        <p className="font-mono bg-surface-container-low p-2 rounded w-fit">(170 + 198) / 42 = 368 / 42 = <strong>8.76 CGPA</strong></p>

        <p className="mt-8">Don't want to do the math manually? Use our <Link href="/cgpa-calculator" className="text-primary hover:underline">CGPA Calculator</Link> to get instant results.</p>
      </div>
    )
  },
  "how-to-calculate-sgpa": {
    title: "How to Calculate SGPA (Semester Grade Point Average)",
    description: "Learn how to calculate your SGPA from subject marks and credits using standard university grading scales.",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">The SGPA Formula</h2>
        <p>SGPA represents your performance in a single semester. It is calculated by multiplying the grade points earned in each subject by the credits assigned to that subject.</p>
        
        <div className="bg-surface-container p-6 rounded-xl font-mono text-sm overflow-x-auto my-6">
          <p>SGPA = Σ (Subject Grade Points × Subject Credits) / Σ (Total Credits in Semester)</p>
        </div>

        <h3 className="text-xl font-semibold mt-8">How Grade Points Work</h3>
        <p>Most universities use letter grades (O, A+, A, B+, B) which map to specific numbers (10, 9, 8, 7, 6).</p>
        
        <h3 className="text-xl font-semibold mt-8">Example Calculation</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-outline-variant/30 mt-4">
            <thead>
              <tr className="bg-surface-container-low">
                <th className="p-3 border border-outline-variant/30">Subject</th>
                <th className="p-3 border border-outline-variant/30">Credits</th>
                <th className="p-3 border border-outline-variant/30">Grade</th>
                <th className="p-3 border border-outline-variant/30">Points</th>
                <th className="p-3 border border-outline-variant/30">Weighted (Credits × Points)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-outline-variant/30">Math</td>
                <td className="p-3 border border-outline-variant/30">4</td>
                <td className="p-3 border border-outline-variant/30">A+</td>
                <td className="p-3 border border-outline-variant/30">9</td>
                <td className="p-3 border border-outline-variant/30">36</td>
              </tr>
              <tr>
                <td className="p-3 border border-outline-variant/30">Physics</td>
                <td className="p-3 border border-outline-variant/30">3</td>
                <td className="p-3 border border-outline-variant/30">O</td>
                <td className="p-3 border border-outline-variant/30">10</td>
                <td className="p-3 border border-outline-variant/30">30</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4">Total Weighted Points: 66. Total Credits: 7. SGPA = 66 / 7 = <strong>9.42</strong></p>

        <p className="mt-8">Use our <Link href="/sgpa-calculator" className="text-primary hover:underline">SGPA Calculator</Link> to calculate this automatically.</p>
      </div>
    )
  },
  "cgpa-vs-gpa": {
    title: "CGPA vs GPA: Key Differences Explained",
    description: "Understand the difference between the 10-point CGPA system and the 4.0 GPA system used internationally.",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">What is the Difference?</h2>
        <p>While both metrics measure academic performance, they use completely different scales and are popular in different parts of the world.</p>
        
        <h3 className="text-xl font-semibold mt-8">CGPA (Cumulative Grade Point Average)</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Scale:</strong> Typically out of 10.0.</li>
          <li><strong>Usage:</strong> Widely used in India, parts of Asia, and some European countries.</li>
          <li><strong>Calculation:</strong> Based on 10-point grade mappings (O=10, A+=9, etc).</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-8">GPA (Grade Point Average)</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Scale:</strong> Typically out of 4.0.</li>
          <li><strong>Usage:</strong> Standard in the United States, Canada, and many international universities.</li>
          <li><strong>Calculation:</strong> Based on 4-point grade mappings (A=4.0, B=3.0, etc).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8">Converting Between Them</h3>
        <p>Directly converting CGPA to GPA is not an exact science because the class difficulty and scoring methodologies vary. However, many universities accept an approximate conversion factor or use credential evaluators like WES.</p>
        <p>Try our <Link href="/gpa-to-cgpa-calculator" className="text-primary hover:underline">GPA to CGPA Converter</Link> to estimate your equivalent score.</p>
      </div>
    )
  },
  "cgpa-to-percentage-formula": {
    title: "CGPA to Percentage Formulas Explained",
    description: "Learn the exact mathematical formulas used by top universities to convert a 10-point CGPA into a 100-point percentage.",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">How Universities Convert CGPA to Percentage</h2>
        <p>There is no universal standard for converting CGPA to Percentage. It strictly depends on the university's academic regulations. Here are the most common formulas:</p>
        
        <h3 className="text-xl font-semibold mt-8">1. The Absolute Multiplier (× 10)</h3>
        <div className="bg-surface-container p-4 rounded-xl font-mono text-sm my-4">
          <p>Percentage = CGPA × 10</p>
        </div>
        <p>Used by universities like VIT and SRM. An 8.5 CGPA becomes 85%.</p>
        
        <h3 className="text-xl font-semibold mt-8">2. The 9.5 Multiplier</h3>
        <div className="bg-surface-container p-4 rounded-xl font-mono text-sm my-4">
          <p>Percentage = CGPA × 9.5</p>
        </div>
        <p>Formerly the standard CBSE formula, still used by various state universities.</p>
        
        <h3 className="text-xl font-semibold mt-8">3. The Subtraction Multiplier</h3>
        <div className="bg-surface-container p-4 rounded-xl font-mono text-sm my-4">
          <p>Percentage = (CGPA - 0.75) × 10</p>
        </div>
        <p>Used by universities like Mumbai University and AKTU. An 8.5 CGPA becomes 77.5%.</p>

        <p className="mt-8">To find your exact percentage without memorizing formulas, use the <Link href="/cgpa-to-percentage" className="text-primary hover:underline">CGPA to Percentage Converter</Link>.</p>
      </div>
    )
  },
  "percentage-to-cgpa-formula": {
    title: "Percentage to CGPA Conversion Formulas",
    description: "Learn how to reverse-calculate your CGPA from your total percentage using standard conversion formulas.",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Converting Percentage back to CGPA</h2>
        <p>If you have your final degree percentage and need to fill out a form asking for your CGPA out of 10, you'll need to reverse the standard conversion formulas.</p>
        
        <h3 className="text-xl font-semibold mt-8">Common Reverse Formulas:</h3>
        
        <div className="space-y-4 my-6">
          <div className="bg-surface-container p-4 rounded-xl">
            <p className="font-semibold text-sm text-outline mb-2">Division by 10 (Most Common)</p>
            <p className="font-mono text-sm">CGPA = Percentage ÷ 10</p>
          </div>
          <div className="bg-surface-container p-4 rounded-xl">
            <p className="font-semibold text-sm text-outline mb-2">Division by 9.5</p>
            <p className="font-mono text-sm">CGPA = Percentage ÷ 9.5</p>
          </div>
          <div className="bg-surface-container p-4 rounded-xl">
            <p className="font-semibold text-sm text-outline mb-2">Addition Formula (AKTU/Mumbai Univ)</p>
            <p className="font-mono text-sm">CGPA = (Percentage ÷ 10) + 0.75</p>
          </div>
        </div>

        <p className="mt-8">Try the automated <Link href="/percentage-to-cgpa-calculator" className="text-primary hover:underline">Percentage to CGPA Calculator</Link> to ensure you don't make any mathematical errors on important applications.</p>
      </div>
    )
  },
  "what-is-sgpa": {
    title: "What is SGPA? Semester Grade Point Average",
    description: "Understand SGPA, how it impacts your academic record, and how it differs from your cumulative CGPA.",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Understanding SGPA</h2>
        <p><strong>SGPA (Semester Grade Point Average)</strong> is a measure of your academic performance strictly within a single semester or term.</p>
        
        <h3 className="text-xl font-semibold mt-8">Why SGPA Matters</h3>
        <p>SGPA is critical because your overall CGPA is just a weighted average of your SGPAs. Scoring a high SGPA in semesters with heavy credit loads will significantly boost your CGPA.</p>
        
        <h3 className="text-xl font-semibold mt-8">How SGPA and CGPA Connect</h3>
        <p>At the end of your first semester, your SGPA and CGPA are identical. By your second semester, your CGPA is the average of Semester 1 and Semester 2's SGPAs (weighted by credits). By your 8th semester, a single SGPA has a much smaller impact on your massive, accumulated CGPA.</p>

        <p className="mt-8">Use the <Link href="/sgpa-to-cgpa-calculator" className="text-primary hover:underline">SGPA to CGPA Calculator</Link> to see how your next semester will impact your final score.</p>
      </div>
    )
  },
  "is-8-cgpa-good": {
    title: "Is an 8.0 CGPA Good? Placements & Analysis",
    description: "Detailed analysis of an 8.0 CGPA. Learn if it's enough for campus placements, higher studies, and top tier companies.",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">The Verdict: Is 8.0 Good?</h2>
        <p>Yes, an 8.0 CGPA (out of 10) is generally considered a <strong>very good and safe score</strong> for the vast majority of engineering and degree programs.</p>
        
        <h3 className="text-xl font-semibold mt-8">Campus Placements</h3>
        <p>In most Indian institutions, the standard cutoff for tier-1 companies (like TCS, Infosys, Wipro, Cognizant) is 60% or 6.0/6.5 CGPA. For product-based companies and "Dream/Super Dream" offers (like Microsoft, Amazon, Google), the cutoff is usually strictly set at <strong>7.0 or 8.0 CGPA</strong>.</p>
        <p>Having an 8.0+ ensures you are eligible to sit for 95% of companies visiting your campus.</p>
        
        <h3 className="text-xl font-semibold mt-8">Higher Studies (MS/MBA)</h3>
        <p>An 8.0 CGPA is highly competitive for Master's programs in the US, UK, and Germany. It roughly translates to a 3.2 - 3.4 GPA on a 4.0 scale, which clears the cutoff for many top 100 global universities.</p>

        <p className="mt-8">Want to increase it to a 9.0? Use our <Link href="/cgpa-calculator" className="text-primary hover:underline">Target CGPA Predictor</Link> to see what grades you need next semester.</p>
      </div>
    )
  },
  "is-9-cgpa-good": {
    title: "Is a 9.0 CGPA Good? Elite Academic Performance",
    description: "Find out why a 9.0+ CGPA puts you in the top tier of students and how it impacts scholarships and super-dream placements.",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">The Verdict: Is 9.0 Good?</h2>
        <p>A 9.0 CGPA (out of 10) is considered an <strong>outstanding and elite score</strong>. It places you in the top 5-10% of your class at most universities.</p>
        
        <h3 className="text-xl font-semibold mt-8">Placements & Shortlisting</h3>
        <p>With a 9.0 CGPA, you will never face a cutoff issue for campus placements. Furthermore, in scenarios where hundreds of students pass an aptitude test, companies frequently use CGPA as a tie-breaker. A 9.0+ CGPA essentially guarantees your resume will be shortlisted for interviews.</p>
        
        <h3 className="text-xl font-semibold mt-8">Scholarships & Ivy League</h3>
        <p>If you are applying to Ivy League universities or top 20 global programs, an 8.5 to 9.0+ CGPA is often the unwritten baseline requirement. It also makes you highly eligible for merit-based scholarships and Research Assistant (RA) positions.</p>
      </div>
    )
  },
  "cgpa-for-placements": {
    title: "Minimum CGPA Required for Campus Placements",
    description: "A comprehensive guide on the minimum CGPA cutoffs required by IT service companies, product companies, and FAANG.",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">What is the Ideal CGPA for Placements?</h2>
        <p>While skills and interview performance matter most, your CGPA is the primary filter used by HR departments to shortlist thousands of resumes.</p>
        
        <h3 className="text-xl font-semibold mt-8">Standard Service-Based Companies</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Companies:</strong> TCS, Infosys, Wipro, Cognizant, Accenture</li>
          <li><strong>Minimum Requirement:</strong> 60% or 6.0 - 6.5 CGPA</li>
          <li><strong>No active backlogs</strong> are usually permitted.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8">Product-Based Companies & Startups</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Companies:</strong> Adobe, Oracle, Cisco, standard startups</li>
          <li><strong>Minimum Requirement:</strong> 7.0 - 7.5 CGPA</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8">FAANG & Super Dream Offers</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Companies:</strong> Google, Microsoft, Amazon, Apple, Meta</li>
          <li><strong>Minimum Requirement:</strong> Often 7.5 to 8.0 CGPA cutoff. (Though sometimes they have no strict cutoff, an 8.0+ is practically required to bypass resume screening).</li>
        </ul>

        <p className="mt-8">Check if your current marks meet the cutoffs using the <Link href="/marks-to-cgpa-calculator" className="text-primary hover:underline">Marks to CGPA Calculator</Link>.</p>
      </div>
    )
  },
  "cgpa-for-higher-studies": {
    title: "CGPA Requirements for MS & Higher Studies Abroad",
    description: "Learn how your 10-point CGPA impacts your chances for MS in US, UK, Canada, and Germany, and how to evaluate your profile.",
    content: (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Does CGPA Matter for Higher Studies?</h2>
        <p>Yes, your undergraduate CGPA is one of the most heavily weighted factors in graduate admissions, alongside your GRE/GMAT scores, Statement of Purpose (SOP), and Letters of Recommendation (LOR).</p>
        
        <h3 className="text-xl font-semibold mt-8">General Cutoffs by Country</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>United States:</strong> Most MS programs require a minimum 3.0 GPA (approx. 7.0 - 7.5 CGPA). Top 50 universities typically expect 8.0+ CGPA.</li>
          <li><strong>Germany:</strong> German public universities place extremely high weight on undergraduate academics. A CGPA of 8.0 to 8.5+ is usually required for competitive programs (like TU Munich or RWTH Aachen).</li>
          <li><strong>Canada & UK:</strong> Programs usually expect a first-class degree, which translates to a minimum of 65-70% or 7.0 CGPA.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8">Handling a Low CGPA</h3>
        <p>If your CGPA is below 7.0, you can offset it by scoring highly on standardized tests (GRE &gt; 320), publishing research papers, or gaining 1-2 years of relevant work experience.</p>
      </div>
    )
  }
};
