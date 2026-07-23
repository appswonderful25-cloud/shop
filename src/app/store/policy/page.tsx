"use client";

import { useStore } from "../StoreContext";
import { useLanguage } from "@/app/store/LanguageContext";
import Link from "next/link";

export default function PolicyPage() {
  const { settings, theme } = useStore();
  const { t, locale } = useLanguage();
  const storeName = (locale === "ar" ? settings.nameStoreAr || settings.nameStore : settings.nameStore) || "My Store";
  const email = settings.emailStore || ("privacy@" + storeName.toLowerCase().replace(/\s+/g, "") + ".com");
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <Link href="/store#store-footer" className="text-sm font-medium hover:underline" style={{ color: theme.globalColor }}>{t("policy.backToStore")}</Link>
      </div>
      <h1 className="text-3xl font-black mb-2" style={{ color: theme.textColor }}>{t("policy.title")}</h1>
      <p className="text-sm mb-8" style={{ color: theme.mutedText }}>{t("policy.updated", { date: new Date().toLocaleDateString() })}</p>
      <div className="prose max-w-none space-y-6" style={{ color: theme.textColor }}>
        {settings.urlPolicy ? (
          <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{settings.urlPolicy}</p>
        ) : (
          <>
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("policy.s1")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("policy.s1text", { storeName })}</p>
            </section>
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("policy.s2")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("policy.s2text")}</p>
            </section>
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("policy.s3")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("policy.s3text")}</p>
            </section>
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("policy.s4")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("policy.s4text")}</p>
            </section>
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("policy.s5")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("policy.s5text", { email })}</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
