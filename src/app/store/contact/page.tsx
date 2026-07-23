"use client";

import { useStore } from "../StoreContext";
import { useLanguage } from "@/app/store/LanguageContext";
import Link from "next/link";
import { useState } from "react";

export default function ContactPage() {
  const { settings, theme } = useStore();
  const { t } = useLanguage();
  const storeName = settings.nameStore || "My Store";
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8"><Link href="/store#store-footer" className="text-sm font-medium hover:underline" style={{ color: theme.globalColor }}>{t("contact.backToStore")}</Link></div>
      <h1 className="text-3xl font-black mb-2" style={{ color: theme.textColor }}>{t("contact.title")}</h1>
      <p className="text-sm mb-8" style={{ color: theme.mutedText }}>{t("contact.subtitle", { storeName })}</p>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {settings.emailStore && (
            <div className="flex items-start gap-4 p-4 rounded-xl border" style={{ borderColor: theme.border }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${theme.globalColor}15` }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: theme.textColor }}>{t("contact.email")}</h3>
                <a href={`mailto:${settings.emailStore}`} className="text-sm" style={{ color: theme.globalColor }}>{settings.emailStore}</a>
              </div>
            </div>
          )}
          {settings.phoneStore && (
            <div className="flex items-start gap-4 p-4 rounded-xl border" style={{ borderColor: theme.border }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${theme.globalColor}15` }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: theme.textColor }}>{t("contact.phone")}</h3>
                <a href={`tel:${settings.phoneStore}`} className="text-sm" style={{ color: theme.globalColor }}>{settings.phoneStore}</a>
              </div>
            </div>
          )}
          {settings.addressStore && (
            <div className="flex items-start gap-4 p-4 rounded-xl border" style={{ borderColor: theme.border }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${theme.globalColor}15` }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ color: theme.textColor }}>{t("contact.address")}</h3>
                <p className="text-sm" style={{ color: theme.mutedText }}>{settings.addressStore}</p>
              </div>
            </div>
          )}
          {!settings.emailStore && !settings.phoneStore && !settings.addressStore && (
            <div className="p-6 rounded-xl border text-center" style={{ borderColor: theme.border }}>
              <p className="text-sm" style={{ color: theme.mutedText }}>{t("contact.noInfo")}</p>
            </div>
          )}
        </div>
        <div className="p-6 rounded-2xl border" style={{ borderColor: theme.border }}>
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: "#22C55E20" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h3 className="font-bold mb-1" style={{ color: theme.textColor }}>{t("contact.sent")}</h3>
              <p className="text-sm" style={{ color: theme.mutedText }}>{t("contact.willReply")}</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
              <h3 className="font-bold" style={{ color: theme.textColor }}>{t("contact.sendMessage")}</h3>
              <input placeholder={t("contact.namePlaceholder")} required className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2" style={{ borderColor: theme.border, background: theme.cardBg, color: theme.textColor }} />
              <input placeholder={t("contact.emailPlaceholder")} type="email" required className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2" style={{ borderColor: theme.border, background: theme.cardBg, color: theme.textColor }} />
              <textarea placeholder={t("contact.messagePlaceholder")} rows={4} required className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 resize-none" style={{ borderColor: theme.border, background: theme.cardBg, color: theme.textColor }} />
              <button type="submit" className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02]" style={{ background: theme.globalColor }}>{t("contact.sendBtn")}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
