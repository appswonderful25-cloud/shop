'use client';
import { useState, useRef, useEffect } from "react";
import { Moon, Bell, Sun, Search, PanelsTopLeft } from "lucide-react";
import DropdownMenuAvatar from "@/components/header-components/AccountMenu";
import { Notification } from "@/components/header-components/Notification";
import { useTheme } from "next-themes";
import { useMobile } from "@/components/hooks/useMobile";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/store/LanguageContext";

export default function Header({ toggleMenu, openMenus }: { toggleMenu: () => void; openMenus: boolean }) {
  const { theme, setTheme } = useTheme();
  const { t, dir, locale, setLocale } = useLanguage();
  const isMobile = useMobile("1350px");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [langMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/overview?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      className={`${
        openMenus ? (dir === "rtl" ? "md:right-80" : "md:left-80") : ""
      } pointer-events-auto fixed top-0 right-0 left-0 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200/60 flex items-center justify-between px-6 z-40 !h-16 !top-0`}
      style={{ width: "auto" }}
      dir={dir}
    >
      <div className="flex items-center gap-4 flex-1 h-full">
        <button
          onClick={toggleMenu}
          className={`${
            openMenus && isMobile ? "hidden" : ""
          } bg-white p-2 rounded-lg border-gray-200 border dark:bg-black text-slate-700 dark:text-white cursor-pointer active:scale-95 transition-transform shrink-0 flex items-center justify-center`}
        >
          <PanelsTopLeft size={20} />
        </button>

        <form onSubmit={handleSearch} className="flex items-center gap-2 max-md:hidden flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className={`absolute ${dir === "rtl" ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 text-slate-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("nav.searchDashboard")}
              className={`w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-sm ${dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-white placeholder-slate-400`}
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl shrink-0 cursor-pointer"
          >
            {t("nav.searchBtn")}
          </button>
        </form>
      </div>

      <div className="flex flex-row gap-2 items-center h-full">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-white dark:bg-black p-2 rounded-lg border-gray-200 border flex items-center justify-center cursor-pointer"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Language Switcher */}
        <div className="relative" ref={langMenuRef}>
          <button
            onClick={() => setLangMenuOpen(!langMenuOpen)}
            className="bg-white dark:bg-black p-2 rounded-lg border-gray-200 border flex items-center justify-center cursor-pointer text-sm font-bold min-w-[36px]"
          >
            {locale === "ar" ? "ع" : "A"}
          </button>
          {langMenuOpen && (
            <div className={`absolute top-full mt-2 w-48 bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-lg shadow-lg z-50 ${dir === "rtl" ? "right-0" : "left-0"}`}>
              <div className="p-2">
                <div className="text-xs font-bold text-slate-400 dark:text-zinc-500 px-3 py-2 uppercase tracking-wider">
                  {t("general.language")}
                </div>
                <button
                  onClick={() => { setLocale("en"); setLangMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  <span className="text-base">🇺🇸</span>
                  <span className="font-medium text-xs">English</span>
                  {locale === "en" && (
                    <svg className="w-3.5 h-3.5 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
                <button
                  onClick={() => { setLocale("ar"); setLangMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all text-sm rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800"
                >
                  <span className="text-base">🇸🇦</span>
                  <span className="font-medium text-xs">العربية</span>
                  {locale === "ar" && (
                    <svg className="w-3.5 h-3.5 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <DropdownMenuAvatar />
        <Notification />
      </div>
    </header>
  );
}
