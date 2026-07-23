"use client";

import { useState } from "react";
import { Smartphone, Mail, ShieldCheck, Lock } from "lucide-react";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (method: string) => void;
}

export default function TwoFactorModal({ isOpen, onClose, onSuccess }: TwoFactorModalProps) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("SMS");
  const [inputVal, setInputInput] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      setError("");
    } else if (step === 2) {
      if (!inputVal.trim()) {
        setError("This field is required.");
        return;
      }
      if (method === "Email" && !validateEmail(inputVal.trim())) {
        setError("Invalid email format.");
        return;
      }
      if (method === "SMS" && !/^\+?[0-9]{10,15}$/.test(inputVal.trim())) {
        setError("Invalid international phone format.");
        return;
      }
      setError("");
      setStep(3);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs" onClick={onClose} />
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-sm shadow-xl z-50 animate-scale-in text-left relative space-y-4">
        
        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100/40 dark:border-rose-900/30 p-2.5 rounded-xl text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
            <Lock size={14} /> {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4 text-xs font-bold">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><Smartphone size={18} className="text-indigo-600" /> Step 1: Choose Method</h3>
            <div className="space-y-2">
              <div onClick={() => setMethod("SMS")} className={`p-3 rounded-xl border cursor-pointer transition-all ${method === "SMS" ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20" : "border-slate-100 dark:border-zinc-800"}`}>
                <span className="text-slate-900 dark:text-white block">💬 Text Message (SMS)</span>
              </div>
              <div onClick={() => setMethod("Email")} className={`p-3 rounded-xl border cursor-pointer transition-all ${method === "Email" ? "border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/20" : "border-slate-100 dark:border-zinc-800"}`}>
                <span className="text-slate-900 dark:text-white block">✉️ Email Security</span>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border text-slate-500 cursor-pointer">Cancel</button>
              <button type="button" onClick={handleNext} className="bg-indigo-600 text-white px-5 py-2 rounded-xl cursor-pointer">Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 text-xs font-bold">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><Mail size={18} className="text-indigo-600" /> Step 2: Credentials</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-400 dark:text-zinc-500 uppercase">{method === "SMS" ? "Phone Number" : "Email Destination"}</label>
              <input type={method === "SMS" ? "tel" : "email"} placeholder={method === "SMS" ? "+970599123456" : "you@example.com"} value={inputVal} onChange={e => setInputInput(e.target.value)} className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white font-semibold" />
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setStep(1)} className="px-4 py-2 rounded-xl border text-slate-500 cursor-pointer">Back</button>
              <button type="button" onClick={handleNext} className="bg-indigo-600 text-white px-5 py-2 rounded-xl cursor-pointer">Send Code</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 text-xs font-bold">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><ShieldCheck size={18} className="text-emerald-600" /> Step 3: Verify 6-Digit OTP</h3>
            <input type="text" maxLength={6} placeholder="••••••" value={otp} onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ""))} className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 p-3 text-center tracking-widest text-lg font-bold rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white" />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setStep(2)} className="px-4 py-2 rounded-xl border text-slate-500 cursor-pointer">Back</button>
              <button type="button" onClick={() => {
                if (otp.length !== 6) { setError("Security code protocol requires exactly 6-digits token."); return; }
                onSuccess(method);
              }} className="bg-emerald-600 text-white px-5 py-2 rounded-xl cursor-pointer">Activate</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
