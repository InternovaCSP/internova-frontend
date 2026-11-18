import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const INTERNSHIP_SCHEMA = Yup.object().shape({
  title: Yup.string().required('Job Title is required').max(255, 'Title too long'),
  description: Yup.string()
    .required('Description is required')
    .min(20, 'Description should be at least 20 characters'),
  location: Yup.string().required('Location is required'),
  duration: Yup.string().required('Duration is required (e.g., 3 months, Summer 2026)'),
  requirements: Yup.string().required('Requirements/Skills are required'),
});

const EMPTY_VALUES = {
  title: '',
  description: '',
  location: '',
  duration: '',
  requirements: '',
  isPublished: true,
};

export default function InternshipForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = 'Save',
  submittingLabel = 'Saving...',
  publishLabel = 'Publish listing immediately',
}) {
  const inputClass =
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 dark:border-slate-600 dark:bg-slate-900';

  return (
    <Formik
      initialValues={{ ...EMPTY_VALUES, ...initialValues }}
      validationSchema={INTERNSHIP_SCHEMA}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ isSubmitting, status }) => (
        <Form className="space-y-4">
          {status?.error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
              {status.error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Job Title
            </label>
            <Field id="title" name="title" placeholder="e.g. Software Engineering Intern" className={inputClass} />
            <ErrorMessage name="title" component="p" className="mt-1 text-xs text-rose-600" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="location" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Location
              </label>
              <Field id="location" name="location" placeholder="Remote, NYC, etc." className={inputClass} />
              <ErrorMessage name="location" component="p" className="mt-1 text-xs text-rose-600" />
            </div>

            <div>
              <label htmlFor="duration" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Duration
              </label>
              <Field id="duration" name="duration" placeholder="e.g. 3 Months" className={inputClass} />
              <ErrorMessage name="duration" component="p" className="mt-1 text-xs text-rose-600" />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              rows={4}
              placeholder="Describe the role and responsibilities..."
              className={inputClass}
            />
            <ErrorMessage name="description" component="p" className="mt-1 text-xs text-rose-600" />
          </div>

          <div>
            <label htmlFor="requirements" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Skills / Requirements (comma-separated)
            </label>
            <Field id="requirements" name="requirements" placeholder="React, Node.js, Python..." className={inputClass} />
            <ErrorMessage name="requirements" component="p" className="mt-1 text-xs text-rose-600" />
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
            <Field type="checkbox" name="isPublished" className="h-4 w-4 rounded accent-brand-blue" />
            <span>{publishLabel}</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-brand-blue py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
            >
              {isSubmitting ? submittingLabel : submitLabel}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
