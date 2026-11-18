import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  FileCode,
  UserCircle,
  Zap,
  Globe,
  Lock,
} from 'lucide-react';

const STATS = [
  { value: '3.2k+', label: 'Verified Internships', color: 'text-brand-blue' },
  { value: '85%', label: 'Placement Rate', color: 'text-brand-teal' },
  { value: '$0', label: 'Cost for Universities', color: 'text-brand-navy dark:text-white' },
];

const STAKEHOLDERS = [
  {
    title: 'For Students',
    desc: 'Build your professional identity, apply to top-tier internships, and track every application in real time.',
    Icon: GraduationCap,
    iconBg: 'bg-emerald-50 text-brand-teal dark:bg-emerald-950/60',
  },
  {
    title: 'For Companies',
    desc: 'Access a filtered pool of verified student talent. Manage recruitment pipelines and schedule interviews effortlessly.',
    Icon: Building2,
    iconBg: 'bg-sky-50 text-brand-blue dark:bg-sky-950/60',
  },
  {
    title: 'For Admins',
    desc: 'Full oversight of the placement ecosystem. Approve companies, verify postings, and monitor student success.',
    Icon: ShieldCheck,
    iconBg: 'bg-slate-100 text-brand-navy dark:bg-slate-700 dark:text-slate-200',
  },
];

const FEATURES = [
  { Icon: Zap, title: 'Real-time Tracking', desc: 'Visual pipeline for every application. Know exactly where you stand at any moment.' },
  { Icon: Lock, title: 'Secure Verification', desc: 'Multi-step verification for all companies and internships to ensure student safety.' },
  { Icon: Globe, title: 'Global Discovery', desc: 'Discover opportunities from startups to Fortune 500 companies in one place.' },
  { Icon: FileCode, title: 'Project Lab', desc: 'Join collaborative projects and hackathons to build your portfolio outside the classroom.' },
  { Icon: Briefcase, title: 'Interview Hub', desc: 'Consolidated view for all interview invitations and scheduling tools.' },
  { Icon: UserCircle, title: 'Smart Profiles', desc: 'Dynamic resumes that highlight your projects, skills, and competition wins.' },
];

const TESTIMONIALS = [
  {
    quote: '"InterNova redefined how we handle placements. The automated verification and tracking saved us hundreds of hours."',
    name: 'Robert Fox',
    role: 'Placement Director, MIT',
    initial: 'R',
    badgeBg: 'bg-brand-blue',
  },
  {
    quote: '"The quality of candidates we received exceeded our expectations. The platform is intuitive and high-performing."',
    name: 'Jane Cooper',
    role: 'HR Manager, Google',
    initial: 'J',
    badgeBg: 'bg-brand-teal',
  },
  {
    quote: '"I found my dream internship within two weeks. The application tracker kept me informed every step of the way."',
    name: 'Cody Fisher',
    role: 'CS Student, Stanford',
    initial: 'C',
    badgeBg: 'bg-brand-gold',
  },
];

const PORTALS = {
  student: { Icon: UserCircle, label: 'Interactive Student Dashboard Preview' },
  company: { Icon: Building2, label: 'Recruiter Pipeline Vista' },
  admin: { Icon: ShieldCheck, label: 'Comprehensive Admin Overview' },
};

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('student');
  const PortalIcon = PORTALS[activeTab].Icon;

  return (
    <div className="bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-28 sm:pt-24">
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="pointer-events-none absolute top-12 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
              The Future of University <span className="text-brand-blue">Career Growth.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
              InterNova connects ambitious students with verified industry opportunities. A centralized ecosystem for
              internships, projects, and competitions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                View Demo
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-2xl dark:border-slate-800">
            <video className="h-auto w-full object-cover" autoPlay loop muted playsInline>
              <source src="/video.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 -mt-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-800"
            >
              <div className={`text-4xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stakeholders */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Designed for Every Stakeholder</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">
            A unified platform to bridge the gap between academic learning and professional excellence.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {STAKEHOLDERS.map(({ title, desc, Icon, iconBg }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-800"
            >
              <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl ${iconBg}`}>
                <Icon size={28} />
              </div>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20 dark:bg-slate-800/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">Powerful Features for Modern Growth</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800"
              >
                <Icon size={22} className="mb-3 text-brand-blue" />
                <h3 className="text-base font-bold">{title}</h3>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Portals */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">A Unified Experience</h2>
          <div className="mt-6 inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {Object.keys(PORTALS).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-5 py-2 text-sm font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex min-h-72 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center dark:border-slate-800 dark:bg-slate-800/60">
          <div className="text-slate-400">
            <PortalIcon size={56} className="mx-auto mb-3" />
            <p className="text-sm font-medium">{PORTALS[activeTab].label}</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-20 dark:bg-slate-800/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold">Trusted by the Community</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800"
              >
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{t.quote}</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full font-bold text-white ${t.badgeBg}`}>
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{t.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-brand-navy px-6 py-14 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to Scale Your Career?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300">
            Join thousands of students and hundreds of companies already using InterNova to bridge the gap between
            education and industry.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-brand-teal px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Join as Student
            </Link>
            <Link
              to="/register?role=Company"
              className="rounded-xl border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Hire Talent
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Building2 size={28} className="mb-3 text-brand-blue" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Bridging the gap between university talent and industry excellence.
              </p>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold">Platform</h4>
              <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link to="/internships" className="hover:text-slate-900 dark:hover:text-white">Internships</Link>
                <Link to="/projects" className="hover:text-slate-900 dark:hover:text-white">Projects</Link>
                <Link to="/competitions" className="hover:text-slate-900 dark:hover:text-white">Competitions</Link>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold">Company</h4>
              <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                <a href="#" className="hover:text-slate-900 dark:hover:text-white">About</a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy</a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white">Terms</a>
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold">Connect</h4>
              <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400">
                <a href="#" className="hover:text-slate-900 dark:hover:text-white">LinkedIn</a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white">Twitter</a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-white">GitHub</a>
              </div>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-500 dark:border-slate-800">
            © 2026 InterNova. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
