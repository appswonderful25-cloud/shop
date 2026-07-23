"use client";

import { useStore } from "../StoreContext";
import { useLanguage } from "@/app/store/LanguageContext";
import Link from "next/link";
import { useState } from "react";

export default function TrackingPage() {
  const { settings, theme } = useStore();
  const { t } = useLanguage();
  const [trackingId, setTrackingId] = useState("");
  const [found, setFound] = useState(false);
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8"><Link href="/store#store-footer" className="text-sm font-medium hover:underline" style={{ color: theme.globalColor }}>{t("tracking.backToStore")}</Link></div>
      <h1 className="text-3xl font-black mb-2" style={{ color: theme.textColor }}>{t("tracking.title")}</h1>
      <p className="text-sm mb-8" style={{ color: theme.mutedText }}>{t("tracking.subtitle")}</p>
      {settings.urlTracking && <p className="text-sm leading-relaxed mb-6" style={{ color: theme.mutedText }}>{settings.urlTracking}</p>}
      <div className="p-6 rounded-2xl border mb-8" style={{ borderColor: theme.border }}>
        <form onSubmit={(e) => { e.preventDefault(); if (trackingId.trim()) setFound(true); }} className="flex gap-3">
          <input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder={t("tracking.placeholder")} required className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2" style={{ borderColor: theme.border, background: theme.cardBg, color: theme.textColor }} />
          <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105" style={{ background: theme.globalColor }}>{t("tracking.track")}</button>
        </form>
      </div>
      {found && (
        <div className="p-6 rounded-2xl border" style={{ borderColor: theme.border }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${theme.globalColor}15` }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: theme.textColor }}>{t("tracking.tracking")}: {trackingId}</h3>
              <p className="text-xs" style={{ color: theme.mutedText }}>{t("tracking.updated")}</p>
            </div>
          </div>
          <div className="space-y-0">
            {[
              { step: t("tracking.orderPlaced"), time: t("tracking.daysAgo", { n: 2 }), done: true },
              { step: t("tracking.processing"), time: t("tracking.daysAgo", { n: 1 }), done: true },
              { step: t("tracking.shipped"), time: t("tracking.today"), done: true },
              { step: t("tracking.outForDelivery"), time: t("tracking.pending"), done: false },
              { step: t("tracking.delivered"), time: t("tracking.pending"), done: false },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3 pb-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full mt-1" style={{ background: s.done ? theme.globalColor : theme.border }} />
                  {i < 4 && <div className="w-0.5 h-6" style={{ background: s.done ? theme.globalColor : theme.border }} />}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: s.done ? theme.textColor : theme.mutedText }}>{s.step}</p>
                  <p className="text-xs" style={{ color: theme.mutedText }}>{s.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
