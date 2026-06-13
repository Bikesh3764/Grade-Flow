import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embed GradeFlow | Add a CGPA Calculator to your site",
  description: "Embed our highly accurate, university-specific CGPA calculator directly on your blog or college website.",
};

export default function EmbedPage() {
  const embedCode = `<iframe src="https://cgpacalculator.xyz" width="100%" height="600" style="border:none; border-radius:12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" title="GradeFlow CGPA Calculator"></iframe>
<p style="text-align: center; font-size: 12px; margin-top: 8px;">Powered by <a href="https://cgpacalculator.xyz" target="_blank" rel="dofollow">GradeFlow CGPA Calculator</a></p>`;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-8 px-4">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-display-sm font-bold text-on-surface">Embed GradeFlow</h1>
        <p className="text-body-lg text-on-surface-variant">
          Are you a college blogger, student club, or university administrator? You can add our beautiful CGPA calculator directly to your website for free!
        </p>
      </div>

      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-6 border border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-tertiary to-secondary" />
        
        <h2 className="text-title-lg font-bold text-on-surface">How to embed</h2>
        <p className="text-body-md text-on-surface-variant mb-4">
          Simply copy the HTML snippet below and paste it into your website, WordPress blog, or Notion page.
        </p>

        <div className="bg-surface-variant/50 p-4 rounded-xl font-mono text-sm overflow-x-auto border border-outline-variant/30">
          <pre className="text-on-surface whitespace-pre-wrap">{embedCode}</pre>
        </div>

        <div className="mt-8">
          <h3 className="text-title-md font-bold mb-4">Preview</h3>
          <div className="p-4 border-2 border-dashed border-outline-variant/50 rounded-2xl bg-surface-variant/10 text-center py-12">
            <p className="text-body-md text-on-surface-variant italic">
              Your users will see a fully functional, mobile-responsive mini-calculator right here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
