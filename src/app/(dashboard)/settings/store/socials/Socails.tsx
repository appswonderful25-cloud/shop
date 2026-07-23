'use client';
import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaTwitter,
  FaLinkedin,
} from 'react-icons/fa';
import { FaThreads } from 'react-icons/fa6';


const Socials = ({
  active,
  setSuccessMessage,
  socials,
  setIsLoading,
  setSocials,
  isLoading,
}: {
  active: boolean;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  socials: Record<string, any>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSocials: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isLoading: boolean;
}) => {
  
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const data = { ...socials };
    try {
      const response = await fetch('/api/auth/update-store-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: data }),
      });
      const data2 = await response.json();
      setSuccessMessage('Public Socials updated successfully.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (e: any) {
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!active) {
    return <></>;
  }
  return (
    <form
      onSubmit={handleSaveSettings}
      className="space-y-4 text-xs font-bold animate-scale-in"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
            <FaTwitter size={14} /> X Corporate URL
          </label>
          <input
            type="url"
            value={socials.urlTwitter===null?"":socials.urlTwitter}
            onChange={(e) =>
              setSocials({ ...socials, urlTwitter: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 p-3 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
            <FaFacebook size={13} /> Facebook Store Link
          </label>
          <input
            type="url"
            value={socials.urlFacebook===null?"":socials.urlFacebook}
            onChange={(e) =>
              setSocials({ ...socials, urlFacebook: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 p-3 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
            <FaInstagram size={14} /> Instagram Feed URL
          </label>
          <input
            type="url"
            value={socials.urlInstagram===null?"":socials.urlInstagram}
            onChange={(e) =>
              setSocials({ ...socials, urlInstagram: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 p-3 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
            <FaThreads size={13} /> Threads Network Node
          </label>
          <input
            type="url"
            value={socials.urlThreads===null?"":socials.urlThreads}
            onChange={(e) =>
              setSocials({ ...socials, urlThreads: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 p-3 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
            <FaTiktok size={13} /> TikTok Merchant Feed
          </label>
          <input
            type="url"
            value={socials.urlTiktok===null?"":socials.urlTiktok}
            onChange={(e) => setSocials({ ...socials, urlTiktok: e.target.value })}
            className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 p-3 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
            <FaLinkedin size={13} /> LinkedIn Profile URL
          </label>
          <input
            type="url"
            value={socials.urlLinkedin===null?"":socials.urlLinkedin}
            onChange={(e) =>
              setSocials({ ...socials, urlLinkedin: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 p-3 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : 'Save Public Socials'}
      </button>
    </form>
  );
};

export default Socials;
