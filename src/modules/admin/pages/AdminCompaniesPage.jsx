import { useEffect, useState, useCallback } from 'react';
import { Building2, CheckCircle, AlertCircle, Loader2, Globe, MapPin, Info, Briefcase, ShieldCheck } from 'lucide-react';
import Modal from '../../../shared/components/ui/Modal';
import StatusBadge from '../../../shared/components/ui/StatusBadge';
import EmptyState from '../../../shared/components/ui/EmptyState';
import { useToast } from '../../../shared/hooks/useToast';
import Toast from '../../../shared/components/ui/Toast';
import { adminApi } from '../api';

export default function AdminCompaniesPage() {
  const { toast, showToast, clearToast } = useToast();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyInternships, setCompanyInternships] = useState([]);
  const [loadingInternships, setLoadingInternships] = useState(false);
  const [approvingInternshipId, setApprovingInternshipId] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = activeTab === 'pending' ? await adminApi.getPendingCompanies() : await adminApi.getAllCompanies();
      setCompanies(list);
    } catch (err) {
      console.error(`Error loading ${activeTab} companies:`, err);
      setError(`Failed to load ${activeTab} companies.`);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (companyId) => {
    try {
      setProcessingId(companyId);
      await adminApi.approveCompany(companyId);
      setCompanies((prev) => prev.filter((c) => (c.companyId || c.CompanyId) !== companyId));
      if (activeTab === 'all') loadData();
      if (selectedCompany && (selectedCompany.companyId || selectedCompany.CompanyId) === companyId) {
        setSelectedCompany((prev) => ({ ...prev, status: 'Active', Status: 'Active' }));
      }
      showToast('Company approved.');
    } catch (err) {
      console.error(`Failed to approve company ${companyId}:`, err);
      showToast('Approval failed.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleApproveInternship = async (internshipId) => {
    try {
      setApprovingInternshipId(internshipId);
      await adminApi.approveInternship(internshipId);
      setCompanyInternships((prev) =>
        prev.map((i) => (i.id === internshipId ? { ...i, status: 'Active' } : i))
      );
      showToast('Internship approved.');
    } catch (err) {
      console.error(`Failed to approve internship ${internshipId}:`, err);
      showToast('Internship approval failed.', 'error');
    } finally {
      setApprovingInternshipId(null);
    }
  };

  const handleOpenModal = async (company) => {
    setSelectedCompany(company);
    setLoadingInternships(true);
    try {
      const list = await adminApi.getCompanyInternships(company.companyId || company.CompanyId);
      setCompanyInternships(list);
    } catch (err) {
      console.error('Failed to load company internships:', err);
      setCompanyInternships([]);
    } finally {
      setLoadingInternships(false);
    }
  };

  const isCompanyPending = (company) => {
    const status = String(company?.status ?? company?.Status ?? 'Pending');
    return status.toLowerCase() === 'pending' || status === '0';
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={clearToast} />

      <div className="flex justify-end">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
          {[
            { id: 'pending', label: 'Pending' },
            { id: 'all', label: 'All Companies' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-slate-500">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : companies.length === 0 ? (
        <EmptyState
          icon={CheckCircle}
          title="No Applications"
          description="There are currently no companies awaiting approval."
        />
      ) : (
        <div className="space-y-3">
          {companies.map((company, index) => {
            const id = company?.companyId || company?.CompanyId || index;
            const name = company?.companyName || company?.CompanyName || 'New Company';
            const industry = company?.industry || company?.Industry || 'New registration (stub)';
            const pending = isCompanyPending(company);

            return (
              <div
                key={id}
                onClick={() => handleOpenModal(company)}
                className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-xs transition hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-800"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">{name}</h3>
                    {(activeTab === 'all' || !pending) && (
                      <StatusBadge status={pending ? 'Pending' : 'Active'} />
                    )}
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{industry}</span>
                </div>

                {pending && (
                  <button
                    type="button"
                    disabled={processingId === id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(id);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                  >
                    {processingId === id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <CheckCircle size={16} /> Approve
                      </>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={Boolean(selectedCompany)}
        onClose={() => {
          setSelectedCompany(null);
          setCompanyInternships([]);
        }}
        title={selectedCompany?.companyName || selectedCompany?.CompanyName || 'Company Details'}
        maxWidth="max-w-3xl"
        footer={
          selectedCompany && (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedCompany(null);
                  setCompanyInternships([]);
                }}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200/60 dark:text-slate-300"
              >
                Dismiss
              </button>
              {isCompanyPending(selectedCompany) && (
                <button
                  type="button"
                  onClick={() => handleApprove(selectedCompany.companyId || selectedCompany.CompanyId)}
                  disabled={processingId === (selectedCompany.companyId || selectedCompany.CompanyId)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                  <CheckCircle size={16} /> Approve Company
                </button>
              )}
            </div>
          )
        }
      >
        {selectedCompany && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <Building2 size={18} className="text-blue-600" />
              <span>{selectedCompany.industry || selectedCompany.Industry || 'Industry unknown'}</span>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Info size={14} /> Description
              </div>
              <p className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
                {selectedCompany.description ||
                  selectedCompany.Description ||
                  'This company has not completed their profile yet.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <MapPin size={14} /> Location
                </div>
                <p className="text-sm text-slate-800 dark:text-slate-200">
                  {selectedCompany.address || selectedCompany.Address || 'No address.'}
                </p>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Globe size={14} /> Website
                </div>
                {selectedCompany.websiteUrl || selectedCompany.WebsiteUrl ? (
                  <a
                    href={selectedCompany.websiteUrl || selectedCompany.WebsiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    {(selectedCompany.websiteUrl || selectedCompany.WebsiteUrl).replace(/^https?:\/\//, '')}
                  </a>
                ) : (
                  <span className="text-sm text-slate-500">N/A</span>
                )}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5 dark:border-slate-700">
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Briefcase size={14} /> Job Postings ({companyInternships.length})
              </div>

              {loadingInternships ? (
                <div className="flex items-center gap-2 py-4 text-sm text-slate-500">
                  <Loader2 size={16} className="animate-spin" /> Loading postings...
                </div>
              ) : companyInternships.length === 0 ? (
                <p className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-700">
                  No internships posted by this company yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {companyInternships.map((internship) => (
                    <div
                      key={internship.id}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 dark:border-slate-700 dark:bg-slate-900/50"
                    >
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{internship.title}</h4>
                        <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={12} /> {internship.location}
                          </span>
                          <StatusBadge status={internship.status} />
                        </div>
                      </div>
                      {internship.status !== 'Active' && (
                        <button
                          type="button"
                          onClick={() => handleApproveInternship(internship.id)}
                          disabled={approvingInternshipId === internship.id}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
                        >
                          {approvingInternshipId === internship.id ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <>
                              <ShieldCheck size={13} /> Approve Job
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
