import { useState, useEffect, useRef } from 'react';
import { MapPin, Camera, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useToast } from '../../../shared/hooks/useToast';
import Toast from '../../../shared/components/ui/Toast';
import { accountApi } from '../api';
import PersonalProfileTab from '../components/PersonalProfileTab';
import AcademicProfileTab from '../components/AcademicProfileTab';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const { toast, showToast, clearToast } = useToast();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('personal');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    bio: '',
    location: '',
    email: '',
    profilePictureUrl: null,
    previewUrl: null,
    file: null,
  });

  const [academicProfile, setAcademicProfile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        const data = await accountApi.getProfile();
        const pic = data.profilePictureUrl || data.ProfilePictureUrl || null;
        setPersonalInfo({
          fullName: data.fullName || data.FullName || '',
          bio: data.bio || data.Bio || '',
          location: data.location || data.Location || '',
          email: data.email || data.Email || '',
          profilePictureUrl: pic,
          previewUrl: pic,
          file: null,
        });

        const rawRole = data.role || data.Role || authUser?.role || '';
        if (rawRole.toLowerCase() === 'student') {
          const ac = data.academicProfile || data.AcademicProfile;
          const skillsRaw = ac?.skills || ac?.Skills;
          setAcademicProfile({
            universityId: ac?.universityId || ac?.UniversityId || '',
            department: ac?.department || ac?.Department || '',
            gpa: ac?.gpa ?? ac?.GPA ?? '',
            skills: skillsRaw ? String(skillsRaw).split(',').map((s) => s.trim()).filter(Boolean) : [],
            resumeUrl: ac?.resumeUrl || ac?.ResumeUrl || null,
          });
        }
      } catch (error) {
        console.error('Profile load failed:', error);
        showToast('Unable to load profile', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [authUser, showToast]);

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPersonalInfo((prev) => ({ ...prev, file, previewUrl: URL.createObjectURL(file) }));
  };

  const handleSavePersonal = async () => {
    if (!personalInfo.fullName.trim()) {
      setErrors({ fullName: 'Required' });
      return;
    }
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('FullName', personalInfo.fullName.trim());
      formData.append('Bio', personalInfo.bio || '');
      formData.append('Location', personalInfo.location || '');
      if (personalInfo.file) formData.append('ProfilePicture', personalInfo.file);

      const result = await accountApi.updateProfile(formData);
      setPersonalInfo((prev) => ({ ...prev, profilePictureUrl: result.profilePictureUrl, file: null }));
      setIsEditMode(false);
      showToast('Personal info saved!');
    } catch {
      showToast('Update failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAcademic = async () => {
    if (!academicProfile?.universityId?.trim()) {
      showToast('Uni ID required', 'error');
      return;
    }
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append('UniversityId', academicProfile.universityId.trim());
      formData.append('Department', academicProfile.department || '');
      formData.append('GPA', academicProfile.gpa || '0');
      formData.append('Skills', academicProfile.skills.join(', '));
      if (resumeFile) formData.append('resume', resumeFile);

      const result = await accountApi.updateStudentProfile(formData);
      setAcademicProfile((prev) => ({ ...prev, resumeUrl: result.resumeUrl }));
      setResumeFile(null);
      setIsEditMode(false);
      showToast('Academic info saved!');
    } catch {
      showToast('Update failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center">
        <Loader2 size={36} className="animate-spin text-brand-violet" />
      </div>
    );
  }

  const isStudent = authUser?.role?.toLowerCase() === 'student';

  return (
    <div className="pb-16">
      <Toast toast={toast} onClose={clearToast} />

      <div className="border-b border-slate-200 bg-white pt-10 dark:border-slate-800 dark:bg-slate-800/70">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-slate-900 text-3xl font-bold text-white shadow-lg dark:border-slate-700">
                  {personalInfo.previewUrl ? (
                    <img src={personalInfo.previewUrl} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    personalInfo.fullName.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
                {isEditMode && activeTab === 'personal' && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload avatar"
                    className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-violet text-white shadow"
                  >
                    <Camera size={14} />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
                  {personalInfo.fullName}
                </h1>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold uppercase text-brand-violet dark:bg-slate-700">
                    {authUser?.role || 'Member'}
                  </span>
                  {personalInfo.location && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} /> {personalInfo.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2.5">
              {!isEditMode ? (
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="rounded-xl bg-brand-violet px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
                >
                  Edit {activeTab === 'personal' ? 'Personal' : 'Academic'}
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    disabled={isSaving}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={activeTab === 'personal' ? handleSavePersonal : handleSaveAcademic}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-violet px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-600 disabled:opacity-60"
                  >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-8">
            <button
              type="button"
              onClick={() => {
                setActiveTab('personal');
                setIsEditMode(false);
              }}
              className={`border-b-2 pb-3 text-sm font-bold transition ${
                activeTab === 'personal'
                  ? 'border-brand-violet text-brand-violet'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              Personal Details
            </button>
            {isStudent && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('academic');
                  setIsEditMode(false);
                }}
                className={`border-b-2 pb-3 text-sm font-bold transition ${
                  activeTab === 'academic'
                    ? 'border-brand-violet text-brand-violet'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                Academic Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
        {activeTab === 'personal' ? (
          <PersonalProfileTab
            personalInfo={personalInfo}
            isEditMode={isEditMode}
            errors={errors}
            onChange={handlePersonalChange}
          />
        ) : (
          <AcademicProfileTab
            academicProfile={academicProfile}
            isEditMode={isEditMode}
            resumeFile={resumeFile}
            onResumeChange={setResumeFile}
            onChange={(field, value) => setAcademicProfile((prev) => ({ ...prev, [field]: value }))}
            onAddSkill={(skill) =>
              setAcademicProfile((prev) =>
                prev.skills.includes(skill) ? prev : { ...prev, skills: [...prev.skills, skill] }
              )
            }
            onRemoveSkill={(idx) =>
              setAcademicProfile((prev) => ({
                ...prev,
                skills: prev.skills.filter((_, i) => i !== idx),
              }))
            }
          />
        )}
      </div>
    </div>
  );
}
