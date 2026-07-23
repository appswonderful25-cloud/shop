import { useState } from 'react';

interface TaxAndPostProps {
  active: boolean;
  profile: Record<string, any>;
  setProfile: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
}

const TaxAndPost = ({
  active,
  profile,
  setProfile,
  setSuccessMessage,
}: TaxAndPostProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(form.entries());
    console.log(data);
    setProfile({ ...profile, ...data });
    try {
      const response = await fetch('/api/auth/update-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: profile.id, dataToUpdate: data }),
      });
      const data2 = await response.json();
      if (response.ok) {
        setSuccessMessage('Account identity updated successfully.');
        setTimeout(() => setSuccessMessage(''), 4000);
      }
    } catch (e: any) {
      alert('error in updating profile');
    }
    finally {
      setIsLoading(false);
    }
  };
  if (active === true) {
    return (
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md text-xs font-bold animate-scale-in"
      >
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 dark:text-zinc-500 uppercase">
            Tax ID
          </label>
          <input
            type="text"
            value={profile.taxid || ''}
            name="taxid"
            onChange={(e) => setProfile({ ...profile, taxid: e.target.value })}
            className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-400 dark:text-zinc-500 uppercase">
            Postal Code
          </label>
          <input
            type="text"
            value={profile.postCode || ''}
            name="postCode"
            onChange={(e) =>
              setProfile({ ...profile, postCode: e.target.value })
            }
            className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl text-slate-900 dark:text-white font-mono"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`${isLoading ? 'bg-gray-400' : 'bg-indigo-600'} text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer`}
        >
          {isLoading ? 'Loading...' : 'Save Changes'}
        </button>
      </form>
    );
  }
};

export default TaxAndPost;
