import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Server,
  Lock,
  GraduationCap,
  Building2,
  BarChart2,
  Rocket,
  Star,
  Globe,
  Award,
} from 'lucide-react';

const SLIDES = [
  {
    gradient: 'radial-gradient(circle at 0% 0%, rgba(0, 120, 212, 0.22) 0%, transparent 65%)',
    headline: 'Secure Access to Verified Opportunities',
    sub: 'A centralized university platform bridging students, companies, and administrators through secure, structured opportunity management.',
    items: [
      { Icon: Lock, label: 'Role-Based Access Control' },
      { Icon: ShieldCheck, label: 'Secure JWT Authentication' },
      { Icon: Server, label: 'Azure Cloud Infrastructure' },
    ],
  },
  {
    gradient: 'radial-gradient(circle at 100% 0%, rgba(29, 137, 84, 0.22) 0%, transparent 65%)',
    headline: 'Launch Your Career with Real Internships',
    sub: 'Discover curated internship listings from verified companies, apply in seconds, and track every step of your application journey.',
    items: [
      { Icon: GraduationCap, label: 'University-Verified Students' },
      { Icon: Building2, label: 'Top-Tier Company Partners' },
      { Icon: BarChart2, label: 'Real-Time Application Tracking' },
    ],
  },
  {
    gradient: 'radial-gradient(circle at 50% 100%, rgba(249, 168, 37, 0.20) 0%, transparent 65%)',
    headline: 'Post Opportunities. Hire Top Talent.',
    sub: "Companies can post internships, review student profiles, manage applications, and build a pipeline of tomorrow's professionals.",
    items: [
      { Icon: Rocket, label: 'Post Internships in Minutes' },
      { Icon: Star, label: 'Smart Candidate Shortlisting' },
      { Icon: Globe, label: 'Reach Students Across Universities' },
    ],
  },
  {
    gradient: 'radial-gradient(circle at 0% 100%, rgba(108, 99, 255, 0.22) 0%, transparent 65%)',
    headline: 'A Platform Built for Academic Excellence',
    sub: 'Competitions, projects, and internships all on one platform — designed to enrich student portfolios and connect them with opportunities.',
    items: [
      { Icon: Award, label: 'Competitions & Challenges' },
      { Icon: BarChart2, label: 'Portfolio Analytics' },
      { Icon: ShieldCheck, label: 'Admin-Controlled Verification' },
    ],
  },
];

export default function AuthLayout({ children }) {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % SLIDES.length);
        setVisible(true);
      }, 350);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[active];

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="relative hidden w-2/5 flex-col justify-center overflow-hidden bg-brand-navy p-12 text-white lg:flex">
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-500"
          style={{ background: slide.gradient }}
        />

        <div className="relative z-10">
          <div
            className={`transition-all duration-300 ${
              visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <h1 className="text-3xl leading-snug font-bold">{slide.headline}</h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">{slide.sub}</p>

            <div className="mt-8 flex flex-col gap-3.5">
              {slide.items.map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-3 text-sm font-medium text-slate-100">
                  <Icon size={18} className="shrink-0 text-brand-teal" />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Slide ${i + 1}`}
                onClick={() => {
                  setActive(i);
                  setVisible(true);
                }}
                className={`h-2 rounded-full transition-all ${
                  i === active ? 'w-6 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-12">
        {children}
      </div>
    </div>
  );
}
