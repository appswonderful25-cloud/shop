"use client";

import { useStore } from "../StoreContext";
import { useLanguage } from "@/app/store/LanguageContext";
import Link from "next/link";

export default function TermsPage() {
  const { settings, theme } = useStore();
  const { t } = useLanguage();
  const storeName = settings.nameStore || "My Store";
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8"><Link href="/store#store-footer" className="text-sm font-medium hover:underline" style={{ color: theme.globalColor }}>{t("terms.backToStore")}</Link></div>
      <h1 className="text-3xl font-black mb-2" style={{ color: theme.textColor }}>{t("terms.title")}</h1>
      <p className="text-sm mb-8" style={{ color: theme.mutedText }}>{t("terms.updated", { date: new Date().toLocaleDateString() })}</p>
      <div className="space-y-6">
        {settings.urlTerms ? (
          <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{settings.urlTerms}</p>
        ) : (
          <>
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("terms.s1")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("terms.s1text", { storeName })}</p>
            </section>
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("terms.s2")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("terms.s2text")}</p>
            </section>
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("terms.s3")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("terms.s3text")}</p>
            </section>
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("terms.s4")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("terms.s4text", { storeName })}</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
