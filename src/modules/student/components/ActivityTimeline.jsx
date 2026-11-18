const ACTIVITIES = [
  { id: 1, title: 'Application Submitted', desc: 'Applied for Cloud Intern at Microsoft.', time: '2 hours ago', dot: 'border-brand-blue bg-sky-100' },
  { id: 2, title: 'Interview Scheduled', desc: 'Interview with Google HR Team.', time: 'Yesterday, 2:30 PM', dot: 'border-brand-teal bg-emerald-100' },
  { id: 3, title: 'Profile Updated', desc: 'Added 3 new skills to profile.', time: 'Oct 18, 2025', dot: 'border-brand-blue bg-sky-100' },
  { id: 4, title: 'Competition Winner 🏆', desc: 'Placed 1st in Global AI Hackathon.', time: 'Oct 15, 2025', dot: 'border-brand-gold bg-amber-100' },
];

export default function ActivityTimeline() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Recent Activity</h2>
        <span className="text-xs font-semibold text-brand-blue">Timeline</span>
      </div>

      <div className="relative space-y-5 pl-6 before:absolute before:top-1.5 before:bottom-1.5 before:left-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
        {ACTIVITIES.map((item) => (
          <div key={item.id} className="relative">
            <span className={`absolute top-1 -left-6 h-4 w-4 rounded-full border-2 ${item.dot}`} />
            <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</div>
            <div className="text-xs text-slate-600 dark:text-slate-300">{item.desc}</div>
            <div className="mt-0.5 text-[11px] text-slate-400">{item.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
