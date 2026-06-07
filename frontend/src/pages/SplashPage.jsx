import { useEffect, useState } from 'react';

export default function SplashPage() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const phases = [400, 800, 1200];
    phases.forEach((delay, i) => {
      setTimeout(() => setPhase(i + 1), delay);
    });

    const start = Date.now();
    const duration = 2800;
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / duration) * 100));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="splash-screen relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated background */}
      <div className="splash-bg absolute inset-0" />
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />
      <div className="splash-orb splash-orb-3" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Logo */}
        <div className={`splash-logo mb-8 ${phase >= 1 ? 'splash-visible' : ''}`}>
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-2xl bg-primary-500/30" style={{ animationDuration: '2s' }} />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl shadow-primary-500/40">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Welcome text */}
        <p className={`splash-subtitle mb-3 text-sm font-medium uppercase tracking-[0.3em] text-primary-400 ${phase >= 1 ? 'splash-visible' : ''}`}
          style={{ transitionDelay: '0.1s' }}>
          Welcome to
        </p>

        <h1 className={`splash-title max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl ${phase >= 2 ? 'splash-visible' : ''}`}
          style={{ transitionDelay: '0.2s' }}>
          Product Catalog
          <span className="block bg-gradient-to-r from-primary-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Management System
          </span>
        </h1>

        <p className={`splash-desc mt-6 max-w-md text-base text-slate-400 sm:text-lg ${phase >= 2 ? 'splash-visible' : ''}`}
          style={{ transitionDelay: '0.35s' }}>
          Streamline products, orders, and approvals in one place
        </p>

        {/* Loading bar */}
        <div className={`splash-bar mt-12 w-64 sm:w-80 ${phase >= 3 ? 'splash-visible' : ''}`}
          style={{ transitionDelay: '0.5s' }}>
          <div className="h-1 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-cyan-400 transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-xs text-slate-500">Loading your experience...</p>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
    </div>
  );
}
