"use client";
import { useLanguage } from "@/app/store/LanguageContext";

// Helper to translate DB values like categories, statuses, etc.
// Usage: const { translateDB } = useDBTranslation(); translateDB(category)
export function useDBTranslation() {
  const { t, locale } = useLanguage();

  const translateCategory = (cat: string | undefined | null): string => {
    if (!cat) return "";
    const map: Record<string, string> = {
      "Electronics": t("db.electronics"),
      "Clothing": t("db.clothing"),
      "Clothing & Apparel": t("db.clothing"),
      "Home & Kitchen": t("db.homeKitchen"),
      "Books": t("db.books"),
      "Books & Media": t("db.books"),
      "Sports": t("db.sports"),
      "Sports & Outdoors": t("db.sports"),
      "Beauty": t("db.beauty"),
      "Beauty & Personal Care": t("db.beauty"),
      "Toys": t("db.toys"),
      "Toys & Games": t("db.toys"),
      "Automotive": t("db.automotive"),
      "Garden": t("db.garden"),
      "Garden & Outdoor": t("db.garden"),
      "Health": t("db.health"),
      "Health & Wellness": t("db.health"),
      "Pet": t("db.pet"),
      "Pet Supplies": t("db.pet"),
    };
    return map[cat] || cat;
  };

  const translateOrderStatus = (status: string | undefined | null): string => {
    if (!status) return "";
    const map: Record<string, string> = {
      "delivered": t("db.delivered"),
      "inTransit": t("db.inTransit"),
      "in_transit": t("db.inTransit"),
      "failed": t("db.failed"),
      "pending": t("db.pending"),
      "returned": t("db.returned"),
      "rejected": t("db.rejected"),
      "confirmed": t("dashboardOrders.confirmed"),
      "shipped": t("dashboardOrders.shipped"),
      "cancelled": t("dashboardOrders.cancelled"),
    };
    return map[status] || status;
  };

  const translateReturnStatus = (status: string | undefined | null): string => {
    if (!status) return "";
    const map: Record<string, string> = {
      "returned": t("db.returned"),
      "pending": t("db.pending"),
      "rejected": t("db.rejected"),
      "approved": t("dashboardReturns.approved"),
      "completed": t("dashboardReturns.completed"),
    };
    return map[status] || status;
  };

  const translateProductStatus = (status: string | undefined | null): string => {
    if (!status) return "";
    const map: Record<string, string> = {
      "active": t("db.active"),
      "draft": t("db.draft"),
      "out_of_stock": t("db.outOfStock"),
      "outOfStock": t("db.outOfStock"),
    };
    return map[status] || status;
  };

  const translateTicketStatus = (status: string | undefined | null): string => {
    if (!status) return "";
    const map: Record<string, string> = {
      "pending": t("db.pending"),
      "in_progress": t("db.inProgress"),
      "inProgress": t("db.inProgress"),
      "solved": t("db.solved"),
      "closed": t("db.closed"),
      "open": t("db.open"),
    };
    return map[status] || status;
  };

  const translatePriority = (p: string | undefined | null): string => {
    if (!p) return "";
    const map: Record<string, string> = {
      "low": t("db.low"),
      "medium": t("db.medium"),
      "high": t("db.high"),
      "urgent": t("db.urgent"),
    };
    return map[p.toLowerCase()] || p;
  };

  const translateRole = (role: string | undefined | null): string => {
    if (!role) return "";
    const lower = role.toLowerCase();
    if (lower === "admin") return t("db.admin");
    if (lower === "manager") return t("db.manager");
    if (lower === "support" || lower === "support agent" || lower === "support_agent") return t("db.support");
    if (lower === "editor") return t("dashboardTeams.editor");
    if (lower === "viewer") return t("dashboardTeams.viewer");
    return role;
  };

  const translateCouponType = (type: string | undefined | null): string => {
    if (!type) return "";
    const lower = type.toLowerCase();
    if (lower.includes("percent")) return t("db.percentage");
    if (lower.includes("fixed") || lower.includes("amount")) return t("db.fixed");
    return type;
  };

  const translateWalletStatus = (status: string | undefined | null): string => {
    if (!status) return "";
    const map: Record<string, string> = {
      "success": t("db.success"),
      "failed": t("db.failed"),
      "pending": t("db.pending"),
    };
    return map[status] || status;
  };

  const translatePaymentType = (type: string | undefined | null): string => {
    if (!type) return "";
    const lower = type.toLowerCase();
    if (lower.includes("visa")) return t("db.visa");
    if (lower.includes("bank")) return t("db.bank");
    if (lower.includes("paypal")) return t("db.paypal");
    return type;
  };

  const translateProductTitle = (title: string): string => {
    // For free text from DB, if Arabic locale, we keep original but could attempt transliteration.
    // Here we return as-is but ensure RTL alignment via CSS, not translation
    // If you have AI translation integration, you could call it here.
    // For now we just return original.
    return title;
  };

  const translateDB = (value: string | undefined | null, type?: "category" | "orderStatus" | "returnStatus" | "productStatus" | "ticketStatus" | "priority" | "role" | "couponType" | "walletStatus" | "paymentType"): string => {
    if (!value) return "";
    switch (type) {
      case "category": return translateCategory(value);
      case "orderStatus": return translateOrderStatus(value);
      case "returnStatus": return translateReturnStatus(value);
      case "productStatus": return translateProductStatus(value);
      case "ticketStatus": return translateTicketStatus(value);
      case "priority": return translatePriority(value);
      case "role": return translateRole(value);
      case "couponType": return translateCouponType(value);
      case "walletStatus": return translateWalletStatus(value);
      case "paymentType": return translatePaymentType(value);
      default: {
        // auto detect
        // try all maps
        return translateCategory(value) !== value ? translateCategory(value) :
               translateOrderStatus(value) !== value ? translateOrderStatus(value) :
               translateReturnStatus(value) !== value ? translateReturnStatus(value) :
               translateProductStatus(value) !== value ? translateProductStatus(value) :
               translateTicketStatus(value) !== value ? translateTicketStatus(value) :
               translatePriority(value) !== value ? translatePriority(value) :
               translateRole(value) !== value ? translateRole(value) :
               value;
      }
    }
  };

  return {
    translateCategory,
    translateOrderStatus,
    translateReturnStatus,
    translateProductStatus,
    translateTicketStatus,
    translatePriority,
    translateRole,
    translateCouponType,
    translateWalletStatus,
    translatePaymentType,
    translateDB,
    translateProductTitle,
    locale
  };
}
