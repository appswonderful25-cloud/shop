"use client";

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { STORE_THEMES, type StoreTheme } from "@/lib/store-themes";
import { STORE_CATEGORIES, type StoreCategory, CATEGORY_LIST } from "@/lib/store-categories";

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") || "http://localhost:1337";

export interface Product {
  id: number;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  price: number;
  count: number;
  productCategory: string;
  productCategoryAr?: string;
  statusProduct: string;
  image?: { url: string } | null;
}

export interface CartItem { product: Product; quantity: number; }

interface Coupon { id: number; couponCode: string; discount: number; discountType: string; statusCoupon: boolean; dateEndCoupon: string; }

interface CustomerUser {
  id: number; username: string; email: string; fullName?: string;
  phoneNumber?: string; nationality?: string; role?: { name: string; type: string };
}

interface StoreSettings {
  nameStore: string; descriptionStore: string; globalColor: string; headerColor: string; headerTextColor: string; footerColor: string;
  currency: string; language: string; emailStore: string; phoneStore: string; addressStore: string;
  urlLogo: string; urlImageHero: string; urlFavicon: string; seoTitle: string; seoDescription: string;
  seoKeywords: string; acceptCOD: boolean; acceptCard: boolean; acceptPaypal: boolean;
  taxPercentage: number; shippingCost: number; headerMenu: Array<{ label: string; url: string }>;
  isMaintenanceMode: boolean; urlFacebook: string; urlInstagram: string; urlTwitter: string;
  urlTiktok: string; urlLinkedin: string; urlPolicy: string; urlTerms: string; urlSupport: string;
  urlShippingReturnsPolicy: string; urlAbout: string; urlContact: string; urlFAQ: string; urlTracking: string;
}

export const CATEGORY_IMAGES: Record<string, string> = {
  clothing: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&q=80",
  accessories: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&q=80",
  shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80",
  electronics: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&q=80",
  audio: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80",
  displays: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=300&q=80",
  peripherals: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&q=80",
  wearables: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80",
  "smart-home": "https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=300&q=80",
  storage: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&q=80",
  bakery: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80",
  pantry: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80",
  beverages: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80",
  sweets: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=300&q=80",
  dairy: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&q=80",
  gifts: "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=300&q=80",
  skincare: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=300&q=80",
  makeup: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80",
  haircare: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=300&q=80",
  fragrance: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&q=80",
  tools: "https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=300&q=80",
  furniture: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80",
  lifestyle: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  fitness: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&q=80",
  stationery: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=300&q=80",
  kitchen: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80",
  garden: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80",
  general: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=300&q=80",
};

const StoreContextType = createContext<{
  settings: Partial<StoreSettings>; products: Product[]; coupons: Coupon[]; loading: boolean;
  theme: StoreTheme; currentThemeName: string; setThemeByName: (n: string) => void;
  saveThemeToServer: () => Promise<boolean>; activeCoupon: Coupon | undefined;
  cart: CartItem[]; addToCart: (p: Product, qty?: number) => void; removeFromCart: (id: number) => void;
  updateCartQty: (id: number, qty: number) => void; cartCount: number; cartTotal: number;
  showCart: boolean; setShowCart: (v: boolean) => void;
  showWishlist: boolean; setShowWishlist: (v: boolean) => void;
  wishlistProducts: Product[];
  searchQuery: string; setSearchQuery: (v: string) => void;
  wishlist: number[]; toggleWishlist: (id: number) => void; isWishlisted: (id: number) => boolean;
  activeStoreCategory: string; setActiveStoreCategory: (id: string) => void;
  storeCategories: typeof CATEGORY_LIST;
  activeCategoryData: StoreCategory | null;
  customerUser: CustomerUser | null; customerLoading: boolean; logoutCustomer: () => void;
} | null>(null);

export function useStore() {
  const ctx = useContext(StoreContextType);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Partial<StoreSettings>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentThemeName, setCurrentThemeName] = useState("aurora");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [activeStoreCategory, setActiveStoreCategory] = useState("all");
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [locale, setLocaleState] = useState<"en" | "ar">("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("store_locale");
      if (saved === "ar" || saved === "en") setLocaleState(saved);
    } catch {}
    const handler = () => {
      try {
        const saved = localStorage.getItem("store_locale");
        if (saved === "ar" || saved === "en") setLocaleState(saved);
      } catch {}
    };
    window.addEventListener("storage", handler);
    window.addEventListener("locale-changed", handler);
    return () => {
      window.removeEventListener("storage", handler);
      window.removeEventListener("locale-changed", handler);
    };
  }, []);

  useEffect(() => {
    try { const saved = localStorage.getItem("store_wishlist"); if (saved) setWishlist(JSON.parse(saved)); } catch {}
  }, []);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(r => r.json())
      .then(data => {
        if (data.token && data.user) {
          const roleType = data.user?.role?.type || '';
          if (roleType !== 'admin' && roleType !== 'manager' && roleType !== 'support_agent') {
            setCustomerUser(data.user);
          }
        }
      })
      .catch(() => {})
      .finally(() => setCustomerLoading(false));
  }, []);

  const logoutCustomer = useCallback(() => {
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    document.cookie.split(";").forEach(c => {
      document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    });
    setCustomerUser(null);
  }, []);

  const toggleWishlist = useCallback((id: number) => {
    setWishlist(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      try { localStorage.setItem("store_wishlist", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const isWishlisted = useCallback((id: number) => wishlist.includes(id), [wishlist]);

  useEffect(() => {
    Promise.all([
      fetch(`${STRAPI_BASE}/api/store-setting/public`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${STRAPI_BASE}/api/products?pagination[pageSize]=100&sort=createdAt:desc`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${STRAPI_BASE}/api/coupons?pagination[pageSize]=20`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([sData, pData, cData]) => {
      const s = sData || {};
      setSettings(s);
      setProducts(pData?.data || []);
      setCoupons((cData?.data || []).filter((c: Coupon) => c.statusCoupon));
      const saved = s.globalColor ? Object.keys(STORE_THEMES).find(k => STORE_THEMES[k].globalColor === s.globalColor) || "aurora" : "aurora";
      setCurrentThemeName(saved);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const baseTheme = STORE_THEMES[currentThemeName] || STORE_THEMES.aurora;
  const setThemeByName = (name: string) => setCurrentThemeName(name);
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));
  const activeCategoryData = useMemo(() => {
    if (activeStoreCategory === "all") return null;
    return STORE_CATEGORIES[activeStoreCategory] || null;
  }, [activeStoreCategory]);

  const theme = useMemo(() => {
    const arabicFont = "var(--font-tajawal), system-ui, sans-serif";
    const merged = !activeCategoryData ? baseTheme : (() => {
      const ct = activeCategoryData.theme;
      return {
        ...baseTheme,
        globalColor: ct.primary,
        headerColor: ct.headerBg,
        headerTextColor: ct.headerText,
        footerColor: ct.footerBg,
        footerTextColor: ct.footerText,
        footerMutedText: ct.footerMuted,
        accentColor: ct.accent,
        cardBg: ct.cardBg,
        textColor: ct.textColor,
        mutedText: ct.mutedText,
        border: ct.border,
        badge: ct.badge,
        bannerBg: ct.bg,
        borderRadius: activeCategoryData.borderRadius,
        fontDisplay: activeCategoryData.fontFamily,
      };
    })();
    if (locale === "ar") {
      return { ...merged, fontDisplay: arabicFont };
    }
    return merged;
  }, [baseTheme, activeCategoryData, locale]);
  const saveThemeToServer = async () => {
    const t = STORE_THEMES[currentThemeName]; if (!t) return false;
    try {
      const token = document.cookie.match(/accessToken=([^;]+)/)?.[1] || "";
      const res = await fetch(`${STRAPI_BASE}/api/store-setting/me`, {
        method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data: { globalColor: t.globalColor, headerColor: t.headerColor, footerColor: t.footerColor } }),
      }); return res.ok;
    } catch { return false; }
  };

  const addToCart = useCallback((p: Product, qty = 1) => {
    setCart(prev => {
      const exist = prev.find(c => c.product.id === p.id);
      if (exist) return prev.map(c => c.product.id === p.id ? { ...c, quantity: c.quantity + qty } : c);
      return [...prev, { product: p, quantity: qty }];
    });
    setShowCart(true);
  }, []);

  const removeFromCart = useCallback((id: number) => setCart(prev => prev.filter(c => c.product.id !== id)), []);
  const updateCartQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) return setCart(prev => prev.filter(c => c.product.id !== id));
    setCart(prev => prev.map(c => c.product.id === id ? { ...c, quantity: qty } : c));
  }, []);

  return (
    <StoreContextType.Provider value={{
      settings, products, coupons, loading, theme, currentThemeName, setThemeByName, saveThemeToServer,
      activeCoupon: coupons[0], cart, addToCart, removeFromCart, updateCartQty,
      cartCount: cart.reduce((s, c) => s + c.quantity, 0),
      cartTotal: cart.reduce((s, c) => s + c.product.price * c.quantity, 0),
      showCart, setShowCart, showWishlist, setShowWishlist, wishlistProducts,
      searchQuery, setSearchQuery,
      wishlist, toggleWishlist, isWishlisted,
      activeStoreCategory, setActiveStoreCategory, storeCategories: CATEGORY_LIST, activeCategoryData,
      customerUser, customerLoading, logoutCustomer,
    }}>
      {children}
    </StoreContextType.Provider>
  );
}
