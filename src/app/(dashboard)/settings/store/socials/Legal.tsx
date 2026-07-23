import { ShieldCheck, Info, HelpCircle, HeartHandshake } from 'lucide-react';

const Legal = ({
  active,
  setSuccessMessage,
  data,
  setIsLoading,
  setPolicies,
  isLoading, 
  change,
  setChange,
}: {
  active: boolean;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  data: Record<string, any>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setPolicies: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isLoading: boolean;
  change: boolean;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const data_form = Object.fromEntries(form.entries());
    setPolicies({ ...data, privacy: data_form.privacy, terms: data_form.terms, helpCenter: data_form.helpCenter, supportDesk: data_form.supportDesk });
    try {
      const response = await fetch('/api/auth/update-store-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: data }),
      });
      const data2 = await response.json();
      setSuccessMessage('Store policies updated successfully.');
      setChange(true);
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (e: any) {
      alert('error in updating store policies');
    }
    setIsLoading(false);
    setChange(false);
  };
  return (
    <form
      onSubmit={handleSaveSettings}
      className="space-y-4 text-xs font-bold animate-scale-in"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
            <ShieldCheck size={14} /> Privacy Policy URL
          </label>
          <input
            type="url"
            name="privacy"
            value={data.urlPolicy === null ? '' : data.urlPolicy}
            onChange={(e) =>
              setPolicies({ ...data, urlPolicy: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 p-3 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
            <Info size={14} /> Terms of Service URL
          </label>
          <input
            type="url"
            name="terms"
            value={data.urlTerms === null ? '' : data.urlTerms}
            onChange={(e) => setPolicies({ ...data, urlTerms: e.target.value })}
            className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 p-3 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
            <HelpCircle size={14} /> About Store URL
          </label>
          <input
            type="url"
            name="support"
            value={data.urlSupport === null ? '' : data.urlSupport}
            onChange={(e) =>
              setPolicies({ ...data, urlSupport: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 p-3 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
            <HeartHandshake size={14} /> Support Merchant Link
          </label>
          <input
            type="url"
            name="about"
            value={data.urlAbout === null ? '' : data.urlAbout}
            onChange={(e) => setPolicies({ ...data, urlAbout: e.target.value })}
            className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 p-3 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>
      </div>
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
      >
        {isLoading ? 'Updating...' : 'Update Store Policies'}
      </button>
    </form>
  );
};

export default Legal;
