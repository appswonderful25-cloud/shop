'use client';
import { useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/app/store/LanguageContext";
import { 
  LayoutGrid,
  BarChart3, 
  Package, 
  ShoppingBag, 
  Wallet, 
  Ticket, 
  RefreshCw, 
  Bell, 
  Users2, 
  Settings2, 
  LifeBuoy,
  MessageSquare,
  Bot,
  Sparkles,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";


const getMenuData = (t: (key: string) => string) => [
  {
    id: "overview",
    title: t("sidebar.overview"),
    icon: LayoutGrid,
    path: "/overview",
    items: [],
  },
  {
    id: "analytics",
    title: t("sidebar.analytics"),
    icon: BarChart3,
    path: "/analytics",
    items: [],
  },
  {
    id: "products",
    title: t("sidebar.products"),
    icon: Package,
    path: "/products",
    items: [],
  },
  {
    id: "orders",
    title: t("sidebar.orders"),
    icon: ShoppingBag,
    path: "/orders",
    items: [],
  },
  {
    id: "wallet",
    title: t("sidebar.wallet"),
    icon: Wallet,
    path: "/wallet",
    items: [],
  },
  {
    id: "copouns",
    title: t("sidebar.coupons"),
    icon: Ticket,
    path: "/coupons",
    items: [],
  },
  {
    id: "returns",
    title: t("sidebar.returns"),
    icon: RefreshCw,
    path: "/returns",
    items: [],
  },
  {
    id: "notifications",
    title: t("sidebar.notifications"),
    icon: Bell,
    path: "/notifications",
    items: [],
  },
  {
    id: "messages",
    title: t("sidebar.messages"),
    icon: MessageSquare,
    path: "/messages",
    items: [],
  },
  {
    id: "teams",
    title: t("sidebar.teams"),
    icon: Users2,
    path: "/teams",
    items: [],
  },
  {
    id: "ai-assistant",
    title: t("sidebar.aiAssistant"),
    icon: Bot,
    path: "/ai-assistant",
    items: [],
  },
  {
    id: "settings",
    title: t("sidebar.settings"),
    icon: Settings2,
    path: "/settings",
    items: [{
      name: t("sidebar.account"),
      path: "/settings/account",
    },{
      name: t("sidebar.store"),
      path: "/settings/store",
    },{
      name: t("sidebar.aiSettings"),
      path: "/settings/ai",
    }],
  },
  {
    id: "platform-support",
    title: t("sidebar.platformSupport"),
    icon: LifeBuoy,
    path: "/platform-support",
    items: [],
  },
];

function DropdownChildren({ isOpen, items, pathname, onClose, dir }: { isOpen: boolean; items: { name: string; path: string }[]; pathname: string; onClose: () => void; dir: "ltr" | "rtl" }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | null>(null);

  const measure = useCallback(() => {
    if (innerRef.current) {
      const h = innerRef.current.getBoundingClientRect().height;
      setHeight(h);
    }
  }, []);

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  const effectiveHeight = height ?? 90;

  return (
    <div
      className={dir === "rtl" ? "mr-9" : "ml-9"}
      style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        transition: "grid-template-rows 600ms cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div style={{ overflow: "hidden" }}>
        <div
          ref={innerRef}
          style={{
            opacity: isOpen ? 1 : 0,
            transform: isOpen ? "translateX(0px)" : (dir === "rtl" ? "translateX(20px)" : "translateX(-20px)"),
            transition: "opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 550ms cubic-bezier(0.4, 0, 0.2, 1)",
            paddingTop: isOpen ? "0.5rem" : "0rem",
          }}
        >
          <ul className="text-left">
            {items.map((item, idx) => {
              const isItemActive = item.path === pathname;
              return (
                <li key={idx}>
                  <Link
                    href={item.path}
                    onClick={onClose}
                    className={`block py-2 text-[14px] font-medium w-full transition-colors rounded-lg px-3 ${
                      isItemActive ? "text-indigo-600 bg-indigo-50" : "text-slate-600 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function SidebarMenu({isSidebarOpen,setIsSidebarOpen}:{isSidebarOpen:boolean,setIsSidebarOpen:(isSidebarOpen:boolean)=>void}) {
  const { t, dir } = useLanguage();
  const pathname = usePathname();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        setIsAdmin(data?.user?.role?.name === "admin");
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, []);

  const MENU_DATA = getMenuData(t);

  // Filter menu items based on role
  const filteredMenuData = MENU_DATA.map((menu) => {
    if (menu.id === "settings") {
      return {
        ...menu,
        items: menu.items.filter((item) => item.path !== "/settings/ai" || isAdmin),
      };
    }
    return menu;
  });

  return (
    <div className="mt-10">
      <ul className="flex flex-col gap-1">
        {filteredMenuData.map((menu) => {
          const isOpen = openMenuId === menu.id;
          const MenuIcon = menu.icon;
          const isActive = menu.path === pathname;
          const hasChildren = menu.items && menu.items.length > 0;

          return (
            <li key={menu.id}>
              {hasChildren ? (
                <>
                  <div
                    onClick={() => setOpenMenuId(prev => prev === menu.id ? null : menu.id)}
                    className={`group cursor-pointer w-full flex items-center justify-between py-2 px-4 rounded-lg font-medium transition-colors ${
                      isOpen 
                        ? "bg-slate-50 text-slate-900 dark:bg-zinc-800/30 dark:text-white" 
                        : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/40 hover:text-slate-900 dark:hover:text-white" 
                    }`}
                  >
                    <div className="flex items-center justify-start gap-3">
                      <span className={isOpen ? "text-indigo-600" : "text-gray-400"}>
                        <MenuIcon />
                      </span>
                      <span>{menu.title}</span>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      className={`${dir === "rtl" ? "mr-auto" : "ml-auto"} w-5 h-5 transition-all duration-500 ease-in-out ${
                        isOpen ? "rotate-180 text-indigo-600" : "text-gray-400"
                      }`}
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4.792 7.396 10 12.604l5.208-5.208"
                      />
                    </svg>
                  </div>
                  <DropdownChildren isOpen={isOpen} items={menu.items} pathname={pathname} onClose={() => setOpenMenuId(null)} dir={dir} />
                </>
              ) : (
                <Link
                  href={menu.path}
                  onClick={() => setOpenMenuId(null)}
                  className={`group cursor-pointer w-full flex items-center justify-between py-2 px-4 rounded-lg font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600 font-bold dark:bg-zinc-800/80 dark:text-indigo-400" 
                      : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/40 hover:text-slate-900 dark:hover:text-white" 
                  }`}
                >
                  <div className="flex items-center justify-start gap-3">
                    <span className="text-gray-400">
                      <MenuIcon />
                    </span>
                    <span>{menu.title}</span>
                  </div>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
