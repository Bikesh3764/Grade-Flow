import Link from 'next/link';
import { 
  GraduationCap, 
  ArrowRight, 
  PlayCircle, 
  User, 
  Calculator, 
  Target, 
  TrendingUp, 
  Search, 
  Rocket 
} from 'lucide-react';
import { DynamicFAQ } from '@/components/seo/DynamicFAQ';
import { generalUniversity } from '@/lib/universities/registry';

export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface font-sans antialiased overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* TopNavBar */}
      <nav className="bg-surface/80  backdrop-blur-xl docked w-full top-0 sticky border-b border-outline-variant/30  shadow-sm dark:shadow-none z-50">
        <div className="flex justify-between items-center w-full px-margin-desktop max-w-max-width mx-auto h-20">
          <div className="flex items-center gap-2">
            <GraduationCap className="text-primary  w-8 h-8" />
            <span className="font-headline-md text-headline-md font-bold text-primary ">GradeFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-gutter">
            <a className="font-label-md text-label-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors duration-200" href="#features">Features</a>
            <a className="font-label-md text-label-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors duration-200" href="#university-hub">University Hub</a>
            <Link className="font-label-md text-label-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors duration-200" href="/faq">FAQ</Link>
            <Link className="font-label-md text-label-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors duration-200" href="/contact">Contact Us</Link>
          </div>
          <div className="flex items-center gap-md">
            <Link href="/dashboard" className="bg-primary text-on-primary font-label-md text-label-md px-md py-sm rounded-full shadow-sm hover:-translate-y-px hover:shadow-md transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-2xl pb-xl px-margin-mobile md:px-margin-desktop overflow-hidden min-h-[800px] flex items-center" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.05) 0%, rgba(var(--background)) 100%)' }}>
          <div className="max-w-max-width mx-auto grid grid-cols-1 lg:grid-cols-2 gap-2xl items-center relative z-10">
            <div className="space-y-lg text-center lg:text-left">
              <div className="inline-flex items-center gap-xs bg-surface-container-high px-sm py-xs rounded-full font-label-sm text-label-sm text-primary mb-md">
                <span className="font-bold">NEW</span>
                <span className="mx-1">•</span>
                <span>GradeFlow 1.0 is here!</span>
              </div>
              <h1 className="font-display text-display text-on-background">
                Master Your <br /><span className="text-primary">Academic Journey</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto lg:mx-0">
                Instantly calculate CGPA, SGPA, and track your academic performance with precision. The all-in-one platform designed for ambitious students.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-md justify-center lg:justify-start pt-md">
                <Link href="/dashboard" className="w-full sm:w-auto bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-full shadow-md hover:-translate-y-px hover:shadow-lg transition-all flex items-center justify-center gap-sm">
                  Start Calculating Free
                  <ArrowRight size={18} />
                </Link>
                <button className="w-full sm:w-auto bg-surface text-primary border border-outline-variant font-label-md text-label-md px-lg py-md rounded-full hover:bg-surface-container-low transition-colors flex items-center justify-center gap-sm">
                  <PlayCircle size={18} />
                  Watch Demo
                </button>
              </div>
              <div className="pt-xl flex items-center justify-center lg:justify-start gap-md text-on-surface-variant font-label-sm text-label-sm">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-surface flex items-center justify-center"><User size={16} /></div>
                  <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-surface flex items-center justify-center"><User size={16} /></div>
                  <div className="w-8 h-8 rounded-full bg-surface-container border-2 border-surface flex items-center justify-center"><User size={16} /></div>
                </div>
                <p>Trusted by 10,000+ top-tier students</p>
              </div>
            </div>
            
            {/* App Mockup */}
            <div className="relative w-full max-w-md mx-auto lg:max-w-none lg:h-[600px] flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl -z-10 transform translate-x-10 translate-y-10"></div>
              <div className="rounded-2xl p-3 sm:p-4 shadow-2xl relative z-10 border border-outline-variant/40 w-full max-w-sm mx-auto bg-surface/70 backdrop-blur-xl">
                <div className="bg-surface rounded-xl overflow-hidden shadow-inner border border-outline-variant/20 h-[500px] relative flex flex-col">
                  <div className="bg-surface-container-lowest p-4 border-b border-outline-variant/20 flex justify-between items-center shadow-sm z-10">
                    <div className="font-headline-md text-headline-md-mobile text-on-surface font-bold tracking-tight">Dashboard</div>
                    <User className="text-primary bg-primary/10 p-1.5 rounded-full" size={32} />
                  </div>
                  <div className="p-4 flex-1 overflow-y-auto space-y-4 bg-surface-container-low/50">
                    {/* Current CGPA Card */}
                    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10 relative overflow-hidden group">
                      <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider font-semibold">Current CGPA</div>
                      <div className="flex items-end gap-2 relative z-10">
                        <div className="font-display text-display text-primary font-bold leading-none">8.84</div>
                        <div className="font-label-sm text-label-sm text-tertiary flex items-center bg-tertiary/10 px-2 py-0.5 rounded-full mb-1">
                          <TrendingUp size={12} className="mr-1" /> +0.12
                        </div>
                      </div>
                    </div>

                    {/* Semester Progress Chart */}
                    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10">
                      <div className="font-label-sm text-label-sm text-on-surface-variant mb-4 uppercase tracking-wider font-semibold">Semester Progress</div>
                      <div className="flex items-end justify-between h-28 gap-2 px-2">
                        <div className="w-full bg-primary/20 rounded-t-md h-[40%] hover:bg-primary/30 transition-colors"></div>
                        <div className="w-full bg-primary/20 rounded-t-md h-[60%] hover:bg-primary/30 transition-colors"></div>
                        <div className="w-full bg-primary/20 rounded-t-md h-[50%] hover:bg-primary/30 transition-colors"></div>
                        <div className="w-full bg-primary/20 rounded-t-md h-[80%] hover:bg-primary/30 transition-colors"></div>
                        <div className="w-full bg-primary rounded-t-md h-[95%] relative shadow-md">
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[11px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap">
                            S5: 9.1
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col gap-2 hover:border-secondary/30 transition-colors cursor-pointer">
                        <div className="bg-secondary/10 text-secondary p-2 rounded-lg w-fit"><Calculator size={18} /></div>
                        <div className="font-label-sm text-label-sm font-semibold text-on-surface">Calculator</div>
                      </div>
                      <div className="bg-surface-container-lowest p-3 rounded-xl shadow-sm border border-outline-variant/10 flex flex-col gap-2 hover:border-tertiary/30 transition-colors cursor-pointer">
                        <div className="bg-tertiary/10 text-tertiary p-2 rounded-lg w-fit"><Target size={18} /></div>
                        <div className="font-label-sm text-label-sm font-semibold text-on-surface">Predictor</div>
                      </div>
                    </div>

                    {/* Recent Grades */}
                    <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/10">
                      <div className="flex justify-between items-center mb-3">
                        <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">Recent Grades</div>
                        <div className="font-label-sm text-label-sm text-primary cursor-pointer hover:underline">View All</div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">O</div>
                            <div>
                              <div className="font-label-sm text-label-sm font-semibold">Data Structures</div>
                              <div className="text-[10px] text-on-surface-variant">4 Credits</div>
                            </div>
                          </div>
                          <div className="font-label-sm text-label-sm font-bold">10.0</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-secondary/10 text-secondary flex items-center justify-center font-bold text-sm">A+</div>
                            <div>
                              <div className="font-label-sm text-label-sm font-semibold">Operating Systems</div>
                              <div className="text-[10px] text-on-surface-variant">3 Credits</div>
                            </div>
                          </div>
                          <div className="font-label-sm text-label-sm font-bold">9.0</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section id="features" className="py-2xl px-margin-mobile md:px-margin-desktop bg-surface">
          <div className="max-w-max-width mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-xl">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md font-bold">Precision Tools for Academic Excellence</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">GradeFlow isn't just a calculator; it's your personal academic strategist. Say goodbye to messy spreadsheets.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary-container/10 rounded-xl flex items-center justify-center text-primary mb-lg group-hover:scale-110 transition-transform">
                  <Calculator size={24} />
                </div>
                <div className="font-label-sm text-label-sm text-primary mb-xs uppercase tracking-wider">Core Tool</div>
                <h3 className="font-headline-md text-headline-md-mobile text-on-surface mb-sm font-semibold">Smart Calculators</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Instantly compute CGPA, SGPA, and GPA across multiple scales with support for custom formulas.</p>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-tertiary-container/10 rounded-xl flex items-center justify-center text-tertiary mb-lg group-hover:scale-110 transition-transform">
                  <Target size={24} />
                </div>
                <div className="font-label-sm text-label-sm text-tertiary mb-xs uppercase tracking-wider">Planning</div>
                <h3 className="font-headline-md text-headline-md-mobile text-on-surface mb-sm font-semibold">Target Predictor</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Set your goal CGPA and let GradeFlow calculate exactly what you need in future semesters.</p>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-2xl border border-outline-variant/20 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-secondary-container/10 rounded-xl flex items-center justify-center text-secondary mb-lg group-hover:scale-110 transition-transform">
                  <TrendingUp size={24} />
                </div>
                <div className="font-label-sm text-label-sm text-secondary mb-xs uppercase tracking-wider">Insights</div>
                <h3 className="font-headline-md text-headline-md-mobile text-on-surface mb-sm font-semibold">Performance Analytics</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Visualize your progress with interactive trend charts, grade distribution graphs, and insights.</p>
              </div>
            </div>
          </div>
        </section>

        {/* University Hub Section */}
        <section id="university-hub" className="py-2xl px-margin-mobile md:px-margin-desktop bg-surface-container-low border-y border-outline-variant/10">
          <div className="max-w-max-width mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
              <div>
                <div className="font-label-sm text-label-sm text-primary mb-md uppercase tracking-wider">University Hub</div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md font-bold">Adaptive Institutional Intelligence</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
                  GradeFlow adapts to specific university grading formulas. Whether your institution uses a 4.0, 5.0, or 10.0 scale, we've got you covered with precise, custom calculations.
                </p>
                <div className="bg-surface-container-lowest p-2 pl-4 rounded-xl border border-outline-variant/20 shadow-sm flex items-center gap-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                  <Search className="text-on-surface-variant" size={20} />
                  <input className="w-full bg-transparent border-none focus:ring-0 font-body-md text-body-md text-on-surface placeholder-on-surface-variant/50 outline-none" placeholder="Find Your Institution..." type="text" />
                  <Link href="/university-hub" className="bg-surface-container text-on-surface-variant px-4 py-2 rounded-lg font-label-sm text-label-sm hover:bg-surface-variant transition-colors whitespace-nowrap">
                    Search Hub
                  </Link>
                </div>
              </div>
              <div className="relative h-64 md:h-80 bg-surface-container-lowest rounded-2xl border border-outline-variant/20 shadow-sm overflow-hidden flex items-center justify-center p-lg">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #004ac6 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                <div className="relative z-10 flex flex-wrap gap-md justify-center">
                  <div className="bg-surface/80 backdrop-blur px-4 py-2 rounded-full font-label-md text-label-md text-on-surface shadow-sm border border-outline-variant/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Stanford University
                  </div>
                  <div className="bg-surface/80 backdrop-blur px-4 py-2 rounded-full font-label-md text-label-md text-on-surface shadow-sm border border-outline-variant/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    MIT
                  </div>
                  <div className="bg-surface/80 backdrop-blur px-4 py-2 rounded-full font-label-md text-label-md text-on-surface shadow-sm border border-outline-variant/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-tertiary"></div>
                    Harvard
                  </div>
                  <div className="bg-surface/80 backdrop-blur px-4 py-2 rounded-full font-label-md text-label-md text-on-surface shadow-sm border border-outline-variant/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Oxford
                  </div>
                  <div className="bg-surface-container px-4 py-2 rounded-full font-label-md text-label-md text-on-surface-variant shadow-sm border border-outline-variant/20 flex items-center gap-sm">
                    + 500 More
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-2xl px-margin-mobile md:px-margin-desktop bg-surface text-center">
          <div className="max-w-3xl mx-auto space-y-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold">Ready to Optimize Your Trajectory?</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Join thousands of top-tier students who are managing their academic future with GradeFlow.</p>
            <Link href="/dashboard" className="bg-primary text-on-primary font-label-md text-label-md px-xl py-4 rounded-full shadow-md hover:-translate-y-1 hover:shadow-lg transition-all inline-flex items-center gap-sm mt-md font-semibold">
              Get Started with GradeFlow
              <Rocket size={18} />
            </Link>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-xl px-margin-mobile md:px-margin-desktop bg-background pb-12">
          <div className="max-w-4xl mx-auto prose dark:prose-invert text-on-surface-variant">
            <h2 className="text-3xl font-bold text-on-surface mb-6">The Ultimate CGPA Calculator for Indian Universities</h2>
            
            <p className="mb-4">
              Welcome to GradeFlow, the most advanced <strong>cgpa calculator</strong> available for students across India. Whether you are aiming for high-paying corporate placements, preparing for higher studies abroad, or simply monitoring your academic progress semester by semester, understanding your Cumulative Grade Point Average (CGPA) is absolutely critical. To simplify this complex process, our platform offers a massive suite of precision tracking tools, including our dedicated <strong>percentage to cgpa calculator</strong>, our standard <strong>sgpa to cgpa calculator</strong>, and our advanced <strong>marks to cgpa calculator</strong>. 
            </p>

            <h3 className="text-2xl font-bold text-on-surface mt-8 mb-4">University-Specific Grading Systems</h3>
            <p className="mb-4">
              Generic calculators often fail because every university operates on a slightly different formula. If you are a student at the Vellore Institute of Technology, you know that grading algorithms can be incredibly strict. Our highly specialized <strong>vit cgpa calculator</strong> (frequently searched as the <strong>cgpa calculator vit</strong>) relies on exact official institutional algorithms to help you accurately predict and estimate your final graduation scores. Similarly, for engineering students studying at the SRM Institute of Science and Technology, our exclusive <strong>srm cgpa calculator</strong> and the <strong>cgpa calculator srm</strong> will perfectly map your individual subject grades and credits to their specific 10-point scale.
            </p>

            <p className="mb-4">
              We also provide comprehensive support for major regional technical universities. If you are currently enrolled in a college in Kerala, the <strong>ktu cgpa calculator</strong> (or the <strong>cgpa calculator ktu</strong>) makes navigating your complex eight-semester curriculum seamless. For engineering and technology students in Karnataka, our meticulously designed <strong>cgpa calculator vtu</strong> and the <strong>vtu cgpa calculator</strong> integrate the latest VTU 2021 and 2022 grading scheme regulations to ensure absolute accuracy when calculating your final degree classification. 
            </p>

            <p className="mb-4">
              Students located in Delhi consistently trust our <strong>ipu cgpa calculator</strong> and the <strong>cgpa calculator ipu</strong> for their exact conversion needs, helping them track their credits without manual spreadsheet errors. Down south, if you are studying at a college affiliated with Anna University, you are likely dealing with varying regulation years. Our intelligent <strong>cgpa calculator anna university</strong> and the robust <strong>anna university cgpa calculator</strong> are specifically tailored to handle those exact semester structures, credit weightages, and grading shifts. Furthermore, we proudly offer specialized mathematical support for Saveetha University students through our verified <strong>saveetha cgpa calculator</strong>, as well as students at KL University relying on our precise <strong>kl cgpa calculator</strong>.
            </p>

            <h3 className="text-2xl font-bold text-on-surface mt-8 mb-4">Advanced Conversions: Marks, Percentage, and GPA</h3>
            <p className="mb-4">
              But what if your university only provides you with your total marks or an overall percentage? GradeFlow has you completely covered. You can effortlessly use our <strong>cgpa calculator to percentage</strong> tool to reverse-engineer your final transcript scores for job applications. Conversely, if an employer asks for a 10-point scale equivalent from your marksheet, our <strong>percentage to cgpa calculator</strong> will handle the conversion instantly. 
            </p>

            <p className="mb-4">
              If you are planning to apply for master's programs in the United States or Europe, you might need to convert your standard Indian 10-point scale to a 4.0 scale. Try our streamlined <strong>gpa to cgpa calculator</strong> to see exactly where you stand globally. Whether you need a standard <strong>percentage to cgpa calculator</strong> for rapid off-campus tech placement applications, or you need to accurately deploy a <strong>marks to cgpa calculator</strong> to predict your final academic standing before final exams begin, GradeFlow is engineered to be your all-in-one digital academic hub. Stop relying on outdated spreadsheets and mental math. Take control of your academic trajectory today.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-xl px-margin-mobile md:px-margin-desktop bg-surface pb-2xl">
          <DynamicFAQ university={generalUniversity} pageType="home" />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-lowest  w-full border-t border-outline-variant/30 ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter px-margin-desktop py-xl max-w-max-width mx-auto">
          <div className="col-span-1 md:col-span-2 lg:col-span-1 flex flex-col gap-md">
            <div className="flex items-center gap-2 mb-sm">
              <GraduationCap className="text-primary  w-8 h-8" />
              <span className="font-headline-md text-headline-md font-bold text-primary ">GradeFlow</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant  max-w-xs">
              Your personal academic strategist. Precision tracking for ambitious students.
            </p>
            <div className="font-label-sm text-label-sm text-on-surface-variant  mt-auto pt-md">
              © {new Date().getFullYear()} GradeFlow Intelligence. All rights reserved.
            </div>
          </div>
          <div className="flex flex-col gap-sm">
            <h4 className="font-label-md text-label-md text-on-surface  font-bold mb-xs uppercase tracking-wider">Tools</h4>
            <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/cgpa-calculator">CGPA Calculator</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/sgpa-calculator">SGPA Calculator</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/percentage-to-cgpa-calculator">Percentage to CGPA Calculator</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/marks-to-cgpa-calculator">Marks to CGPA Calculator</Link>
          </div>
          <div className="flex flex-col gap-sm">
            <h4 className="font-label-md text-label-md text-on-surface  font-bold mb-xs uppercase tracking-wider">Resources</h4>
            <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/university-hub">University Directory</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/help-center">Help Center</Link>
          </div>
          <div className="flex flex-col gap-sm">
            <h4 className="font-label-md text-label-md text-on-surface  font-bold mb-xs uppercase tracking-wider">Legal</h4>
            <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/privacy-policy">Privacy Policy</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/terms-and-conditions">Terms & Conditions</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/faq">FAQ</Link>
            <Link className="font-body-md text-body-md text-on-surface-variant  hover:text-primary :text-primary-fixed transition-colors" href="/contact">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
