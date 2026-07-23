'use client';
import { useState,useEffect,useRef } from 'react';
import toast from "react-hot-toast";
import { useRouter } from 'next/navigation';
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";

const PageEmailConfirmation = ({setIsConfirm,data2,accesslogin}:{setIsConfirm?:React.Dispatch<React.SetStateAction<boolean>>,data2?:any,accesslogin?:(data2:any)=>void})=>{
  const router = useRouter();
    const [otp, setOtp] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const emailLocal = localStorage?.getItem("email")||"";

    const mounted = useRef(false);

    


   const enter = async () =>{
    try{
        const response = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.OTP.FORGOT}`, {
            credentials: 'include',
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailLocal }),
        });
        

      }
      catch(e:any){
        
        const rawMessage = e.error?.message || e.message;
      
        const cleanMessage = rawMessage.replace(/^Error:\s*/i, "");
      
        setErrorMsg(cleanMessage);
        
      }
  
    toast.success("Email sent successfully.",{duration:1000});
   }

    useEffect(() => {
      if(mounted.current){
        return;
      }
      mounted.current = true;
      enter();
    }, []);

    const handleCheckSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        try {
            setLoading(true);
            const response = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.OTP.VALIDATE}`, {
            credentials: 'include',
              method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailLocal, code: otp }),
        });
        const data = await response.json();
        
        
        
        
        if(data.ok &&accesslogin){
          await accesslogin(data2);
          if(setIsConfirm){
            setIsConfirm(true);
          }
          setLoading(false);
          setSuccessMsg("OTP code verified successfully.");
        }
        else if(data.ok){
          if(setIsConfirm){
            setIsConfirm(true);
          }
          setLoading(false);
          window.location.reload();
          setSuccessMsg("OTP code verified successfully.");
          
        }
        else{
          setErrorMsg("Invalid OTP code.");
          setLoading(false);
        }
          
           
          
          
        }   catch (error) {
          setErrorMsg("Invalid OTP code.");
        }
        
        
    }

    
   
    return (
        <div className="bg-slate-50 h-screen dark:bg-zinc-950 flex items-center justify-center">
            
            <div className=" flex-col w-1/3  flex items-center justify-center">
            {errorMsg && <p className="text-red-500 font-semibold mb-5">{errorMsg}</p>}
            {successMsg && <p className="text-green-500 font-semibold mb-5">OTP code verified successfully.</p>}
            <h2 className="text-xl font-bold text-gray-800 mb-4 ">Email Verification</h2>
            <p className="text-sm text-gray-500 mb-5">A secure 6-digit verification code has been successfully sent to your email address. Please check your inbox and enter the code to verify your identity. If you don't see it in a few moments, please check your spam or junk folder.
</p>
            <input disabled={loading} type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full p-3 bg-slate-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500" />
        
            <button onClick={handleCheckSubmit} disabled={loading} className="mt-4 w-full  bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg text-sm font-bold transition-all disabled:bg-gray-400">
                {loading ? "Verifying..." : "Verify Email"}
            </button>
            </div>
        </div>
    )
}

export default PageEmailConfirmation;