import { Video, Layers, Info } from 'lucide-react';
import ActiveRoomsWidget from '../components/ActiveRoomsWidget';

const STEPS = [
  'Generate a unique Google Meet link with one click.',
  'Rooms are public to all InterNova students via this hub.',
  'Students can join sessions instantly without permission gating.',
  'Awarded skills are recorded to your profile after the session.',
];

export default function BreakoutRoomsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Breakout <span className="text-emerald-500">Rooms</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            Real-time collaboration space for InterNova students. Create a room, share a Google Meet link, and
            collaborate on projects or competition ideas immediately.
          </p>
        </div>

        <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-900 dark:bg-emerald-950/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <Video size={20} />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">Student-Led</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400">Self-Service Hub</div>
          </div>
        </div>
      </div>

      <ActiveRoomsWidget />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-800">
          <div className="mb-4 flex items-center gap-2">
            <Layers size={18} className="text-emerald-500" />
            <h3 className="text-base font-bold">How it works</h3>
          </div>
          <ul className="space-y-3">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white">
          <div className="mb-3 flex items-center gap-2">
            <Info size={18} />
            <h3 className="text-base font-bold">Collaboration Tips</h3>
          </div>
          <p className="text-sm leading-relaxed text-emerald-50">
            Looking to find teammates for a hackathon? Start a breakout room with the competition title! Use clear
            descriptions to attract participants who share your skill interests.
          </p>
          <div className="mt-5 rounded-xl bg-white/15 p-3 text-xs">
            <strong>Pro-Tip:</strong> Complete sessions once finished so your earned skills are updated on your student
            profile.
          </div>
        </div>
      </div>
    </div>
  );
}
