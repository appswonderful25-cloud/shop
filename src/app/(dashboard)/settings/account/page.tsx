'use client';

import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Receipt,
  Monitor,
  CheckCircle2,
} from 'lucide-react';

import DevicesComponent from './Devices';

import TwoFactorModal from './TwoFactorModal';
import Image from 'next/image';
import { useSocket } from '@/components/hooks/SocketConnection';
import Profile from './Profile';
import Auth from './Auth';
import TaxAndPost from './TaxAndPost';

interface Device {
  id: number;
  type: string;
  name: string;
  location: string;
  active: string;
  current: boolean;
}
export default function Settings() {
  const { socket, connected } = useSocket();

  const [isOnline, setIsOnline] = useState(false);
  const [activeSection, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const [profile, setProfile] = useState<Record<string, any>>({});
  const [intial, setInitial] = useState<Record<string, any>>({});

  const [security, setSecurity] = useState<Record<string, any>>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
    twoFactorEmail: false,
    twoFactorMobile: true,
  });


  useEffect(() => {
    setIsLoadingPage(true);
    const fun = async () => {
      try {
        const data = await fetch('/api/auth/get-account', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await data.json();
        if (data.ok) {
          setProfile(result);
          setInitial({ ...result });
          setIsLoadingPage(false);
        }
      } catch (e) {
        console.error('Failed to load account:', e);
        setIsLoadingPage(false);
      }
    };

    fun();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    // Set initial state immediately based on socket connection
    setIsOnline(socket.connected);

    socket.on('connect', () => {
      setIsOnline(true);
    });
    socket.on('disconnect', () => {
      setIsOnline(false);
    });
    
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  const handle2FASuccess = () => {};
  if (isLoadingPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
        <div className="w-12 h-12 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-xl font-semibold text-[#4f46e5] animate-pulse">
          Loading store settings, please wait... 🚀
        </h2>
      </div>
    );
  }

  return (
    <div
      className="w-full max-w-5xl mx-auto space-y-6 text-left relative"
      dir="ltr"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <SettingsIcon
              className="text-indigo-600 dark:text-indigo-400"
              size={26}
            />
            System Settings
          </h1>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold animate-scale-in">
          <CheckCircle2 size={16} /> {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        <div className="md:col-span-1 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-2.5 shadow-sm space-y-1">
          {[
            { id: 'profile', label: 'Profile Identity', icon: User },
            { id: 'security', label: 'Security & Auth', icon: Shield },
            { id: 'billing', label: 'Taxes & Postal', icon: Receipt },
            { id: 'devices', label: 'Sessions Logs', icon: Monitor },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeSection === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50'}`}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </div>

        <div className="md:col-span-3 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 shadow-sm min-h-[400px]">
          <Profile
            active={activeSection === 'profile'}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setSuccessMessage={setSuccessMessage}
            isOnline={isOnline}
            intial={intial}
            profile={profile}
            setProfile={setProfile}
          />

          <Auth
            active={activeSection === 'security'}
            setIs2FAModalOpen={setIs2FAModalOpen}
            security={security}
            setSecurity={setSecurity}
            setSuccessMessage={setSuccessMessage}
            id={profile.id}
          />

          <TaxAndPost
            active={activeSection === 'billing'}
            profile={profile}
            setProfile={setProfile}
            setSuccessMessage={setSuccessMessage}
          />
          <DevicesComponent
            active={activeSection === 'devices'}
          />
        </div>
      </div>

      <TwoFactorModal
        isOpen={is2FAModalOpen}
        onClose={() => setIs2FAModalOpen(false)}
        onSuccess={handle2FASuccess}
      />
    </div>
  );
}
