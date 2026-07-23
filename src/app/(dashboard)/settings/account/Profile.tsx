'use client';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaThreads, FaXTwitter, FaLinkedin } from 'react-icons/fa6';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";

interface ProfileProps {
  active: boolean;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<string>>;
  isOnline: boolean;
  intial: Record<string, any>;
  setProfile: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  profile: Record<string, any>;
}

const Profile = ({
  active,
  isLoading,
  setIsLoading,
  setSuccessMessage,
  isOnline,
  intial,
  profile,
  setProfile,
}: ProfileProps) => {
  const [isloading,setIsloading] = useState(false);
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData(e.currentTarget as HTMLFormElement);

    for (const key in profile) {
      if (intial && profile[key] !== intial[key]) {
        form.set(key, profile[key]);
      }
    }
    console.log(Object.fromEntries(form.entries()));
    try {
      const response = await fetch('/api/auth/update-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: profile.id,
          dataToUpdate: Object.fromEntries(form.entries()),
        }),
      });
      const data2 = await response.json();
    } catch (e: any) {}
    setIsLoading(false);
    setSuccessMessage('Account identity updated successfully!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };
  const handleupload = async (e: any) => {
    setIsloading(true);
    const formData = new FormData();
    formData.append('files', e.target.files[0]);

    const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.UPLOAD}`, { method: 'POST', body: formData });
    const [fileData] = await res.json();
    const imageUrl = `${API_CONFIG.STRAPI_BASE_URL}${fileData.url}`;
    setProfile({ ...profile, image: imageUrl });
    setIsloading(false);
  };
  

  if (active === true) {
    return (
      <form
        onSubmit={handleProfileSubmit}
        className="space-y-5 animate-scale-in"
      >
        <div className="flex items-center gap-4 border-b border-slate-50 dark:border-zinc-800/50 pb-4">
          <div className="relative">
            {isloading ? "Loading..." : profile.image!=="" && <Image
              width={512}
              height={512}
              src={
                profile.image ||
                'https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/man-user-circle-icon.png'
              }
              alt="Avatar"
              unoptimized
              className="w-16 h-16 rounded-full object-cover border border-slate-100 dark:border-zinc-700"
            />}
            <div
              className={`h-2 w-2 ${isOnline ? 'bg-green-600' : 'bg-red-600'} rounded-full absolute top-0 right-0`}
            />
          </div>
          <label onChange={(e) => handleupload(e)} className="flex items-center gap-1.5 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 cursor-pointer hover:bg-slate-100 transition-colors">
            <Upload size={13} /> Upload Avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold w-full">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase">
              Full Name
            </label>
            <input
              type="text"
              value={profile.fullName || ''}
              onChange={(e) =>
                setProfile({ ...profile, fullName: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase">
              Phone Number
            </label>
            <input
              type="text"
              value={profile.phoneNumber || ''}
              onChange={(e) =>
                setProfile({ ...profile, phoneNumber: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase">
              Resident Location
            </label>
            <input
              type="text"
              value={profile.location || ''}
              onChange={(e) =>
                setProfile({ ...profile, location: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase">
              Nationality
            </label>
            <input
              type="text"
              value={profile.nationality || ''}
              onChange={(e) =>
                setProfile({ ...profile, nationality: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase">
              Email
            </label>
            <input
              type="text"
              value={profile.email || ''}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase">
              Username
            </label>
            <input
              type="text"
              value={profile.username || ''}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2 text-xs font-bold w-full">
            <label className="text-slate-400 dark:text-zinc-500 uppercase">
              Short Biography
            </label>
            <textarea
              rows={2}
              value={profile.bio || ''}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white resize-none font-medium leading-relaxed"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold border-t border-slate-50 dark:border-zinc-800/50 pt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
              <FaXTwitter size={15} /> X (Twitter) URL
            </label>
            <input
              type="url"
              value={profile.urltwitter || ''}
              onChange={(e) =>
                setProfile({ ...profile, urltwitter: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
              <FaLinkedin size={14} /> LinkedIn URL
            </label>
            <input
              type="url"
              value={profile.urlLinkedin || ''}
              onChange={(e) =>
                setProfile({ ...profile, urlLinkedin: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
              <FaFacebook size={13} /> Facebook URL
            </label>
            <input
              type="url"
              value={profile.urlFacebook || ''}
              onChange={(e) =>
                setProfile({ ...profile, urlFacebook: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
              <FaInstagram size={14} /> Instagram URL
            </label>
            <input
              type="url"
              value={profile.urlInstagram || ''}
              onChange={(e) =>
                setProfile({ ...profile, urlInstagram: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
              <FaThreads size={13} /> Threads URL
            </label>
            <input
              type="url"
              value={profile.urlThreads || ''}
              onChange={(e) =>
                setProfile({ ...profile, urlThreads: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-400 dark:text-zinc-500 uppercase flex items-center gap-1.5">
              <FaTiktok size={13} /> TikTok URL
            </label>
            <input
              type="url"
              value={profile.urlTiktok || ''}
              onChange={(e) =>
                setProfile({ ...profile, urlTiktok: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-mono"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`${isLoading ? 'bg-gray-400' : 'bg-indigo-600'} text-white text-xs font-bold px-6 py-3 rounded-xl cursor-pointer`}
        >
          {isLoading ? 'Loading...' : 'Save Profile'}
        </button>
      </form>
    );
  }
};

export default Profile;
