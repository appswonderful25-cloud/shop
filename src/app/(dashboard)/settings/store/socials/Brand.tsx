import { Layout, Info } from 'lucide-react';
import { useState } from 'react';

const Brand = ({
  active,
  setSuccessMessage,
  data,
  setIsLoading,
  setBrand,
  isLoading,
  change,
  setChange,
}: {
  active: boolean;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  data: Record<string, any>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setBrand: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  isLoading: boolean;
  change: boolean;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [themeColor, setThemeColor] = useState(data.globalColor);
  const [headerColor, setHeaderColor] = useState(data.headerColor);
  const [footerColor, setFooterColor] = useState(data.footerColor);
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { globalColor: themeColor, headerColor: headerColor, footerColor: footerColor };
    try{
        setIsLoading(true);
        console.log(data);
        const response = await fetch('/api/auth/update-store-settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: data }),
        });
        const data2 = await response.json();
        setSuccessMessage('Store customization profile deployed live successfully!');
        setChange(true);
        setTimeout(() => setSuccessMessage(''), 4000);
      
    }
    catch(e:any){
        alert('error in updating store settings');
    }finally{
      setIsLoading(false);
      setChange(false);
    }
  };

  return (
    <form onSubmit={handleSaveSettings} className="space-y-6 animate-scale-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs font-bold">
        <div className="bg-slate-50 dark:bg-zinc-800/30 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col justify-between min-h-[160px]">
          <label className="text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layout size={14} /> Global Theme Accent
          </label>
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-200/60 dark:border-zinc-800 relative">
            <div
              className="w-8 h-8 rounded-lg shrink-0 border border-slate-100"
              style={{ backgroundColor: themeColor===null?"#465FFF":themeColor }}
            />
            <input
              type="text"
              value={themeColor===null?"#465FFF":themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 dark:text-white uppercase focus:outline-none pl-1"
            />
            <input
              type="color"
              value={themeColor===null?"#465FFF":themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
          </div>
          <div className="flex gap-1.5 pt-1">
            {['#465FFF', '#10b981', '#f59e0b', '#ef4444'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setThemeColor(c)}
                className="w-5 h-5 rounded-full border border-white dark:border-zinc-800 shadow-xs cursor-pointer transition-transform hover:scale-110 active:scale-90"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-800/30 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col justify-between min-h-[160px]">
          <label className="text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layout size={14} /> Header Background
          </label>
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-200/60 dark:border-zinc-800 relative">
            <div
              className="w-8 h-8 rounded-lg shrink-0 border border-slate-100"
              style={{ backgroundColor: headerColor === null ? "#ffffff" : headerColor }}
            />
            <input
              type="text"
              value={headerColor===null?"#ffffff":headerColor}
              onChange={(e) => setHeaderColor(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 dark:text-white uppercase focus:outline-none pl-1"
            />
            <input
              type="color"
              value={headerColor===null?"#ffffff":headerColor}
              onChange={(e) => setHeaderColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
          </div>
          <div className="flex gap-1.5 pt-1">
            {['#ffffff', '#f8fafc', '#f1f5f9', '#0f172a'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setHeaderColor(c)}
                className="w-5 h-5 rounded-full border border-white dark:border-zinc-800 shadow-xs cursor-pointer transition-transform hover:scale-110 active:scale-90"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-800/30 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 flex flex-col justify-between min-h-[160px]">
          <label className="text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layout size={14} /> Footer Background
          </label>
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-xl border border-slate-200/60 dark:border-zinc-800 relative">
            <div
              className="w-8 h-8 rounded-lg shrink-0 border border-slate-100"
              style={{ backgroundColor: footerColor === null ? "#0f172a" : footerColor }}
            />
            <input
              type="text"
              value={footerColor===null?"#0f172a":footerColor}
              onChange={(e) => setFooterColor(e.target.value)}
              className="w-full bg-transparent border-none text-xs font-mono font-bold text-slate-800 dark:text-white uppercase focus:outline-none pl-1"
            />
            <input
              type="color"
              value={footerColor===null?"#0f172a":footerColor}
              onChange={(e) => setFooterColor(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
            />
          </div>
          <div className="flex gap-1.5 pt-1">
            {['#0f172a', '#1e293b', '#18181b', '#ffffff'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFooterColor(c)}
                className="w-5 h-5 rounded-full border border-white dark:border-zinc-800 shadow-xs cursor-pointer transition-transform hover:scale-110 active:scale-90"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 dark:bg-zinc-800/20 p-4 rounded-xl border border-slate-100 dark:border-zinc-800/60 text-xs flex items-start gap-2.5">
        <Info size={16} className="text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-slate-400 font-medium leading-relaxed">
          Changing these configurations will alter live distribution stylings
          automatically.
        </p>
      </div>
      <button
        type="submit"
        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-sm"
      >
        {isLoading ? 'Updating...' : 'Update Store Settings'}
      </button>
    </form>
  );
};

export default Brand;
