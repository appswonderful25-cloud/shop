'use client';
import Image from "next/image";
import Link from "next/link";
import SidebarMenu from "./SidebarMenu";
import { useTheme } from "next-themes";
import { PanelsTopLeft } from "lucide-react";
import { useMobile } from "@/components/hooks/useMobile";
import { useLanguage } from "@/app/store/LanguageContext";

const Sidebar = ({ isSidebarOpen,setIsSidebarOpen }: { isSidebarOpen: boolean,setIsSidebarOpen:(isSidebarOpen:boolean)=>void }) => {
    const { theme } = useTheme();
    const { dir } = useLanguage();
    
    const isMobile = useMobile();
    const isMiniLaptop = useMobile("1350px");
    

    return (
        <>
        <aside
        className={`dark:bg-black fixed top-0 ${dir === "rtl" ? "right-0 border-l" : "left-0 border-r"} border-slate-100 bg-white flex flex-col justify-start select-none text-left z-50 overflow-hidden
            ${isSidebarOpen ? "h-full w-80 max-md:w-64 max-sm:w-full max-sm:p-4 p-6 opacity-100" : "h-full w-0 p-0 opacity-0 border-none"}
        `}
        style={{
            transition: "width 350ms cubic-bezier(0.4, 0, 0.2, 1), padding 350ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms cubic-bezier(0.4, 0, 0.2, 1)",
            width: isMobile && isSidebarOpen ? "calc(100vw)" : undefined,
        }}
        dir={dir}
        >
            <div className="flex items-center w-full justify-between flex-row max-[480px]:p-4 shrink-0">
                <Link href="/" className="flex items-center w-fit">
                {theme === "dark" ? <Image src="/logodark.svg" alt="Logo" className="" width={150} height={100} /> : <Image src="/logo.svg" alt="Logo" className="" width={150} height={100} />}    
                </Link>
                <button className={!isMiniLaptop?"min-[480px]:hidden":""} onClick={() => {
                    setIsSidebarOpen(!isSidebarOpen);
                }}><PanelsTopLeft /></button>
            </div>

            <div className="overflow-y-auto flex-1 min-h-0">
              <SidebarMenu isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen}/>
            </div>
            
        </aside>
        </>
        
    )
}

export default Sidebar;
