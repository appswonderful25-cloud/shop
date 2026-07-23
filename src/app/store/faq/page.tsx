"use client";

import { useStore } from "../StoreContext";
import { useLanguage } from "@/app/store/LanguageContext";
import Link from "next/link";
import { useState } from "react";

export default function FAQPage() {
  const { settings, theme } = useStore();
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    { q: t("faq.q1"), a: t("faq.a1") },
    { q: t("faq.q2"), a: t("faq.a2") },
    { q: t("faq.q3"), a: t("faq.a3") },
    { q: t("faq.q4"), a: t("faq.a4") },
    { q: t("faq.q5"), a: t("faq.a5") },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8"><Link href="/store#store-footer" className="text-sm font-medium hover:underline" style={{ color: theme.globalColor }}>{t("faq.backToStore")}</Link></div>
      <h1 className="text-3xl font-black mb-2" style={{ color: theme.textColor }}>{t("faq.title")}</h1>
      <p className="text-sm mb-8" style={{ color: theme.mutedText }}>{t("faq.subtitle")}</p>
      {settings.urlFAQ && <p className="text-sm leading-relaxed mb-6" style={{ color: theme.mutedText }}>{settings.urlFAQ}</p>}
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-xl border overflow-hidden transition-all" style={{ borderColor: theme.border }}>
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left" style={{ background: openIdx === i ? `${theme.globalColor}08` : theme.cardBg }}>
              <span className="font-bold text-sm pr-4" style={{ color: theme.textColor }}>{faq.q}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="2" className={`flex-shrink-0 transition-transform ${openIdx === i ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            {openIdx === i && (
              <div className="px-4 pb-4">
                <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
