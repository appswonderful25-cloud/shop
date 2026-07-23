"use client";

import { useStore } from "../StoreContext";
import { useLanguage } from "@/app/store/LanguageContext";
import Link from "next/link";

export default function AboutPage() {
  const { settings, theme } = useStore();
  const { t, locale } = useLanguage();
  const storeName = (locale === "ar" ? settings.nameStoreAr || settings.nameStore : settings.nameStore) || "My Store";
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8"><Link href="/store#store-footer" className="text-sm font-medium hover:underline" style={{ color: theme.globalColor }}>← Back to Store</Link></div>
      <h1 className="text-3xl font-black mb-8" style={{ color: theme.textColor }}>{t("about.pageTitle", { storeName })}</h1>
      {settings.urlAbout ? (
        <p className="text-sm leading-relaxed mb-6" style={{ color: theme.mutedText }}>{settings.urlAbout}</p>
      ) : (
        <div className="space-y-6">
          <p className="text-base leading-relaxed" style={{ color: theme.mutedText }}>{t("about.welcome", { storeName })}</p>
          <div className="grid md:grid-cols-3 gap-6 my-8">
            {[{ n: "500+", l: t("about.products"), d: t("about.curated") }, { n: "10K+", l: t("about.happyCustomers"), d: t("about.worldwide") }, { n: "99%", l: t("about.satisfaction"), d: t("about.guaranteed") }].map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border" style={{ borderColor: theme.border, background: `${theme.globalColor}05` }}>
                <div className="text-3xl font-black mb-1" style={{ color: theme.globalColor }}>{s.n}</div>
                <div className="text-sm font-bold" style={{ color: theme.textColor }}>{s.l}</div>
                <div className="text-xs mt-1" style={{ color: theme.mutedText }}>{s.d}</div>
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("about.missionDesc")}</p>
        </div>
      )}
      <div className="mt-10 p-6 rounded-2xl border" style={{ borderColor: theme.border, background: `${theme.globalColor}05` }}>
        <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("about.mission")}</h2>
        <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("about.visionDesc")}</p>
      </div>
    </div>
  );
}
