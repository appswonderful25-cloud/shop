'use client';

import {Eye, EyeOff} from "lucide-react";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";

const CheckOtpPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [otp, setOtp] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [Password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordC, setShowPasswordC] = useState(false);

    // Get method and contact info from URL params instead of localStorage (more secure)
    const method = searchParams.get('method') || "";
    const phone = searchParams.get('phone') || "";
    const email = searchParams.get('email') || "";

    // Redirect if missing required params
    useEffect(() => {
        if (!method || (!email && !phone)) {
            router.push('/auth/forgot-password');
        }
    }, [method, email, phone, router]);

    const handleCheckSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg('');
      setSuccessMsg('');


      if(method==="phone"){
            try {
              setLoading(true);
            const response = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.OTP.VALIDATE}`, {
              credentials: 'include',
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ phoneNumber: phone, otp }),
            });

            const result = await response.json();

            if(result.ok){

                setStep(2);
            }

            else {
                setErrorMsg("OTP is invalid.");

            }


        } catch (error) {
          setErrorMsg("Failed to connect to the server.");

        }
        finally{
          setLoading(false);
        }
    }
    else if(method==="email"){
      try {
        setLoading(true);
            const response = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.OTP.VALIDATE}`, {
              credentials: 'include',
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: email, code: otp }),
            });

            const result = await response.json();

            if(result.ok){

                setStep(2);
            }

            else {
                setErrorMsg("OTP is invalid.");

            }


        } catch (error) {
          setErrorMsg("Failed to connect to the server.");

        }
        finally{
          setLoading(false);
        }
    }

};

const handleCheckSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
      setErrorMsg('');
      setSuccessMsg('');
      
      if(Password!==confirmPassword){
        setErrorMsg("Passwords do not match.");
        return;
      }
    if(step===2&&method==="phone"){
                try {
                  setLoading(true);
                const response = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.OTP.RESET}`, {
                credentials: 'include',
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phoneNumber: phone, otp,password:Password,passwordConfirmation:confirmPassword }),
                });
                const data = await response.json();
                
                setSuccessMsg("Password reset successfully.");
                setLoading(true);
                router.replace('/login');
                
                
            }
            catch (error) {
              setErrorMsg("Failed to connect to the server.");
              
            }
            finally{
              setLoading(false);
            }
    }
    else if(step===2&&method==="email"){
      try {
        setLoading(true);
                const response = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.OTP.RESET}`, {
                credentials: 'include',
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code:otp,password:Password,passwordConfirmation:confirmPassword }),
                });
                const data = await response.json();

                    setSuccessMsg("Password reset successfully.");
                    setLoading(true);
                    router.replace('/login');
                
            }
            catch (error) {
              setErrorMsg("Failed to connect to the server.");
              
            }
            finally{
              setLoading(false);
            }
    }
}
    return (
        <div className="bg-slate-50 dark:bg-zinc-950 flex flex-col items-center justify-center">
         
            <div className="flex min-h-screen flex-col items-center justify-center w-90 p-6">
              {step===1&&(<><h1 className="text-2xl font-bold text-gray-800 mb-4">Verify OTP</h1>
          <label className="text-xs font-semibold text-gray-600 mb-8">Please enter the OTP sent to your registered email address or phone number.</label></>)}

        {errorMsg && <p className="text-xs font-bold text-red-500 mb-4">{errorMsg}</p>}
      {successMsg && <p className="text-xs font-bold text-green-500 mb-4">{successMsg}</p>}

      { step===1 && 
         (<>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
      
            <button disabled={loading} onClick={handleCheckSubmit} className="mt-4 w-full  bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-sm font-bold transition-all disabled:bg-gray-400">
                {loading ? "Verifying..." : "Verify OTP"}
            </button>
        </>
        )
    }
    {
        step===2 && 
        (<>
            <h2 className="text-xl font-bold text-gray-800 mb-4 ">Set New Password</h2>
            <div className="flex flex-col gap-1 relative w-full">
              <label className="text-xs font-semibold text-gray-600">New Password</label>
              <div className="w-full">
                <input 
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password" 
                value={Password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-gray-200 rounded-lg text-base px-2.5 py-3.5 outline-none focus:border-blue-500"
                required
                disabled={loading}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              </div>

            </div>

            <div className="flex flex-col gap-1 mt-4 relative w-full">
              <label className="text-xs font-semibold text-gray-600">Confirm Password</label>
              <div className="w-full">
                <input 
                type={showPasswordC ? "text" : "password"}
                placeholder="Confirm new password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-slate-50 border text-base px-2.5 py-3.5 border-gray-200 rounded-lg  outline-none focus:border-blue-500"
                required
                disabled={loading}
              />
              <button type="button" onClick={() => setShowPasswordC(!showPasswordC)} className="absolute right-4 top-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
                {showPasswordC ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              onClick={handleCheckSubmit2}
              disabled={loading}
              className=" bg-blue-600 mt-4 w-full hover:bg-blue-700 text-white p-3 rounded-lg text-sm font-bold transition-all disabled:bg-gray-400"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
        </>
        )
    }
    </div>
        </div>
    
  );
}

export default CheckOtpPage;