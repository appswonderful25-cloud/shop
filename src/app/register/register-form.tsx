'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/app/store/LanguageContext';

export default function RegisterForm() {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    fullName: '', username: '', email: '', phoneNumber: '', password: '', confirmPassword: '',
  });

  const set = (k: string, v: string) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setFieldErrors(prev => ({ ...prev, [k]: '' }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: t('register.passwordMismatch') });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          fullName: form.fullName,
          phoneNumber: form.phoneNumber || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.field) {
          setFieldErrors({ [data.field]: data.error });
        } else {
          setError(data.error || t('register.registrationFailed'));
        }
        return;
      }

      router.push('/login');
    } catch {
      setError(t('register.somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/store" className="text-2xl font-bold text-indigo-600">{t('register.brandName')}</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4">{t('register.createAccount')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('register.joinUs')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg">{error}</div>}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('register.fullName')}</label>
            <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder={t('register.fullNamePlaceholder')} />
            {fieldErrors.fullName && <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('register.username')}</label>
            <input type="text" value={form.username} onChange={e => set('username', e.target.value)} required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder={t('register.usernamePlaceholder')} />
            {fieldErrors.username && <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('register.email')}</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder={t('register.emailPlaceholder')} />
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('register.phoneOptional')}</label>
            <input type="tel" value={form.phoneNumber} onChange={e => set('phoneNumber', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder={t('register.phonePlaceholder')} />
            {fieldErrors.phoneNumber && <p className="text-red-500 text-xs mt-1">{fieldErrors.phoneNumber}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('register.password')}</label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)} required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder={t('register.passwordPlaceholder')} />
            {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">{t('register.confirmPassword')}</label>
            <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder={t('register.confirmPasswordPlaceholder')} />
            {fieldErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50">
            {loading ? t('register.creatingAccount') : t('register.createAccount')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('register.alreadyHaveAccount')}{' '}
          <Link href="/login" className="text-indigo-600 font-medium hover:underline">{t('register.signIn')}</Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          <Link href="/store" className="hover:underline">{t('register.backToStore')}</Link>
        </p>
      </div>
    </div>
  );
}
