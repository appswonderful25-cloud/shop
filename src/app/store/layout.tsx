"use client";

import { StoreProvider, useStore } from "./StoreContext";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { LOCALES, type Locale } from "@/lib/i18n";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { STORE_THEMES } from "@/lib/store-themes";
import { CATEGORY_LIST } from "@/lib/store-categories";

function CartDrawer() {
  const { cart, removeFromCart, updateCartQty, cartTotal, showCart, setShowCart, theme } = useStore();
  const { t, dir } = useLanguage();
  const br = theme.borderRadius;
  if (!showCart) return null;
  const isRtl = dir === "rtl";
  return (
    <div className="fixed inset-0 z-[200]" onClick={() => setShowCart(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={`absolute top-0 h-full w-full max-w-md shadow-2xl flex flex-col ${isRtl ? "left-0" : "right-0"}`} style={{ background: theme.cardBg, [isRtl ? "borderRight" : "borderLeft"]: `1px solid ${theme.border}` }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: theme.border }}>
          <div>
            <h2 className="text-base font-semibold tracking-tight" style={{ color: theme.textColor }}>{t("cart.title")}</h2>
            <p className="text-xs mt-0.5" style={{ color: theme.mutedText }}>{cart.length} {cart.length === 1 ? t("cart.item") : t("cart.items")}</p>
          </div>
          <button onClick={() => setShowCart(false)} className="w-8 h-8 flex items-center justify-center transition-colors hover:opacity-60" style={{ color: theme.mutedText }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ background: `${theme.globalColor}08` }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="1.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
              </div>
              <p className="text-sm font-medium" style={{ color: theme.textColor }}>{t("cart.empty")}</p>
              <p className="text-xs mt-1" style={{ color: theme.mutedText }}>{t("cart.emptyHint")}</p>
            </div>
          ) : cart.map(item => (
            <div key={item.product.id} className="flex gap-3 p-3" style={{ borderRadius: br, border: `1px solid ${theme.border}` }}>
              <div className="w-16 h-16 overflow-hidden flex-shrink-0 rounded-lg" style={{ background: `${theme.globalColor}08` }}>
                <div className="w-full h-full flex items-center justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium truncate" style={{ color: theme.textColor }}>{item.product.title}</h4>
                <p className="text-sm font-semibold mt-0.5" style={{ color: theme.globalColor }}>${item.product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button onClick={() => updateCartQty(item.product.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-xs" style={{ borderRadius: "0.25rem", border: `1px solid ${theme.border}`, color: theme.textColor }}>-</button>
                  <span className="text-xs font-medium" style={{ color: theme.textColor }}>{item.quantity}</span>
                  <button onClick={() => updateCartQty(item.product.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-xs" style={{ borderRadius: "0.25rem", border: `1px solid ${theme.border}`, color: theme.textColor }}>+</button>
                  <button onClick={() => removeFromCart(item.product.id)} className="ml-auto text-[10px] font-medium uppercase tracking-wider opacity-50 hover:opacity-100" style={{ color: "#EF4444" }}>{t("cart.remove")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="p-6 border-t" style={{ borderColor: theme.border }}>
            <div className="flex justify-between mb-4"><span className="text-sm" style={{ color: theme.mutedText }}>{t("cart.subtotal")}</span><span className="text-lg font-semibold" style={{ color: theme.textColor }}>${cartTotal.toFixed(2)}</span></div>
            <button className="w-full py-3.5 text-sm font-medium text-white transition-all hover:opacity-90" style={{ borderRadius: br, background: `linear-gradient(135deg, ${theme.globalColor}, ${theme.accentColor})` }}>
              {t("cart.checkout")} — ${cartTotal.toFixed(2)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function WishlistDrawer() {
  const { showWishlist, setShowWishlist, wishlistProducts, theme, addToCart, toggleWishlist } = useStore();
  const { t, dir } = useLanguage();
  const br = theme.borderRadius;
  if (!showWishlist) return null;
  const isRtl = dir === "rtl";
  return (
    <div className="fixed inset-0 z-[200]" onClick={() => setShowWishlist(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={`absolute top-0 h-full w-full max-w-md shadow-2xl flex flex-col ${isRtl ? "left-0" : "right-0"}`} style={{ background: theme.cardBg, [isRtl ? "borderRight" : "borderLeft"]: `1px solid ${theme.border}` }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: theme.border }}>
          <div>
            <h2 className="text-base font-semibold tracking-tight" style={{ color: theme.textColor }}>{t("wishlist.title")}</h2>
            <p className="text-xs mt-0.5" style={{ color: theme.mutedText }}>{wishlistProducts.length} {t("wishlist.items")}</p>
          </div>
          <button onClick={() => setShowWishlist(false)} className="w-8 h-8 flex items-center justify-center transition-colors hover:opacity-60" style={{ color: theme.mutedText }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full" style={{ background: `${theme.globalColor}08` }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
              </div>
              <p className="text-sm font-medium" style={{ color: theme.textColor }}>{t("wishlist.empty")}</p>
              <p className="text-xs mt-1" style={{ color: theme.mutedText }}>{t("wishlist.emptyHint")}</p>
            </div>
          ) : wishlistProducts.map(product => (
            <div key={product.id} className="flex gap-3 p-3" style={{ borderRadius: br, border: `1px solid ${theme.border}` }}>
              <Link href={`/store/product/${product.id}`} onClick={() => setShowWishlist(false)} className="w-16 h-16 overflow-hidden flex-shrink-0 rounded-lg" style={{ background: `${theme.globalColor}08` }}>
                <div className="w-full h-full flex items-center justify-center"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg></div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/store/product/${product.id}`} onClick={() => setShowWishlist(false)}>
                  <h4 className="text-sm font-medium truncate hover:underline" style={{ color: theme.textColor }}>{product.title}</h4>
                </Link>
                <p className="text-sm font-semibold mt-0.5" style={{ color: theme.globalColor }}>${product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <button onClick={() => addToCart(product)} className="px-3 py-1 text-[10px] font-medium text-white" style={{ borderRadius: "0.25rem", background: theme.globalColor }}>{t("wishlist.addToCart")}</button>
                  <button onClick={() => toggleWishlist(product.id)} className="px-3 py-1 text-[10px] font-medium opacity-50 hover:opacity-100" style={{ color: "#EF4444" }}>{t("wishlist.remove")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ThemeSwitcher() {
  const { theme, currentThemeName, setThemeByName, saveThemeToServer, activeStoreCategory, setActiveStoreCategory } = useStore();
  const { t, dir, locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<"themes" | "categories">("categories");
  const ref = useRef<HTMLDivElement>(null);
  const br = theme.borderRadius;

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleSave = async () => {
    setSaving(true); const ok = await saveThemeToServer(); setSaving(false);
    if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  };

  return (
    <div ref={ref} className="fixed bottom-6 z-[100] flex flex-col gap-3" style={{ [dir === "rtl" ? "left" : "right"]: "1.5rem", [dir === "rtl" ? "right" : "left"]: "auto", alignItems: dir === "rtl" ? "flex-start" : "flex-end" }}>
      {open && (
        <div className="shadow-2xl border overflow-hidden w-80" style={{ background: theme.cardBg, borderColor: theme.border, borderRadius: br }}>
          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: theme.border }}>
            <button onClick={() => setTab("categories")}
              className="flex-1 py-3 text-xs font-medium transition-colors"
              style={{ color: tab === "categories" ? theme.globalColor : theme.mutedText, borderBottom: tab === "categories" ? `2px solid ${theme.globalColor}` : "2px solid transparent" }}>
              {t("theme.storeType")}
            </button>
            <button onClick={() => setTab("themes")}
              className="flex-1 py-3 text-xs font-medium transition-colors"
              style={{ color: tab === "themes" ? theme.globalColor : theme.mutedText, borderBottom: tab === "themes" ? `2px solid ${theme.globalColor}` : "2px solid transparent" }}>
              {t("theme.theme")}
            </button>
          </div>

          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {tab === "categories" ? (
              <div className="space-y-1.5">
                <button onClick={() => setActiveStoreCategory("all")}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all text-sm"
                  style={{ borderRadius: br, background: activeStoreCategory === "all" ? `${theme.globalColor}12` : "transparent", color: activeStoreCategory === "all" ? theme.globalColor : theme.textColor }}>
                  <span className="text-lg">🏪</span>
                  <div>
                    <div className="font-medium text-sm">{t("theme.allProducts")}</div>
                    <div className="text-[10px] opacity-60">{t("theme.defaultView")}</div>
                  </div>
                </button>
                {CATEGORY_LIST.map(cat => (
                  <button key={cat.id} onClick={() => setActiveStoreCategory(cat.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all text-sm"
                    style={{ borderRadius: br, background: activeStoreCategory === cat.id ? `${theme.globalColor}12` : "transparent", color: activeStoreCategory === cat.id ? theme.globalColor : theme.textColor }}>
                    <span className="text-lg">{cat.icon}</span>
                    <div>
                  <div className="font-medium text-sm">{locale === "ar" ? cat.nameAr : cat.name}</div>
                      <div className="text-[10px] opacity-60">{cat.layoutType} {t("theme.layout")}</div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-1.5">
                {Object.entries(STORE_THEMES).map(([name, st]) => (
                  <button key={name} onClick={() => setThemeByName(name)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all text-sm"
                    style={{ borderRadius: br, background: currentThemeName === name ? `${st.globalColor}12` : "transparent", color: currentThemeName === name ? st.globalColor : theme.textColor }}>
                    <div className="flex gap-1 shrink-0">
                      <div className="w-4 h-4 rounded-full" style={{ background: st.globalColor }} />
                      <div className="w-4 h-4 rounded-full" style={{ background: st.headerColor }} />
                    </div>
                    <div className="font-medium text-sm">{st.label}</div>
                    {currentThemeName === name && <span className="ml-auto text-[10px] font-medium" style={{ color: st.globalColor }}>{t("theme.active")}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {tab === "themes" && (
            <div className="p-4 border-t" style={{ borderColor: theme.border }}>
              <button onClick={handleSave} disabled={saving}
                className="w-full py-2.5 text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ borderRadius: br, background: saved ? "#22C55E" : theme.globalColor }}>
                {saving ? t("theme.saving") : saved ? t("theme.saved") : t("theme.saveTheme")}
              </button>
            </div>
          )}
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        className="w-12 h-12 shadow-xl flex items-center justify-center text-white transition-all hover:scale-110"
        style={{ borderRadius: "50%", background: `linear-gradient(135deg, ${theme.globalColor}, ${theme.accentColor})` }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
      </button>
    </div>
  );
}

function LanguageSwitcher() {
  const { locale, setLocale, dir, t } = useLanguage();
  const storeTheme = useStore().theme;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-6 z-[100] flex flex-col gap-3" style={{ [dir === "rtl" ? "right" : "left"]: "1.5rem", [dir === "rtl" ? "left" : "right"]: "auto", alignItems: dir === "rtl" ? "flex-end" : "flex-start" }}>
      {open && (
        <div className="shadow-2xl border overflow-hidden w-44" style={{ background: storeTheme.cardBg, borderColor: storeTheme.border, borderRadius: storeTheme.borderRadius }}>
          <div className="p-2">
            {LOCALES.map(loc => (
                <button key={loc.code} onClick={() => { setLocale(loc.code); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all text-sm"
                  style={{ borderRadius: storeTheme.borderRadius, background: locale === loc.code ? `${storeTheme.globalColor}12` : "transparent", color: locale === loc.code ? storeTheme.globalColor : storeTheme.textColor }}>
                  <span className="text-base">{loc.flag}</span>
                  <span className="font-medium text-xs">{loc.label}</span>
                  {locale === loc.code && <svg className={`w-3.5 h-3.5 ${locale === 'ar' ? 'mr-auto' : 'ml-auto'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
            ))}
          </div>
        </div>
      )}
      <button onClick={() => setOpen(!open)}
        className="w-12 h-12 shadow-xl flex items-center justify-center text-white transition-all hover:scale-110"
        style={{ borderRadius: "50%", background: `linear-gradient(135deg, ${storeTheme.globalColor}, ${storeTheme.accentColor})` }}>
        <span className="text-sm font-bold">{locale === "ar" ? t("general.arabic").charAt(0) : t("general.english").charAt(0)}</span>
      </button>
    </div>
  );
}

function StoreShell({ children }: { children: React.ReactNode }) {
  const { settings, loading, theme, cartCount, setShowCart, setShowWishlist, wishlist, searchQuery, setSearchQuery, activeCoupon, customerUser, customerLoading, logoutCustomer } = useStore();
  const { t, dir } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const storeName = settings.nameStore || "My Store";
  const storeDesc = settings.descriptionStore || "Welcome to our store";
  const menu = settings.headerMenu || [];
  const searchRef = useRef<HTMLInputElement>(null);
  const br = theme.borderRadius;

  const scrollToSection = useCallback((id: string) => {
    if (pathname !== "/store") {
      window.location.href = `/store#${id}`;
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [pathname]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    scrollToSection("products");
  }, [scrollToSection]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.cardBg }}>
      <div className="text-center">
        <div className="w-10 h-10 border-2 animate-spin mx-auto mb-3" style={{ borderColor: `${theme.globalColor}20`, borderTopColor: theme.globalColor, borderRadius: "50%" }} />
        <p className="text-xs font-medium tracking-wide" style={{ color: theme.mutedText }}>{t("loading")}</p>
      </div>
    </div>
  );

  if (settings.isMaintenanceMode) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: theme.cardBg }}>
      <div className="text-center p-12">
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-full" style={{ background: `${theme.globalColor}10` }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight mb-2" style={{ color: theme.textColor }}>{storeName}</h1>
        <p className="text-sm" style={{ color: theme.mutedText }}>{t("maintenance.title")}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" dir={dir} style={{ background: theme.cardBg, color: theme.textColor, fontFamily: theme.fontDisplay }}>
      <CartDrawer />
      <WishlistDrawer />
      <ThemeSwitcher />
      <LanguageSwitcher />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl"
        style={{ background: theme.headerColor, borderBottom: `1px solid ${theme.border}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 md:h-16">
            <Link href="/store" className="flex items-center gap-2.5 shrink-0 group">
              {settings.urlLogo ? <img src={settings.urlLogo} alt={storeName} className="h-7 w-auto transition-transform duration-300 group-hover:scale-105" /> : (
                <div className="w-8 h-8 flex items-center justify-center font-bold text-white text-xs transition-all duration-300 group-hover:scale-110"
                  style={{ borderRadius: "0.5rem", background: theme.globalColor }}>{storeName.charAt(0)}</div>
              )}
              <span className="font-bold text-sm hidden sm:block tracking-tight transition-colors" style={{ color: theme.headerTextColor }}>{storeName}</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {[{ href: "/store", label: t("nav.home") }, { label: t("nav.shop"), id: "products" }, { label: t("nav.deals"), id: "deals" }, { href: "/store/about", label: t("nav.about") }, { href: "/store/contact", label: t("nav.contact") }].map(l => (
                l.href ? (
                  <Link key={l.label} href={l.href}
                    className="relative px-4 py-2 text-xs font-semibold transition-all duration-300 rounded-lg hover:bg-white/5"
                    style={{ color: pathname === l.href ? theme.headerTextColor : `${theme.headerTextColor}60` }}>
                    {l.label}
                    {pathname === l.href && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full" style={{ background: theme.globalColor }} />
                    )}
                  </Link>
                ) : (
                  <button key={l.label} onClick={() => scrollToSection(l.id!)}
                    className="px-4 py-2 text-xs font-semibold transition-all duration-300 cursor-pointer rounded-lg hover:bg-white/5"
                    style={{ color: `${theme.headerTextColor}60` }}>
                    {l.label}
                  </button>
                )
              ))}
            </nav>

            <div className="flex items-center gap-1.5">
              <form onSubmit={handleSearch} className="hidden sm:flex items-center px-3.5 py-2 gap-2 transition-all duration-300 focus-within:w-52"
                style={{ borderRadius: "9999px", background: `${theme.headerTextColor}08`, border: `1px solid ${theme.headerTextColor}12`, width: "11rem" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={`${theme.headerTextColor}35`} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input ref={searchRef} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t("search.placeholder")} className="bg-transparent text-xs outline-none flex-1" style={{ color: theme.headerTextColor }} />
              </form>
              <button onClick={() => setShowWishlist(true)} className="relative w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110 rounded-lg hover:bg-white/5"
                style={{ color: theme.headerTextColor }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlist.length > 0 ? theme.globalColor : "none"} stroke={theme.headerTextColor} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 text-[8px] font-bold text-white flex items-center justify-center px-0.5" style={{ borderRadius: "9999px", background: "#EF4444" }}>{wishlist.length}</span>}
              </button>
              <button onClick={() => setShowCart(true)} className="relative w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110 rounded-lg hover:bg-white/5"
                style={{ color: theme.headerTextColor }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 text-[8px] font-bold text-white flex items-center justify-center px-0.5" style={{ borderRadius: "9999px", background: theme.globalColor }}>{cartCount}</span>}
              </button>
              {customerUser ? (
                <Link href="/profile" className="w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 hover:scale-110"
                  style={{ background: `${theme.globalColor}20`, color: theme.globalColor }}>
                  {(customerUser.fullName || customerUser.username || '?')[0].toUpperCase()}
                </Link>
              ) : !customerLoading ? (
                <Link href="/login" className="px-4 py-2 text-[10px] font-bold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  style={{ background: theme.globalColor, color: "white", boxShadow: `0 4px 12px ${theme.globalColor}30` }}>
                  {t("nav.signIn")}
                </Link>
              ) : null}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all hover:bg-white/5" style={{ color: theme.headerTextColor }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  {mobileMenuOpen ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></> : <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t px-4 py-3 space-y-1" style={{ borderColor: theme.border, background: theme.headerColor }}>
            {[{ href: "/store", label: t("nav.home") }, { label: t("nav.shop"), id: "products" }, { label: t("nav.deals"), id: "deals" }, { href: "/store/about", label: t("nav.about") }, { href: "/store/contact", label: t("nav.contact") }].map(l => (
              l.href ? (
                <Link key={l.label} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200" style={{ color: pathname === l.href ? theme.headerTextColor : `${theme.headerTextColor}70`, background: pathname === l.href ? `${theme.headerTextColor}0A` : "transparent" }}>{l.label}</Link>
              ) : (
                <button key={l.label} onClick={() => { setMobileMenuOpen(false); scrollToSection(l.id!); }} className="block w-full text-left px-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:bg-white/5" style={{ color: `${theme.headerTextColor}70` }}>{l.label}</button>
              )
            ))}
          </div>
        )}
      </header>

      {activeCoupon && pathname === "/store" && (
        <div className="py-1.5 text-center text-[11px] font-medium tracking-wide" style={{ background: theme.globalColor, color: "white" }}>
          {t("coupon.useCode")} <span className="font-bold">{activeCoupon.couponCode}</span> {t("coupon.for")} {activeCoupon.discount}{t("coupon.offLabel")}
        </div>
      )}

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer id="store-footer" style={{ background: theme.footerColor }} className="relative mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-10 mb-10">
            <div className="md:col-span-2">
              <Link href="/store" className="flex items-center gap-2.5 mb-4 group">
                <div className="w-8 h-8 flex items-center justify-center font-bold text-white text-[10px] transition-all duration-300 group-hover:scale-110"
                  style={{ borderRadius: "0.5rem", background: theme.globalColor }}>{storeName.charAt(0)}</div>
                <span className="font-bold text-sm tracking-tight" style={{ color: theme.footerTextColor }}>{storeName}</span>
              </Link>
              <p className="text-xs leading-relaxed mb-5 max-w-xs" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{storeDesc}</p>
              <div className="flex gap-2.5">
                {[{ u: settings.urlFacebook, i: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg> },
                  { u: settings.urlInstagram, i: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/></svg> },
                  { u: settings.urlTwitter, i: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  { u: settings.urlTiktok, i: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .56.04.81.13V9a6.33 6.33 0 00-.81-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34A6.34 6.34 0 0015.85 15.27V9.15a8.17 8.17 0 003.74.92V6.69z"/></svg> },
                  { u: settings.urlLinkedin, i: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z"/></svg> },
                ].filter(s => s.u).map((s, i) => (
                  <a key={i} href={s.u} target="_blank" rel="noreferrer"
                    className="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                    style={{ borderRadius: "0.5rem", background: `${theme.globalColor}12`, color: theme.footerTextColor }}>{s.i}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: theme.footerTextColor }}>{t("footer.links")}</h4>
              <div className="space-y-2.5">
                {menu.length > 0 ? menu.map((item, i) => <Link key={i} href={item.url} className="block text-xs transition-all duration-300 hover:translate-x-1" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{item.label}</Link>) : (
                  <><Link href="/store" className="block text-xs transition-all duration-300 hover:translate-x-1" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{t("footer.home")}</Link><Link href="/store/about" className="block text-xs transition-all duration-300 hover:translate-x-1" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{t("footer.about")}</Link><Link href="/store/contact" className="block text-xs transition-all duration-300 hover:translate-x-1" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{t("footer.contact")}</Link></>
                )}
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: theme.footerTextColor }}>{t("footer.support")}</h4>
              <div className="space-y-2.5">
                <Link href="/store/support" className="block text-xs transition-all duration-300 hover:translate-x-1" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{t("footer.helpCenter")}</Link>
                <Link href="/store/faq" className="block text-xs transition-all duration-300 hover:translate-x-1" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{t("footer.faq")}</Link>
                <Link href="/store/contact" className="block text-xs transition-all duration-300 hover:translate-x-1" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{t("footer.contactUs")}</Link>
                <Link href="/store/tracking" className="block text-xs transition-all duration-300 hover:translate-x-1" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{t("footer.trackOrder")}</Link>
              </div>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] mb-4" style={{ color: theme.footerTextColor }}>{t("footer.legal")}</h4>
              <div className="space-y-2.5">
                <Link href="/store/policy" className="block text-xs transition-all duration-300 hover:translate-x-1" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{t("footer.privacy")}</Link>
                <Link href="/store/terms" className="block text-xs transition-all duration-300 hover:translate-x-1" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{t("footer.terms")}</Link>
                <Link href="/store/shipping" className="block text-xs transition-all duration-300 hover:translate-x-1" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{t("footer.shipping")}</Link>
                <Link href="/store/about" className="block text-xs transition-all duration-300 hover:translate-x-1" style={{ color: theme.footerMutedText || theme.footerTextColor }}>{t("footer.about")}</Link>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: `${theme.footerTextColor}15` }}>
            <p className="text-[10px]" style={{ color: theme.footerMutedText || theme.footerTextColor }}>&copy; {new Date().getFullYear()} {storeName}. {t("footer.allRightsReserved")}</p>
            <div className="flex gap-3 text-[10px]" style={{ color: theme.footerMutedText || theme.footerTextColor }}>
              {settings.acceptCard && <span className="px-2.5 py-1 font-medium" style={{ borderRadius: "9999px", background: `${theme.globalColor}12` }}>{t("footer.card")}</span>}
              {settings.acceptPaypal && <span className="px-2.5 py-1 font-medium" style={{ borderRadius: "9999px", background: `${theme.globalColor}12` }}>{t("footer.paypal")}</span>}
              {settings.acceptCOD && <span className="px-2.5 py-1 font-medium" style={{ borderRadius: "9999px", background: `${theme.globalColor}12` }}>{t("footer.cod")}</span>}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <StoreProvider><StoreShell>{children}</StoreShell></StoreProvider>;
}
