import { useState } from 'react';
import { FolderKanban, CheckCircle, AlertCircle, Loader2, Plus } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal';
import { getErrorMessage } from '../../../shared/api/client';
import { projectsApi } from '../api';

const CATEGORIES = ['Research', 'Startup', 'Product Development', 'Innovation Lab'];
const SKILL_OPTIONS = [
  'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java', 'C#', '.NET',
  'Machine Learning', 'Data Analysis', 'UI/UX Design', 'Cloud Computing',
  'DevOps', 'Mobile Development', 'Cybersecurity', 'Blockchain',
  'Database Management', 'Project Management', 'IoT', 'Embedded Systems',
];

export default function ProjectFormModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Research',
    teamSize: '',
    requiredSkills: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Project title is required.');
      return;
    }

    try {
      setSubmitting(true);
      const created = await projectsApi.create({
        Title: form.title.trim(),
        Description: form.description.trim(),
        Category: form.category,
        TeamSize: form.teamSize ? parseInt(form.teamSize, 10) : null,
        RequiredSkills: form.requiredSkills.length > 0 ? form.requiredSkills.join(', ') : null,
      });
      setForm({ title: '', description: '', category: 'Research', teamSize: '', requiredSkills: [] });
      onCreated(created);
    } catch (err) {
      setFormError(getErrorMessage(err, 'Failed to create project.'));
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 dark:border-slate-600 dark:bg-slate-900';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-sky-50 p-3 text-sm text-sky-900 dark:bg-sky-950/40 dark:text-sky-200">
          <FolderKanban size={20} className="shrink-0 text-brand-blue" />
          <span>Add a new university project or research initiative.</span>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Project Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, title: e.target.value }));
              setFormError('');
            }}
            placeholder="e.g., AI-Powered Campus Navigator"
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className={inputClass}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Team Size</label>
            <input
              type="number"
              min="1"
              value={form.teamSize}
              onChange={(e) => setForm((prev) => ({ ...prev, teamSize: e.target.value }))}
              placeholder="e.g., 5"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Required Skills ({form.requiredSkills.length} selected)
          </label>
          <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
            {SKILL_OPTIONS.map((skill) => {
              const selected = form.requiredSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    selected
                      ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {selected && <CheckCircle size={11} />}
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Describe the project goals, requirements, and expected outcomes..."
            className={inputClass}
          />
        </div>

        {formError && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            <AlertCircle size={16} /> {formError}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {submitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
