import { User, GraduationCap, Award, CheckCircle, FileText, Loader2 } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal';

export default function StudentProfileModal({ isOpen, onClose, student, loading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Candidate Profile" maxWidth="max-w-lg">
      {loading ? (
        <div className="flex flex-col items-center py-12">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-slate-500">Fetching student details...</p>
        </div>
      ) : student ? (
        <div className="space-y-6">
          <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20">
              <User size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold">{student.name}</h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-blue-100">
                <GraduationCap size={15} /> {student.department || 'Not Specified'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">GPA</p>
              <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-slate-900 dark:text-white">
                <Award size={18} className="text-amber-500" /> {student.gpa || 'N/A'}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-900/50">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">University ID</p>
              <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{student.universityId || 'N/A'}</p>
            </div>
          </div>

          <div>
            <p className="mb-2.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <CheckCircle size={14} className="text-blue-500" /> Skills &amp; Expertise
            </p>
            <div className="flex flex-wrap gap-2">
              {student.skills ? (
                student.skills.split(',').map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                  >
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No skills listed.</span>
              )}
            </div>
          </div>

          {student.resumeUrl && (
            <a
              href={student.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <FileText size={18} /> View Student Resume
            </a>
          )}
        </div>
      ) : (
        <p className="py-8 text-center text-sm text-rose-500">Error loading profile.</p>
      )}
    </Modal>
  );
}
