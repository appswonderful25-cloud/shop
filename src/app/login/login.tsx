'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { excuteFetch } from '@/components/hooks/useFetch';
import { countryList } from '@/app/login/country';
import Link from 'next/link';
import PageEmailConfirmation from '@/app/auth/email-confirmation/ComponentConfrimation';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Sparkles,
  User,
  Smartphone,
  Globe,
} from 'lucide-react';
import { useLanguage } from '@/app/store/LanguageContext';

export default function LoginAndSignup() {
  const { t } = useLanguage();
  const router = useRouter();
  const [activeMode, setActiveMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isLogin, setIsLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const [isConfirm, setIsConfirm] = useState(true);

  // If already logged in, redirect based on role
  useEffect(() => {
    fetch('/api/auth/session').then(r => r.json()).then(data => {
      if (data.token && data.user) {
        const roleType = data.user?.role?.type || '';
        const staffRoles = ['admin', 'manager', 'support_agent'];
        if (staffRoles.includes(roleType)) {
          router.replace('/overview');
        } else {
          router.replace('/profile');
        }
      }
    }).catch(() => {});
  }, [router]);

  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    phone: '',
    country: 'United States',
    password: '',
    confirmPassword: '',
  });
  const [formData3, setFormData3] = useState({
    username: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    nationality: '',
    password: '',
  });
  const [formData4, setFormData4] = useState({
    identifier: '',
    password: '',
  });

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    localStorage.setItem('email', formData.email);

    if (!validateEmail(formData.email.trim()) && activeMode === 'signup') {
      setErrorMessage(t('login.invalidEmail'));
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage(t('login.passwordMinLength'));
      return;
    }
    if (activeMode === 'signup') {
      if (!formData?.fullname || !formData.fullname.trim()) {
        setErrorMessage(t('login.fullNameRequired'));
        return;
      }
      if (!/^\+?[0-9]{10,15}$/.test(formData.phone.trim())) {
        setErrorMessage(t('login.invalidPhoneFormat'));
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMessage(t('login.passwordMismatch'));
        return;
      }
      const phoneRegex = /^\+\d{12}$/;

      if (!phoneRegex.test(formData.phone)) {
        setErrorMessage(t('login.invalidPhone'));
        return;
      }
    }
    if (activeMode === 'signup') {
      setIsLoading(true);
      const loading = toast.loading(t('login.creatingAccount'));
      try {
        formData3.username = formData.username;
        formData3.fullName = formData.fullname;
        formData3.email = formData.email;
        formData3.phoneNumber = formData.phone;
        formData3.nationality = formData.country;
        formData3.password = formData.password;

        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData3),
        });
        const data = await response.json();

        if (data.ok) {
          toast.success(t('login.accountCreated'), { id: loading });

          localStorage.setItem('email', formData.email);
          setIsSignup(true);
        } else {
          if (data.field === 'email') {
            setErrorMessage(t('login.emailTaken'));
          } else if (data.field === 'username') {
            setErrorMessage(t('login.usernameTaken'));
          } else if (data.field === 'phoneNumber') {
            setErrorMessage(t('login.phoneTaken'));
          } else {
            setErrorMessage(data.error || t('login.somethingWentWrong'));
          }
          toast.dismiss(loading);
        }
      } catch (e: any) {
        const rawMessage = e.error?.message || e.message;

        const cleanMessage = rawMessage.replace(/^Error:\s*/i, '');

        setErrorMessage(cleanMessage);
        toast.dismiss(loading);
      } finally {
        setIsLoading(false);
      }
      setIsConfirm(true);
    } else {
      formData4.identifier = formData.email;
      formData4.password = formData.password;

      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData4),
        });
        const data = await response.json();

        if (data.error !== 'Your account email is not confirmed') {
          setIsConfirm(true);

          setIsLogin(true);
        } else {
          setIsConfirm(false);
        }
        if (!data.ok) {
          setErrorMessage(data.error || t('login.somethingWentWrong'));
          setIsLogin(false);
        } else {
          const role = data.role || '';
          const staffRoles = ['admin', 'manager', 'support_agent'];
          if (staffRoles.includes(role)) {
            router.push('/overview');
          } else {
            router.push('/profile');
          }
        }
        setIsLoading(false);
      } catch (e: any) {
        setErrorMessage(e.message);
      }
    }
  };

  const handlelogin = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const data2 = await response.json();
      if (data2.ok) {
        setIsConfirm(true);
        setIsLoading(false);
        setIsLogin(true);
        const role = data2.role || '';
        const staffRoles = ['admin', 'manager', 'support_agent'];
        if (staffRoles.includes(role)) {
          router.push('/overview');
        } else {
          router.push('/profile');
        }
      } else {
        setIsLogin(false);
      }
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  if (isLogin) {
    return <div></div>;
  }
  if (isSignup) {
    return <PageEmailConfirmation />;
  }

  if (!isConfirm) {
    return (
      <PageEmailConfirmation
        setIsConfirm={setIsConfirm}
        data2={formData4}
        accesslogin={handlelogin}
      />
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-slate-50 dark:bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans"
      dir="ltr"
    >
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-3xl p-8 shadow-xl relative z-10 animate-scale-in text-left space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs border border-indigo-100/30">
            <ShieldCheck size={24} className="stroke-[2.2]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight pt-1">
            {t('login.gateTerminal')}
          </h2>
          <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
            {t('login.ecosystem')}
          </p>
        </div>
        <div className="flex bg-slate-100/70 dark:bg-zinc-800/60 p-1.5 rounded-2xl border border-slate-200/40 dark:border-zinc-700/30 w-full">
          <button
            type="button"
            onClick={() => {
              setActiveMode('login');
              setErrorMessage('');
            }}
            className={`w-1/2 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer select-none
              ${
                activeMode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50 dark:bg-zinc-900 dark:text-white dark:border-zinc-800'
                  : 'text-slate-500 dark:text-zinc-400'
              }`}
          >
            {t('login.signInAccount')}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode('signup');
              setErrorMessage('');
            }}
            className={`w-1/2 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer select-none
              ${
                activeMode === 'signup'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50 dark:bg-zinc-900 dark:text-white dark:border-zinc-800'
                  : 'text-slate-500 dark:text-zinc-400'
              }`}
          >
            {t('login.createAccount')}
          </button>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100/40 dark:border-rose-900/30 p-3.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 flex items-start gap-2 animate-scale-in leading-relaxed">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {activeMode === 'signup' && (
            <div className="grid grid-cols-1 gap-4 animate-scale-in">
              <div className="flex flex-col gap-1.5 text-xs font-bold">
                <label className="text-slate-400  dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                   <User size={13} /> {t('login.fullName')}
                </label>
                <input
                  type="text"
                   placeholder={t('login.fullNamePlaceholder')}
                  value={formData.fullname}
                  onChange={(e) =>
                    setFormData({ ...formData, fullname: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3.5 rounded-xl text-slate-900 dark:text-white font-semibold"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-xs font-bold">
                <label className="text-slate-400 dark:text-zinc-500  uppercase tracking-wider flex items-center gap-1">
                   <User size={13} /> {t('login.userName')}
                </label>
                <input
                  type="text"
                   placeholder={t('login.userNamePlaceholder')}
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3.5 rounded-xl text-slate-900 dark:text-white font-semibold"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-xs font-bold">
                <label className="text-slate-400 dark:text-zinc-500  uppercase tracking-wider flex items-center gap-1">
                   <Smartphone size={13} /> {t('login.phoneNumber')}
                </label>
                <input
                  type="tel"
                   placeholder={t('login.phonePlaceholder')}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3.5 rounded-xl text-slate-900 dark:text-white font-semibold"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-xs font-bold">
                <label className="text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                   <Globe size={13} /> {t('login.country')}
                </label>
                <select
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3.5 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none"
                >
                  {countryList.map((item, index) => {
                    return (
                      <option
                        key={item.code || index}
                        value={item.name || item.code || index}
                      >
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-1.5 text-xs font-bold">
            <label className="text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
               <Mail size={13} /> {t('login.emailUsername')}
            </label>
            <input
              type="text"
               placeholder={t('login.emailPlaceholder')}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrorMessage('');
              }}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3.5 rounded-xl text-slate-900 dark:text-white font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5 text-xs font-bold">
              <label className="text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                 <Lock size={13} /> {t('login.password')}
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                   placeholder="••••••••"
                   value={formData.password}
                   onChange={(e) => {
                     setFormData({ ...formData, password: e.target.value });
                     setErrorMessage('');
                   }}
                   className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-base py-2.5 px-3.5 rounded-xl text-slate-900 dark:text-white font-semibold tracking-wide"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                 >
                   {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                 </button>
               </div>
             </div>

             {activeMode === 'signup' && (
               <div className="flex flex-col gap-1.5 text-xs font-bold">
                 <label className="text-slate-400 dark:text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                   <Lock size={13} /> {t('login.confirmPassword')}
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      });
                      setErrorMessage('');
                    }}
                    className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-base px-2.5 py-3.5 rounded-xl text-slate-900 dark:text-white font-semibold tracking-wide"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/60 text-white text-xs font-black py-4 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] pt-4"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {activeMode === 'login' ? t('login.signIn') : t('login.signUp')}
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {activeMode === 'login' && (
          <Link href="/auth/forgot-password">
            <div className="group text-center py-2 mb-4 hover:bg-gray-100 rounded-2xl border-slate-50 dark:border-zinc-800/60">
              <p className="text-[11px] group-hover:text-indigo-500 font-bold text-slate-400 dark:text-zinc-500 flex items-center justify-center gap-1">
                {t('login.resetPassword')}
              </p>
            </div>
          </Link>
        )}

        {activeMode === 'login' && (
          <div className="text-center">
            <Link href="/register" className="text-[11px] font-bold text-indigo-500 hover:underline">
              {t('login.noAccountCreateOne')}
            </Link>
          </div>
        )}

        <div className="text-center pt-2 border-t border-slate-50 dark:border-zinc-800/60">
          <Link href="/store" className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 hover:text-indigo-500 flex items-center justify-center gap-1">
            {t('login.backToStore')}
          </Link>
        </div>
      </div>
    </div>
  );
}
