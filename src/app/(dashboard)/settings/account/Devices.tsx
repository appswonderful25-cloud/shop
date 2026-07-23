'use client';
import Image from "next/image";
import {useEffect,useState} from 'react';

interface DevicesProps {
  active: boolean;
}
interface Device {
  id: number;
  type: string;
  name: string;
  location: string;
  active: string;
  current: boolean;
  sessionId?: string;
  os?: string;
  device?: string;
  isCurrent?: boolean;
  country?: string;
}

const DevicesComponent = ({active}: DevicesProps) => {
  const [devices,setDevices] = useState<any>([]);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  const handleDevice = async ()=>{
    try{
      setIsLoading(true);
      const response = await fetch('/api/auth/getSession',{
        method:'GET',
        headers:{
          'Content-Type':'application/json',
        },
      })
      const data = await response.json();
      if(data){
        console.log(data);
        setDevices(data.sessions);
      }
    }
    catch(e:any){}
    finally{
      setIsLoading(false);
    }
  }
  useEffect(() => {
    handleDevice();
  }, []);

  const handleDeviceLogOut2 = async (id:string) => {
    try{
      setIsLoading(true);
      const response = await fetch(`/api/auth/logout-session`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json',
        },
        body:JSON.stringify({sessionId:id}),
      })
      setDevices(devices.filter((d:Device)=>d.sessionId!==id));
      console.log("success")
    }catch(e:any){}finally{
      setIsLoading(false);
    }
  }
  

  if(isLoading&&active===true){
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
      <div className="w-12 h-12 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin"></div>
      <h2 className="text-xl font-semibold text-[#4f46e5] animate-pulse">
        Loading store devices, please wait... 🚀
      </h2>
      </div>
    )
  }
  if (active === true) {
    return (
    <div className="space-y-4 animate-scale-in">
      <div className="divide-y divide-slate-50 dark:divide-zinc-800/50">
        {devices.map((dev:Device) => (
          <div
            key={dev.sessionId||dev.id}
            className="flex items-center justify-between py-4 gap-6 w-full animate-scale-in border-b border-slate-50 last:border-none"
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16  flex items-center justify-center overflow-hidden  shrink-0 ">
                {dev.os === 'windows' ? (
                  <Image
                    width={200}
                    height={200}
                    src="/macbook.png"
                    alt="MacBook"
                    className="w-25 h-10"
                  />
                ) : (
                  <Image
                    width={300}
                    height={300}
                    src="/iphone.webp"
                    alt="iPhone"
                    className="w-6 h-11"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-base font-extrabold text-slate-950 dark:text-white tracking-wide">
                    {dev.device}
                  </h4>
                  {dev.isCurrent && (
                    <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                      Current Node
                    </span>
                  )}
                </div>
                <p className="text-xs font-bold text-slate-400 dark:text-zinc-500 flex items-center gap-2">
                  <span>📍 {dev.country}</span>
                  <span className="opacity-40">•</span>
                  <span>🌐 Active: {dev.current===true?"Yes":"No"}</span>
                </p>
              </div>
            </div>

            {!dev.isCurrent && (
              <button
                onClick={() => handleDeviceLogOut2(dev.sessionId||"")}
                className="flex items-center gap-1.5 text-xs font-black text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-4 py-2.5 rounded-xl border border-rose-100 dark:border-none transition-all cursor-pointer active:scale-95 shrink-0 shadow-2xs"
              >
                Revoke Node
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
    );
  }
};

export default DevicesComponent;