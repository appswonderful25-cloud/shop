'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setSecureOtpCookie } from "./actions";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState("email");
  const [phone, setPhone] = useState('');


  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if(isActive=="email"){
      try {
      const response = await fetch("/api/auth/forgot-password", {
          credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMsg("Reset link has been sent to your email.");
        await setSecureOtpCookie();
        setTimeout(() => {
          router.push(`/auth/check-otp?method=email&email=${encodeURIComponent(email)}`);
        }, 300);
        setEmail('');
      } else {
        setErrorMsg(result.error || "Something went wrong.");
      }
    } catch (error) {
      setErrorMsg("Failed to connect to the server.");
    } finally {
      setLoading(false);

    }
    }
    else{
      try {
      const response = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.OTP.FORGOT}`, {
          credentials: 'include',
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: phone }),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMsg("Reset link has been sent to your phone.");
        await setSecureOtpCookie();

          setTimeout(() => {
          router.push(`/auth/check-otp?method=phone&phone=${encodeURIComponent(phone)}`);
        }, 300);

        setPhone('');
      } else {
        setErrorMsg(result.error?.message || "Something went wrong.");
      }
    } catch (error) {
      setErrorMsg("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      
      <form onSubmit={handleForgotSubmit} className="w-full max-w-md bg-white p-8 rounded-lg border border-gray-200 shadow-sm gap-4 flex flex-col">
        <div className="flex flex-row gap-1">
          <button 
          type="button" 
          onClick={() => {setErrorMsg("");setIsActive("email");setSuccessMsg("");}} 
          className={`w-full ${isActive=="email"?"bg-blue-600 hover:bg-blue-700":"bg-slate-300 hover:bg-blue-700"} text-white p-3 rounded-lg text-sm font-bold transition-all disabled:bg-gray-400`}
        >
          Email
      </button>
      <button 
          type="button" 
          onClick={() => {setErrorMsg("");setIsActive("phone");setSuccessMsg("");}} 
          className={`w-full ${isActive=="phone"?"bg-blue-600 hover:bg-blue-700":"bg-slate-300 hover:bg-blue-700"} text-white p-3 rounded-lg text-sm font-bold transition-all disabled:bg-gray-400`}
        >
          Phone
      </button>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Forgot Password</h2>
        <p className="text-sm text-gray-500">Enter your {isActive=="email"?"email address":"phone"} to receive a secure password reset link.</p>
        
        {errorMsg && <p className="text-xs font-bold text-red-500">{errorMsg}</p>}
        {successMsg && <p className="text-xs font-bold text-green-500">{successMsg}</p>}
        
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">{isActive==="email"?"Email Address":"Phone Number"}</label>
          <input 
            type={isActive=="email"?"email":"text"}
            placeholder={isActive=="email"?"Enter your email":"Enter your phone"} 
            value={isActive=="email"?email:phone}
            onChange={(e) =>{ if(isActive=="email"){setEmail(e.target.value);}else{setPhone(e.target.value);}}}
            className="w-full p-3 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500"
            required
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-sm font-bold transition-all disabled:bg-gray-400"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
