import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '../../../shared/hooks/useToast';
import Toast from '../../../shared/components/ui/Toast';
import { internshipsApi } from '../api';
import InternshipForm from '../components/InternshipForm';

export default function CreateInternshipPage() {
  const navigate = useNavigate();
  const { toast, showToast, clearToast } = useToast();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await internshipsApi.create(values);
      showToast('Internship posted successfully! Redirecting...');
      setTimeout(() => navigate('/company/dashboard'), 1500);
    } catch (error) {
      console.error('Failed to create internship:', error);
      setStatus({ error: 'Failed to post internship. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Toast toast={toast} onClose={clearToast} />

      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/company/dashboard')}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          <ArrowLeft size={15} /> Back to Dashboard
        </button>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Post a New Internship</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Detail your opportunity to reach talented applicants.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-800">
        <InternshipForm
          onSubmit={handleSubmit}
          onCancel={() => navigate('/company/dashboard')}
          submitLabel="Post Internship"
          submittingLabel="Posting..."
        />
      </div>
    </div>
  );
}
