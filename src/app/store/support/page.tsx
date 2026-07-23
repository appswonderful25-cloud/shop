"use client";

import { useStore } from "../StoreContext";
import { useLanguage } from "@/app/store/LanguageContext";
import Link from "next/link";

export default function SupportPage() {
  const { settings, theme } = useStore();
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8"><Link href="/store#store-footer" className="text-sm font-medium hover:underline" style={{ color: theme.globalColor }}>{t("support.backToStore")}</Link></div>
      <h1 className="text-3xl font-black mb-2" style={{ color: theme.textColor }}>{t("support.title")}</h1>
      <p className="text-sm mb-8" style={{ color: theme.mutedText }}>{t("support.howCanWeHelp")}</p>
      {settings.urlSupport ? (
        <p className="text-sm leading-relaxed mb-6" style={{ color: theme.mutedText }}>{settings.urlSupport}</p>
      ) : null}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {[
          { title: t("support.orderIssues"), desc: t("support.orderIssuesDesc"), icon: "📦" },
          { title: t("support.returnsRefunds"), desc: t("support.returnsRefundsDesc"), icon: "↩️" },
          { title: t("support.accountHelp"), desc: t("support.accountHelpDesc"), icon: "👤" },
          { title: t("support.paymentProblems"), desc: t("support.paymentProblemsDesc"), icon: "💳" },
        ].map((item, i) => (
          <div key={i} className="p-5 rounded-2xl border hover:shadow-lg transition-all cursor-pointer group" style={{ borderColor: theme.border }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-bold text-sm mb-1 group-hover:underline" style={{ color: theme.textColor }}>{item.title}</h3>
                <p className="text-xs" style={{ color: theme.mutedText }}>{item.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 rounded-2xl border text-center" style={{ borderColor: theme.border, background: `${theme.globalColor}05` }}>
        <h3 className="font-bold mb-2" style={{ color: theme.textColor }}>{t("support.stillNeedHelp")}</h3>
        <p className="text-sm mb-4" style={{ color: theme.mutedText }}>{t("support.teamAvailable")}</p>
        <Link href="/store/contact" className="inline-block px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105" style={{ background: theme.globalColor }}>{t("support.contactSupport")}</Link>
      </div>
    </div>
  );
}
