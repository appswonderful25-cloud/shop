import { Lock } from 'lucide-react';
import TwoFactorModal from './TwoFactorModal';
import { useState } from 'react';
import Cookies from 'js-cookie';

interface AuthProps {
  active: boolean;
  setIs2FAModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  security: Record<string, any>;
  setSecurity: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  id: string;
}
const Auth = ({
  active,
  setIs2FAModalOpen,
  security,
  setSecurity,
  setSuccessMessage,
  id,
}: AuthProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(form.entries());
    setSecurity({ ...security, ...data });
    
    try{
      setIsLoading(true);
      const response = await fetch('/api/auth/change-password',{
        method:'POST',
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({currentPassword:data.currentPassword,password:data.newPassword,passwordConfirmation:data.confirmPassword}),
      })
      if(response.ok){
        setSuccessMessage('Password changed successfully.');
      } else {
        const err = await response.json().catch(() => null);
        alert(err?.error || 'Failed to change password');
      }
    }
    catch(e:any){
      alert(e?.message || 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  if (active === true) {
    return (
      <div className="space-y-6 animate-scale-in">
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-md text-xs font-bold"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase">
              Previous Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={security.currentPassword}
              name="currentPassword"
              onChange={(e) =>
                setSecurity({ ...security, currentPassword: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border text-base border-slate-100 dark:border-zinc-800 p-3 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={security.newPassword}
              name="newPassword"
              onChange={(e) =>
                setSecurity({ ...security, newPassword: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 text-base dark:border-zinc-800 p-3 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              name="confirmPassword"
              value={security.confirmPassword}
              onChange={(e) =>
                setSecurity({ ...security, confirmPassword: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border text-base border-slate-100 dark:border-zinc-800 p-3 rounded-xl text-slate-900 dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            onClick={() => {
              if (security.newPassword !== security.confirmPassword) {
                alert('Passwords match error!');
                return;
              }
              setSuccessMessage('Password modified securely.');
              setTimeout(() => setSuccessMessage(''), 3000);
            }}
            className={` ${!isLoading ? 'bg-indigo-600' : ' bg-gray-500'}  text-white dark:bg-white  text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer`}
          >
            {isLoading ? 'Loading...' : 'Update Password'}
          </button>
        </form>

        <div className="border-t border-slate-50 dark:border-zinc-800/50 pt-5 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-800/20 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Lock size={15} className="text-indigo-500" /> Two-Factor
              Authentication (2FA)
            </h4>
          </div>
          <button
            onClick={() => setIs2FAModalOpen(true)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer ${security.twoFactor ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-indigo-600 text-white'}`}
          >
            {security.twoFactor
              ? `✓ 2FA Active (${security.twoFactorEmail})`
              : 'Setup 2FA'}
          </button>
        </div>
      </div>
    );
  }
};

export default Auth;
