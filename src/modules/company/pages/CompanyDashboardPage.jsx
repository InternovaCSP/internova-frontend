import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, MapPin, Clock, CheckCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useToast } from '../../../shared/hooks/useToast';
import Toast from '../../../shared/components/ui/Toast';
import Modal from '../../../shared/components/ui/Modal';
import Skeleton from '../../../shared/components/ui/Skeleton';
import EmptyState from '../../../shared/components/ui/EmptyState';
import StatusBadge from '../../../shared/components/ui/StatusBadge';
import { internshipsApi } from '../../internships/api';
import InternshipForm from '../../internships/components/InternshipForm';

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const { toast, showToast, clearToast } = useToast();
  const [postings, setPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);

  const fetchMyPostings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await internshipsApi.getMine();
      setPostings(data);
    } catch (error) {
      console.error('Error loading postings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchMyPostings();
  }, [user, fetchMyPostings]);

  const handleUpdate = async (values, { setSubmitting }) => {
    try {
      await internshipsApi.update(editingPost.id, values);
      showToast('Internship updated successfully!');
      setEditingPost(null);
      fetchMyPostings();
    } catch (error) {
      console.error('Failed to update internship:', error);
      showToast('Update failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (postId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this internship posting? All associated applications will also be deleted.'
      )
    ) {
      return;
    }
    try {
      await internshipsApi.remove(postId);
      setPostings((prev) => prev.filter((p) => p.id !== postId));
      showToast('Internship deleted successfully!');
    } catch (error) {
      console.error('Failed to delete internship:', error);
      showToast('Delete failed. Please try again.', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <Toast toast={toast} onClose={clearToast} />

      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="inline-block rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-brand-blue dark:bg-sky-950/60">
            Company Partner
          </span>
          <h1 className="mt-1.5 text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
            Company Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Welcome back, <strong>{user?.email}</strong>. Manage your talent pipeline.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/company/applications"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-blue px-4 py-2.5 text-sm font-semibold text-brand-blue transition hover:bg-sky-50 dark:hover:bg-sky-950/40"
          >
            <CheckCircle size={17} /> Manage Applications
          </Link>
          <Link
            to="/company/create-internship"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            <Plus size={17} /> Post New Internship
          </Link>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-800">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">My Postings</h2>
          <span className="text-xs font-medium text-slate-500">{postings.length} Opportunities</span>
        </div>

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-52 rounded-2xl" />
            ))}
          </div>
        ) : postings.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No postings found"
            description="Start attracting top talent by creating your first internship posting today."
            action={
              <Link
                to="/company/create-internship"
                className="inline-flex items-center gap-2 rounded-xl border border-brand-teal px-4 py-2 text-sm font-semibold text-brand-teal hover:bg-emerald-50"
              >
                Create First Posting
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {postings.map((post) => {
              const badgeStatus =
                post.status === 'Pending Approval' ? 'Pending Approval' : post.isPublished ? 'Active' : 'Draft';

              return (
                <div
                  key={post.id}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-5 transition hover:shadow-sm dark:border-slate-700 dark:bg-slate-900/40"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-brand-blue dark:bg-sky-950/60">
                      <Briefcase size={18} />
                    </div>
                    <StatusBadge
                      status={badgeStatus}
                      label={badgeStatus === 'Pending Approval' ? 'Awaiting Approval' : undefined}
                    />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{post.title}</h3>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} /> {post.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={13} /> {post.duration}
                    </div>
                  </div>

                  <div className="mt-auto flex gap-2 border-t border-slate-200/80 pt-4 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => setEditingPost(post)}
                      className="flex-1 rounded-xl border border-brand-blue px-3 py-2 text-xs font-semibold text-brand-blue transition hover:bg-sky-50 dark:hover:bg-sky-950/40"
                    >
                      Edit details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      title="Delete posting"
                      className="rounded-xl border border-rose-200 bg-white p-2 text-rose-500 transition hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-800 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Modal
        isOpen={Boolean(editingPost)}
        onClose={() => setEditingPost(null)}
        title="Edit Internship Posting"
        maxWidth="max-w-xl"
      >
        {editingPost && (
          <InternshipForm
            initialValues={{
              title: editingPost.title || '',
              description: editingPost.description || '',
              location: editingPost.location || '',
              duration: editingPost.duration || '',
              requirements: editingPost.requirements || '',
              isPublished: editingPost.isPublished ?? true,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditingPost(null)}
            submitLabel="Save Changes"
            submittingLabel="Saving Changes..."
            publishLabel="Keep this listing published"
          />
        )}
      </Modal>

      <footer className="text-center text-xs text-slate-400">
        Industrial data is role-protected and securely managed.
      </footer>
    </div>
  );
}
