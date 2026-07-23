"use client";

import { useStore } from "../StoreContext";
import { useLanguage } from "@/app/store/LanguageContext";
import Link from "next/link";

export default function ShippingPage() {
  const { settings, theme } = useStore();
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8"><Link href="/store#store-footer" className="text-sm font-medium hover:underline" style={{ color: theme.globalColor }}>{t("shipping.backToStore")}</Link></div>
      <h1 className="text-3xl font-black mb-2" style={{ color: theme.textColor }}>{t("shipping.title")}</h1>
      <p className="text-sm mb-8" style={{ color: theme.mutedText }}>{t("shipping.updated", { date: new Date().toLocaleDateString() })}</p>
      <div className="space-y-6">
        {settings.urlShippingReturnsPolicy ? (
          <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{settings.urlShippingReturnsPolicy}</p>
        ) : (
          <>
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("shipping.policy")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("shipping.policyText")}</p>
              <p className="text-sm leading-relaxed mt-2" style={{ color: theme.mutedText }}>{settings.shippingCost ? t("shipping.cost", { cost: String(settings.shippingCost) }) : t("shipping.freeShipping")}</p>
            </section>
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("shipping.returnPolicy")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("shipping.returnText")}</p>
            </section>
            <section>
              <h2 className="text-lg font-bold mb-3" style={{ color: theme.textColor }}>{t("shipping.refunds")}</h2>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{t("shipping.refundText")}</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
