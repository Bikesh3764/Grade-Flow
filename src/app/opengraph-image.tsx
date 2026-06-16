import { ImageResponse } from 'next/og';

export const alt = 'GradeFlow - CGPA Calculator & Academic Tracker';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
        }}
      >
        {/* Background decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.15)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'rgba(99, 102, 241, 0.1)',
            display: 'flex',
          }}
        />

        {/* Logo + Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              color: 'white',
            }}
          >
            🎓
          </div>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 700,
              color: '#3b82f6',
              letterSpacing: '-1px',
            }}
          >
            GradeFlow
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: '900px',
            marginBottom: '16px',
          }}
        >
          CGPA Calculator &
        </div>
        <div
          style={{
            fontSize: '56px',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            backgroundClip: 'text',
            color: 'transparent',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          Academic Tracker
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            color: '#94a3b8',
            textAlign: 'center',
            marginTop: '24px',
            maxWidth: '700px',
          }}
        >
          Calculate CGPA, SGPA & Percentage for 1000+ Indian Universities
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            color: '#64748b',
            fontSize: '18px',
          }}
        >
          <span>cgpacalculator.xyz</span>
          <span>•</span>
          <span>VIT • SRM • Anna University • KTU • VTU • IPU</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
