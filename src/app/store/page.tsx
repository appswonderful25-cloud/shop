"use client";

import { useStore, CATEGORY_IMAGES } from "./StoreContext";
import { useLanguage } from "./LanguageContext";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { STORE_CATEGORIES, CATEGORY_LIST, type StoreCategory } from "@/lib/store-categories";

function getProductImage(p: { title: string; titleAr?: string; productCategory: string; productCategoryAr?: string; image?: { url: string } | null }) {
  if (p.image?.url) {
    const u = p.image.url;
    return u.startsWith("http") ? u : `http://localhost:1337${u}`;
  }
  const cat = (p.productCategory || "").toLowerCase().replace(/[^a-z]/g, "");
  if (CATEGORY_IMAGES[cat]) return CATEGORY_IMAGES[cat];
  const titleEn = (p.title || "").toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_IMAGES)) {
    if (titleEn.includes(k)) return v;
  }
  const titleAr = (p.titleAr || "").toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_IMAGES)) {
    if (titleAr.includes(k)) return v;
  }
  return CATEGORY_IMAGES.general;
}

function FeatureIcon({ icon, color }: { icon: string; color: string }) {
  const icons: Record<string, React.ReactNode> = {
    truck: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    shield: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    refresh: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
    headset: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
    star: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    gift: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></svg>,
    tag: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    package: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    ruler: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.3 15.3a2.4 2.4 0 010 3.4l-2.6 2.6a2.4 2.4 0 01-3.4 0L2.7 8.7a2.41 2.41 0 010-3.4l2.6-2.6a2.41 2.41 0 013.4 0z"/><path d="M14.5 12.5l2-2"/><path d="M11.5 9.5l2-2"/><path d="M8.5 6.5l2-2"/><path d="M17.5 15.5l2-2"/></svg>,
    leaf: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75"/></svg>,
    snowflake: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="2" x2="12" y2="22"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>,
    book: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
    tools: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
    cube: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
    users: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  };
  return <span style={{ color }}>{icons[icon] || icons.star}</span>;
}

function CategoryProductCard({ product, cat, addToCart }: { product: StoreCategory["products"][0]; cat: StoreCategory; addToCart: (p: any) => void }) {
  const { t: tLang, locale } = useLanguage();
  const [justAdded, setJustAdded] = useState(false);
  const t = cat.theme;
  const br = cat.borderRadius;
  const displayName = locale === "ar" && product.titleAr ? product.titleAr : product.title;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (justAdded) return;
    addToCart({ id: Math.random(), title: displayName, price: product.price, count: 10, productCategory: product.category, statusProduct: "active" });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="group flex flex-col transition-all duration-500 hover:-translate-y-1 border overflow-hidden"
      style={{ background: t.cardBg, borderColor: t.border, borderRadius: br }}>
      <div className="relative overflow-hidden" style={{ borderRadius: `${br} ${br} 0 0`, paddingBottom: cat.layoutType === "gallery" ? "100%" : "75%" }}>
        <img src={product.image} alt={displayName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {product.badge && (
          <span className="absolute top-3 left-3 px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase text-white"
            style={{ borderRadius: "0.25rem", background: t.badge }}>{product.badge}</span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: t.primary }}>{product.category}</p>
        <h3 className="text-sm font-semibold mb-0.5 line-clamp-1" style={{ color: t.textColor }}>{displayName}</h3>
        <p className="text-[11px] line-clamp-2 mb-3 leading-relaxed flex-1" style={{ color: t.mutedText }}>{product.description}</p>
        <div className="flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-semibold" style={{ color: t.primary }}>${product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="text-[10px] line-through" style={{ color: t.mutedText }}>${product.originalPrice.toFixed(2)}</span>}
          </div>
          <button onClick={handleAdd}
            className="px-3 py-1.5 text-[10px] font-medium text-white transition-all duration-300 hover:opacity-90"
            style={{ borderRadius: br, background: justAdded ? "#22C55E" : t.primary }}>
            {justAdded ? tLang("products.added") : tLang("products.add")}
          </button>
        </div>
      </div>
    </div>
  );
}

function DefaultProductCard({ product, theme, addToCart, toggleWishlist, isWishlisted }: { product: any; theme: any; addToCart: (p: any) => void; toggleWishlist: (id: number) => void; isWishlisted: (id: number) => boolean }) {
  const { t, locale } = useLanguage();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const imgSrc = getProductImage(product);
  const isOut = product.statusProduct === "out_of_stack";
  const isDiscounted = product.price > 20 && product.count > 5;
  const br = theme.borderRadius;
  const wishlisted = isWishlisted(product.id);
  const displayTitle = locale === "ar" && product.titleAr ? product.titleAr : product.title;
  const displayCategory = locale === "ar" && product.productCategoryAr ? product.productCategoryAr : product.productCategory;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (justAdded || isOut) return;
    addToCart(product); setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link href={`/store/product/${product.id}`} className="group flex flex-col transition-all duration-500 hover:-translate-y-0.5 border overflow-hidden"
      style={{ background: theme.cardBg, borderColor: theme.border, borderRadius: br }}>
      <div className="relative overflow-hidden" style={{ background: `${theme.globalColor}04`, borderRadius: `${br} ${br} 0 0`, paddingBottom: "75%" }}>
        {!imgLoaded && <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: `${theme.globalColor}15`, borderTopColor: theme.globalColor }} /></div>}
        <img src={imgSrc} alt={displayTitle} onLoad={() => setImgLoaded(true)} onError={(e) => { (e.target as HTMLImageElement).src = CATEGORY_IMAGES.general; setImgLoaded(true); }}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {isDiscounted && <span className="px-1.5 py-0.5 text-[9px] font-medium text-white" style={{ borderRadius: "0.2rem", background: "#EF4444" }}>-20%</span>}
          {product.statusProduct === "active" && <span className="px-1.5 py-0.5 text-[9px] font-medium text-white" style={{ borderRadius: "0.2rem", background: theme.globalColor }}>{t("products.inStock")}</span>}
          {isOut && <span className="px-1.5 py-0.5 text-[9px] font-medium text-white" style={{ borderRadius: "0.2rem", background: "#6B7280" }}>{t("products.soldOut")}</span>}
        </div>
        <button onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 w-7 h-7 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{ borderRadius: "0.375rem", background: wishlisted ? "#EF4444" : "rgba(255,255,255,0.8)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill={wishlisted ? "white" : "none"} stroke={wishlisted ? "white" : "#EF4444"} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
        </button>
      </div>
      <div className="p-3.5 flex-1 flex flex-col">
        <p className="text-[9px] font-semibold uppercase tracking-[0.15em] mb-1" style={{ color: theme.globalColor }}>{displayCategory}</p>
        <h3 className="text-sm font-medium mb-1 line-clamp-1" style={{ color: theme.textColor }}>{displayTitle}</h3>
        <p className="text-[11px] line-clamp-2 mb-3 leading-relaxed flex-1" style={{ color: theme.mutedText }}>{locale === "ar" && product.descriptionAr ? product.descriptionAr : product.description}</p>
        <div className="flex items-end justify-between gap-2">
          <div>
            <span className="text-base font-semibold" style={{ color: theme.globalColor }}>${product.price.toFixed(2)}</span>
            {isDiscounted && <span className="text-[10px] line-through ml-1" style={{ color: theme.mutedText }}>${(product.price * 1.25).toFixed(2)}</span>}
          </div>
          <button onClick={handleAdd} disabled={isOut}
            className="px-3 py-1.5 text-[10px] font-medium text-white transition-all duration-300 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ borderRadius: br, background: justAdded ? "#22C55E" : isOut ? "#9CA3AF" : theme.globalColor }}>
            {justAdded ? t("products.added") : isOut ? t("products.soldOut") : t("products.add")}
          </button>
        </div>
      </div>
    </Link>
  );
}

function HeroNav({ total, activeSlide, setActiveSlide, color }: { total: number; activeSlide: number; setActiveSlide: (n: number) => void; color: string }) {
  const prev = () => setActiveSlide((activeSlide - 1 + total) % total);
  const next = () => setActiveSlide((activeSlide + 1) % total);
  return (
    <>
      <button onClick={prev} className="absolute left-3 md:left-5 top-[40%] -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-all duration-200 hover:scale-110 shadow-lg" style={{ borderRadius: "9999px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button onClick={next} className="absolute right-3 md:right-5 top-[40%] -translate-y-1/2 z-30 w-11 h-11 flex items-center justify-center bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white transition-all duration-200 hover:scale-110 shadow-lg" style={{ borderRadius: "9999px" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-30">
        {Array.from({ length: total }).map((_, i) => (
          <button key={i} onClick={() => setActiveSlide(i)}
            className="h-2.5 transition-all duration-300 hover:bg-white/70"
            style={{ borderRadius: "9999px", background: i === activeSlide ? color : "rgba(255,255,255,0.3)", width: i === activeSlide ? "2rem" : "0.625rem" }} />
        ))}
      </div>
    </>
  );
}

function CategoryHero({ cat, activeSlide, setActiveSlide }: { cat: StoreCategory; activeSlide: number; setActiveSlide: (n: number) => void }) {
  const { t: tLang } = useLanguage();
  const t = cat.theme;
  const br = cat.borderRadius;
  const images = cat.heroImages;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const totalImages = images.length;

  if (cat.layoutType === "editorial" || cat.layoutType === "showcase") {
    return (
      <section className="relative h-[500px] md:h-[600px] overflow-hidden" style={{ background: t.heroGradient }}>
        {images.map((img, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === activeSlide % totalImages ? "opacity-30" : "opacity-0 pointer-events-none"}`}>
            <img src={img} alt="" className="w-full h-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${t.headerBg}40 0%, ${t.primaryDark}CC 100%)` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase mb-5" style={{ borderRadius: br, background: `${t.primary}33`, color: t.primaryLight }}>{cat.heroTag}</span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-5 leading-[0.95] tracking-tight whitespace-pre-line" style={{ color: t.textColor, fontFamily: cat.fontFamily }}>{cat.heroTitle}</h1>
            <p className="text-base mb-8 max-w-md leading-relaxed" style={{ color: t.mutedText }}>{cat.heroDesc}</p>
            <div className="flex gap-3">
              <button onClick={() => scrollTo(`cat-products-${cat.id}`)} className="px-8 py-3 text-sm font-medium text-white transition-all hover:opacity-90" style={{ borderRadius: br, background: t.primary }}>{tLang("category.shopNow")}</button>
            </div>
          </div>
        </div>
        {totalImages > 1 && <HeroNav total={totalImages} activeSlide={activeSlide} setActiveSlide={setActiveSlide} color={t.primary} />}
      </section>
    );
  }

  if (cat.layoutType === "playful") {
    return (
      <section className="relative overflow-hidden" style={{ background: t.heroGradient }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 text-center relative z-10">
          <span className="inline-block px-4 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase mb-5" style={{ borderRadius: br, background: `${t.primary}33`, color: t.primaryLight }}>{cat.heroTag}</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1] tracking-tight whitespace-pre-line" style={{ color: t.textColor, fontFamily: cat.fontFamily }}>{cat.heroTitle}</h1>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: t.mutedText }}>{cat.heroDesc}</p>
          <button onClick={() => scrollTo(`cat-products-${cat.id}`)} className="px-8 py-3 text-sm font-medium text-white transition-all hover:scale-105" style={{ borderRadius: br, background: t.primary }}>{tLang("category.explore", { name: cat.name })}</button>
        </div>
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{ background: t.primaryLight }} />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full opacity-10" style={{ background: t.accent }} />
      </section>
    );
  }

  if (cat.layoutType === "industrial") {
    return (
      <section className="relative overflow-hidden" style={{ background: t.heroGradient }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="max-w-lg">
              <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ background: `${t.accent}22`, color: t.accent }}>{cat.heroTag}</span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[0.95] tracking-tight whitespace-pre-line" style={{ color: t.textColor, fontFamily: cat.fontFamily }}>{cat.heroTitle}</h1>
              <p className="text-sm mb-6 max-w-md" style={{ color: t.mutedText }}>{cat.heroDesc}</p>
              <button onClick={() => scrollTo(`cat-products-${cat.id}`)} className="px-6 py-2.5 text-xs font-medium text-white transition-all hover:opacity-90" style={{ borderRadius: br, background: t.primary }}>{tLang("category.shopCategory", { name: cat.name })}</button>
            </div>
            <div className="hidden md:block flex-1 h-[300px] overflow-hidden relative" style={{ borderRadius: br }}>
              {images.map((img, i) => (
                <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === activeSlide % totalImages ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              {totalImages > 1 && (
                <>
                  <button onClick={() => setActiveSlide((activeSlide - 1 + totalImages) % totalImages)} className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-all shadow-lg"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg></button>
                  <button onClick={() => setActiveSlide((activeSlide + 1) % totalImages)} className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center bg-black/40 hover:bg-black/60 text-white rounded-full transition-all shadow-lg"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg></button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (cat.layoutType === "organic" || cat.layoutType === "friendly") {
    return (
      <section className="relative overflow-hidden" style={{ background: t.heroGradient }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 text-center relative z-10">
          <span className="inline-block px-4 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase mb-5" style={{ borderRadius: br, background: `rgba(255,255,255,0.15)`, color: "white" }}>{cat.heroTag}</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1] tracking-tight whitespace-pre-line text-white">{cat.heroTitle}</h1>
          <p className="text-sm mb-8 max-w-sm mx-auto text-white/70">{cat.heroDesc}</p>
          <button onClick={() => scrollTo(`cat-products-${cat.id}`)} className="px-8 py-3 text-sm font-medium text-white transition-all hover:opacity-90" style={{ borderRadius: br, background: `${t.primary}CC` }}>{tLang("category.shopNow")}</button>
        </div>
        {images.slice(0, 3).map((img, i) => (
          <div key={i} className={`absolute transition-opacity duration-700 ${i === activeSlide % 3 ? "opacity-10" : "opacity-0"}`}>
            <img src={img} alt="" className="w-[400px] h-[400px] object-cover" style={{ borderRadius: "50%", top: `${20 + i * 30}%`, right: `${-5 + i * 15}%`, position: "absolute" }} />
          </div>
        ))}
      </section>
    );
  }

  if (cat.layoutType === "minimal") {
    return (
      <section className="relative py-16 md:py-20 overflow-hidden" style={{ background: t.bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-[1] tracking-tight whitespace-pre-line" style={{ color: t.textColor, fontFamily: cat.fontFamily }}>{cat.heroTitle}</h1>
          <p className="text-sm mb-8 max-w-sm mx-auto" style={{ color: t.mutedText }}>{cat.heroDesc}</p>
          <button onClick={() => scrollTo(`cat-products-${cat.id}`)} className="px-8 py-3 text-sm font-medium text-white transition-all hover:opacity-90" style={{ borderRadius: br, background: t.primary }}>{tLang("category.shopCategory", { name: cat.name })}</button>
        </div>
      </section>
    );
  }

  // Bento, Dynamic, Magazine, Gallery, Classic, Default
  return (
    <section className="relative overflow-hidden" style={{ background: t.heroGradient }}>
      {images.map((img, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === activeSlide % images.length ? "opacity-40" : "opacity-0 pointer-events-none"}`}>
          <img src={img} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <div className="max-w-xl">
          <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase mb-5" style={{ borderRadius: br, background: `${t.primary}33`, color: t.primaryLight }}>{cat.heroTag}</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-[0.95] tracking-tight whitespace-pre-line text-white">{cat.heroTitle}</h1>
          <p className="text-sm mb-8 max-w-md text-white/70">{cat.heroDesc}</p>
          <button onClick={() => scrollTo(`cat-products-${cat.id}`)} className="px-8 py-3 text-sm font-medium text-white transition-all hover:opacity-90" style={{ borderRadius: br, background: t.primary }}>{tLang("category.shopCategory", { name: cat.name })}</button>
        </div>
      </div>
      {totalImages > 1 && <HeroNav total={totalImages} activeSlide={activeSlide} setActiveSlide={setActiveSlide} color="white" />}
    </section>
  );
}

function CategoryProductGrid({ cat, addToCart }: { cat: StoreCategory; addToCart: (p: any) => void }) {
  const { t: tLang, locale } = useLanguage();
  const t = cat.theme;
  const br = cat.borderRadius;
  const layout = cat.layoutType;

  if (layout === "bento") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px]">
        {cat.products.map((p, i) => (
          <div key={i} className={`${i === 0 ? "col-span-2 row-span-2" : i === 3 ? "col-span-2" : ""} overflow-hidden`}>
            <CategoryProductCard product={p} cat={cat} addToCart={addToCart} />
          </div>
        ))}
      </div>
    );
  }

  if (layout === "editorial") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cat.products.slice(0, 2).map((p, i) => (
            <div key={i} className="flex h-[280px] overflow-hidden border" style={{ borderColor: t.border, borderRadius: br }}>
              <div className="w-1/2 overflow-hidden"><img src={p.image} alt={locale === "ar" && p.titleAr ? p.titleAr : p.title} className="w-full h-full object-cover" /></div>
              <div className="w-1/2 p-6 flex flex-col justify-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.15em] mb-2" style={{ color: t.primary }}>{locale === "ar" && (p as any).productCategoryAr ? (p as any).productCategoryAr : p.category}</p>
                <h3 className="text-lg font-semibold mb-2" style={{ color: t.textColor, fontFamily: cat.fontFamily }}>{locale === "ar" && p.titleAr ? p.titleAr : p.title}</h3>
                <p className="text-xs mb-4 line-clamp-3" style={{ color: t.mutedText }}>{locale === "ar" && (p as any).descriptionAr ? (p as any).descriptionAr : p.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-semibold" style={{ color: t.primary }}>${p.price.toFixed(2)}</span>
                  <button onClick={(e) => { e.preventDefault(); addToCart({ id: Math.random(), title: locale === "ar" && p.titleAr ? p.titleAr : p.title, price: p.price, count: 10, productCategory: p.category, statusProduct: "active" }); }}
                    className="px-4 py-1.5 text-[10px] font-medium text-white" style={{ borderRadius: br, background: t.primary }}>{tLang("products.add")}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {cat.products.slice(2).map((p, i) => <CategoryProductCard key={i} product={p} cat={cat} addToCart={addToCart} />)}
        </div>
      </div>
    );
  }

  if (layout === "magazine") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cat.products.map((p, i) => (
          <div key={i} className={`${i === 0 ? "col-span-2 row-span-2" : ""}`}>
            <CategoryProductCard product={p} cat={cat} addToCart={addToCart} />
          </div>
        ))}
      </div>
    );
  }

  if (layout === "gallery") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cat.products.map((p, i) => <CategoryProductCard key={i} product={p} cat={cat} addToCart={addToCart} />)}
      </div>
    );
  }

  if (layout === "dynamic") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cat.products.map((p, i) => (
          <div key={i} className={`${i % 3 === 0 ? "md:col-span-2" : ""}`}>
            <CategoryProductCard product={p} cat={cat} addToCart={addToCart} />
          </div>
        ))}
      </div>
    );
  }

  if (layout === "playful") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cat.products.map((p, i) => <CategoryProductCard key={i} product={p} cat={cat} addToCart={addToCart} />)}
      </div>
    );
  }

  if (layout === "showcase") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cat.products.map((p, i) => <CategoryProductCard key={i} product={p} cat={cat} addToCart={addToCart} />)}
      </div>
    );
  }

  if (layout === "minimal") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cat.products.map((p, i) => <CategoryProductCard key={i} product={p} cat={cat} addToCart={addToCart} />)}
      </div>
    );
  }

  // classic, friendly, industrial, organic, default
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cat.products.map((p, i) => <CategoryProductCard key={i} product={p} cat={cat} addToCart={addToCart} />)}
    </div>
  );
}

function CategoryStoreSection({ catId, addToCart }: { catId: string; addToCart: (p: any) => void }) {
  const { t: tLang } = useLanguage();
  const cat = STORE_CATEGORIES[catId];
  const [activeSlide, setActiveSlide] = useState(0);
  if (!cat) return null;
  const t = cat.theme;
  const br = cat.borderRadius;

  useEffect(() => {
    const interval = setInterval(() => setActiveSlide(p => p + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: t.bg, color: t.textColor, fontFamily: cat.fontFamily }} className="min-h-screen">
      <CategoryHero cat={cat} activeSlide={activeSlide} setActiveSlide={setActiveSlide} />

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-7 z-20 mb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {cat.features.map((f, i) => (
            <div key={i} className="p-4 text-center transition-all duration-300 hover:-translate-y-0.5 border"
              style={{ background: t.cardBg, borderColor: t.border, borderRadius: br }}>
              <div className="w-10 h-10 mx-auto mb-2.5 flex items-center justify-center"
                style={{ background: `${t.primary}0A`, borderRadius: "50%" }}>
                <FeatureIcon icon={f.icon} color={t.primary} />
              </div>
              <h3 className="text-xs font-semibold" style={{ color: t.textColor }}>{f.title}</h3>
              <p className="text-[10px] mt-0.5" style={{ color: t.mutedText }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id={`cat-products-${catId}`} className="max-w-7xl mx-auto px-4 sm:px-6 mb-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: t.primary }}>{cat.name}</span>
            <h2 className="text-2xl md:text-3xl font-bold mt-1 tracking-tight" style={{ color: t.textColor }}>
              {tLang("category.productsCount", { count: cat.products.length })}
            </h2>
          </div>
          <span className="text-xs font-medium px-3 py-1" style={{ background: `${t.primary}0A`, color: t.primary, borderRadius: br }}>
            {tLang("products.items", { count: cat.products.length })}
          </span>
        </div>
        <CategoryProductGrid cat={cat} addToCart={addToCart} />
      </section>

      {/* About */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mb-14">
        <div className="overflow-hidden border" style={{ borderRadius: br, borderColor: t.border, background: t.cardBg }}>
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <div className="relative overflow-hidden h-64" style={{ borderRadius: br }}>
              <img src={cat.products[0]?.image || cat.heroImages[0]} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${t.primary}20, transparent)` }} />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: t.primary }}>{tLang("category.about")}</span>
              <h2 className="text-xl md:text-2xl font-bold mt-2 mb-3 tracking-tight" style={{ color: t.textColor }}>
                {cat.heroTitle.replace("\n", " ")}
              </h2>
              <p className="text-xs leading-relaxed mb-5" style={{ color: t.mutedText }}>{cat.description}. {tLang("category.premiumQuality")}</p>
              <div className="grid grid-cols-3 gap-2">
                {[{ n: `${cat.products.length}+`, l: tLang("category.products") }, { n: "5K+", l: tLang("category.customers") }, { n: "99%", l: tLang("category.rating") }].map((s, i) => (
                  <div key={i} className="text-center p-2.5 border" style={{ borderColor: t.border, borderRadius: br }}>
                    <div className="text-lg font-bold" style={{ color: t.primary }}>{s.n}</div>
                    <div className="text-[9px] font-medium" style={{ color: t.mutedText }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function StoreHome() {
  const { products, theme, settings, activeCoupon, addToCart, searchQuery, toggleWishlist, isWishlisted, activeStoreCategory, activeCategoryData } = useStore();
  const { t, locale } = useLanguage();
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const storeName = (locale === "ar" ? settings.nameStoreAr || settings.nameStore : settings.nameStore) || "My Store";
  const br = theme.borderRadius;
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActiveSlide(p => (p + 1) % 3), 5000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const handleSlideChange = useCallback((n: number) => {
    setActiveSlide(n);
    resetTimer();
  }, [resetTimer]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.productCategory).filter(Boolean)));
    return ["all", ...cats.sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory !== "all") result = result.filter(p => p.productCategory === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.productCategory || "").toLowerCase().includes(q));
    }
    return result;
  }, [products, selectedCategory, searchQuery]);

  const productCountByCategory = useMemo(() => {
    const map: Record<string, number> = { all: products.length };
    products.forEach(p => { map[p.productCategory] = (map[p.productCategory] || 0) + 1; });
    return map;
  }, [products]);

  if (activeStoreCategory !== "all" && activeCategoryData) {
    return <CategoryStoreSection catId={activeStoreCategory} addToCart={addToCart} />;
  }

  const DEFAULT_HERO = [
    { img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80", tag: t("hero.slide1.tag"), title: t("hero.slide1.title"), desc: t("hero.slide1.desc") },
    { img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80", tag: t("hero.slide2.tag"), title: t("hero.slide2.title"), desc: t("hero.slide2.desc") },
    { img: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=1200&q=80", tag: t("hero.slide3.tag"), title: t("hero.slide3.title"), desc: t("hero.slide3.desc") },
  ];

  return (
    <>
      <div className="relative">
        {/* Hero */}
        <section className="relative h-[480px] md:h-[560px] lg:h-[600px]" style={{ background: theme.headerColor }}>
          <div className="absolute inset-0 overflow-hidden">
            {DEFAULT_HERO.map((slide, i) => (
              <div key={i} className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${i === activeSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}`}>
                <img src={slide.img} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.headerColor}99 0%, ${theme.globalColor}44 50%, ${theme.headerColor}66 100%)` }} />
              </div>
            ))}
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-bold tracking-[0.25em] text-white uppercase mb-6 backdrop-blur-sm" style={{ borderRadius: "9999px", background: `rgba(255,255,255,0.12)`, border: "1px solid rgba(255,255,255,0.15)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {DEFAULT_HERO[activeSlide].tag}
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-5 leading-[1.05] tracking-tight whitespace-pre-line">{DEFAULT_HERO[activeSlide].title}</h1>
              <p className="text-sm sm:text-base text-white/75 mb-8 max-w-md leading-relaxed">{DEFAULT_HERO[activeSlide].desc}</p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
                  className="group px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 active:translate-y-0"
                  style={{ borderRadius: br, background: theme.globalColor }}>
                  <span className="flex items-center gap-2">
                    {t("hero.shopNow")}
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </button>
                <button onClick={() => document.getElementById("deals")?.scrollIntoView({ behavior: "smooth" })}
                  className="px-8 py-3.5 text-sm font-semibold text-white border border-white/25 hover:bg-white/10 hover:border-white/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5"
                  style={{ borderRadius: br }}>
                  {t("hero.viewDeals")}
                </button>
              </div>
            </div>
          </div>
          <button onClick={() => handleSlideChange((activeSlide - 1 + 3) % 3)} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 backdrop-blur-md text-white transition-all duration-300 hover:scale-110 rounded-full border border-white/10 shadow-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={() => handleSlideChange((activeSlide + 1) % 3)} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/25 backdrop-blur-md text-white transition-all duration-300 hover:scale-110 rounded-full border border-white/10 shadow-xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-3 z-30" style={{ bottom: "2.5rem" }}>
            {DEFAULT_HERO.map((_, i) => (
              <button key={i} onClick={() => handleSlideChange(i)}
                className="transition-all duration-500 hover:bg-white/60 backdrop-blur-sm"
                style={{ borderRadius: "9999px", background: i === activeSlide ? "white" : "rgba(255,255,255,0.25)", width: i === activeSlide ? "2.5rem" : "0.625rem", height: "0.625rem", boxShadow: i === activeSlide ? "0 0 12px rgba(255,255,255,0.3)" : "none" }} />
            ))}
          </div>
        </section>

        {/* Features overlapping hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 relative -mt-8 z-20 mb-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[
              { icon: "truck", title: t("features.freeShipping"), desc: t("features.freeShippingDesc") },
              { icon: "shield", title: t("features.securePayment"), desc: t("features.securePaymentDesc") },
              { icon: "refresh", title: t("features.easyReturns"), desc: t("features.easyReturnsDesc") },
              { icon: "headset", title: t("features.support"), desc: t("features.supportDesc") },
            ].map((f, i) => (
              <div key={i} className="group p-5 text-center border transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                style={{ background: theme.cardBg, borderColor: theme.border, borderRadius: br, boxShadow: theme.shadowSm }}>
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: `${theme.globalColor}0D`, borderRadius: "50%" }}>
                  <FeatureIcon icon={f.icon} color={theme.globalColor} />
                </div>
                <h3 className="text-xs font-bold tracking-wide" style={{ color: theme.textColor }}>{f.title}</h3>
                <p className="text-[10px] mt-1 leading-relaxed" style={{ color: theme.mutedText }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 mb-14">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: theme.globalColor }}>{t("products.collection")}</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-1.5 tracking-tight" style={{ color: theme.textColor }}>{t("products.title")}</h2>
          </div>
          <span className="text-xs font-semibold px-4 py-1.5" style={{ background: `${theme.globalColor}0D`, color: theme.globalColor, borderRadius: "9999px", border: `1px solid ${theme.globalColor}18` }}>
            {t("products.items", { count: filteredProducts.length })}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {categories.map(cat => {
            const isActive = selectedCategory === cat;
            const count = productCountByCategory[cat] || 0;
            return (
              <button key={cat} onClick={() => setSelectedCategory(cat)}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 shrink-0 hover:-translate-y-0.5"
                style={{ borderRadius: "9999px", background: isActive ? theme.globalColor : "transparent", color: isActive ? "white" : theme.mutedText, border: `1.5px solid ${isActive ? theme.globalColor : theme.border}` }}>
                {cat === "all" ? t("products.all") : cat}
                <span className="text-[9px] px-1.5 py-0.5 font-bold"
                  style={{ borderRadius: "9999px", background: isActive ? "rgba(255,255,255,0.2)" : `${theme.globalColor}0A`, color: isActive ? "white" : theme.globalColor }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20" style={{ background: `${theme.globalColor}04`, borderRadius: br }}>
            <h3 className="text-lg font-semibold mb-1" style={{ color: theme.textColor }}>{t("products.noResults")}</h3>
            <p className="text-xs" style={{ color: theme.mutedText }}>{searchQuery ? t("products.noSearchResults", { query: searchQuery }) : t("products.noResultsDesc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <DefaultProductCard key={product.id} product={product} theme={theme} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={isWishlisted} />
            ))}
          </div>
        )}
      </section>

      {/* Deals */}
      <section id="deals" className="max-w-7xl mx-auto px-4 sm:px-6 mb-14">
        <div className="overflow-hidden relative" style={{ borderRadius: br, background: `linear-gradient(135deg, ${theme.globalColor}, ${theme.accentColor})`, boxShadow: theme.shadowLg }}>
          <div className="relative p-8 md:p-12 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 bg-white/15 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest" style={{ borderRadius: "9999px" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {t("deals.limitedTime")}
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 tracking-tight">{t("deals.title")}</h2>
              <p className="text-white/75 text-sm mb-4 max-w-md leading-relaxed">{t("deals.desc")}</p>
              {activeCoupon && (
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/15 backdrop-blur-sm text-white font-medium text-xs border border-white/15" style={{ borderRadius: br }}>
                  <span className="bg-white/20 px-2 py-0.5 text-[9px] uppercase font-bold" style={{ borderRadius: "9999px" }}>{t("deals.code")}</span>
                  <span className="tracking-widest font-bold">{activeCoupon.couponCode}</span>
                  <span className="text-white/60">—</span>
                  <span className="font-bold">{activeCoupon.discount}{t("deals.off")}</span>
                </div>
              )}
            </div>
            <button onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              className="group px-10 py-4 text-sm font-bold transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 bg-white whitespace-nowrap"
              style={{ borderRadius: br, color: theme.globalColor }}>
              <span className="flex items-center gap-2">
                {t("deals.shopDeals")}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 mb-14">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="relative overflow-hidden h-72 md:h-80" style={{ borderRadius: br }}>
            <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80" alt="" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.globalColor}20, transparent)` }} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: theme.globalColor }}>{t("about.label")}</span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-2 mb-4 tracking-tight" style={{ color: theme.textColor }}>{t("about.title")} {storeName}?</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: theme.mutedText }}>
              {t("about.desc")}
            </p>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[{ n: "500+", l: t("about.products") }, { n: "10K+", l: t("about.customers") }, { n: "99%", l: t("about.satisfaction") }].map((s, i) => (
                <div key={i} className="text-center p-4 border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md" style={{ borderColor: theme.border, borderRadius: br }}>
                  <div className="text-xl font-bold" style={{ color: theme.globalColor }}>{s.n}</div>
                  <div className="text-[10px] font-medium mt-1" style={{ color: theme.mutedText }}>{s.l}</div>
                </div>
              ))}
            </div>
            <Link href="/store/about" className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5" style={{ borderRadius: br, background: theme.globalColor }}>
              {t("about.learnMore")}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
