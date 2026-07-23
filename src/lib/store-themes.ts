export type HeroStyle = "gradient" | "split" | "centered" | "full" | "immersive" | "minimal" | "editorial";
export type CardStyle = "rounded" | "sharp" | "glass" | "minimal" | "elevated" | "outlined" | "neon" | "matte";
export type HeaderStyle = "solid" | "glass" | "transparent" | "floating" | "minimal-light";
export type FooterStyle = "standard" | "minimal" | "bold" | "editorial";

export interface StoreTheme {
  name: string;
  label: string;
  globalColor: string;
  headerColor: string;
  headerTextColor: string;
  footerColor: string;
  footerTextColor: string;
  footerMutedText: string;
  heroGradient: string;
  accentColor: string;
  cardBg: string;
  textColor: string;
  mutedText: string;
  border: string;
  badge: string;
  bannerBg: string;
  heroStyle: HeroStyle;
  cardStyle: CardStyle;
  headerStyle: HeaderStyle;
  footerStyle: FooterStyle;
  borderRadius: string;
  shadowSm: string;
  shadowMd: string;
  shadowLg: string;
  fontDisplay: string;
}

export const STORE_THEMES: Record<string, StoreTheme> = {
  // ── 1. AURORA — soft gradients, ethereal ──
  aurora: {
    name: "aurora", label: "Aurora",
    globalColor: "#7C3AED", headerColor: "#1E1040", headerTextColor: "#FFFFFF",
    footerColor: "#1E1040", footerTextColor: "#E0D0FF", footerMutedText: "#A898C8",
    heroGradient: "from-violet-600 via-fuchsia-500 to-cyan-400",
    accentColor: "#C084FC", cardBg: "#FAFAFF", textColor: "#1E1040",
    mutedText: "#7C6F9A", border: "#E8E0F5", badge: "#F3EEFF", bannerBg: "#F5F0FF",
    heroStyle: "immersive", cardStyle: "elevated", headerStyle: "glass", footerStyle: "standard",
    borderRadius: "1rem", shadowSm: "0 1px 3px rgba(124,58,237,0.06)", shadowMd: "0 8px 24px rgba(124,58,237,0.10)", shadowLg: "0 20px 60px rgba(124,58,237,0.15)",
    fontDisplay: "var(--font-sora), system-ui, sans-serif",
  },

  // ── 2. NOIR — pure dark, high contrast ──
  noir: {
    name: "noir", label: "Noir",
    globalColor: "#E5E5E5", headerColor: "#0A0A0A", headerTextColor: "#FFFFFF",
    footerColor: "#0A0A0A", footerTextColor: "#A0A0A0", footerMutedText: "#707070",
    heroGradient: "from-gray-900 via-gray-800 to-black",
    accentColor: "#D4D4D4", cardBg: "#141414", textColor: "#F5F5F5",
    mutedText: "#999999", border: "#2A2A2A", badge: "#1F1F1F", bannerBg: "#1A1A1A",
    heroStyle: "editorial", cardStyle: "sharp", headerStyle: "floating", footerStyle: "minimal",
    borderRadius: "0rem", shadowSm: "0 1px 3px rgba(0,0,0,0.3)", shadowMd: "0 8px 24px rgba(0,0,0,0.4)", shadowLg: "0 20px 60px rgba(0,0,0,0.5)",
    fontDisplay: "var(--font-space-grotesk), system-ui, sans-serif",
  },

  // ── 3. NEON CYBER — electric, futuristic ──
  neonCyber: {
    name: "neonCyber", label: "Neon Cyber",
    globalColor: "#00E5FF", headerColor: "#06061A", headerTextColor: "#FFFFFF",
    footerColor: "#06061A", footerTextColor: "#80C0D0", footerMutedText: "#508090",
    heroGradient: "from-cyan-400 via-blue-600 to-purple-700",
    accentColor: "#FF2D95", cardBg: "#0C0C24", textColor: "#D0E8FF",
    mutedText: "#6090B0", border: "#1A1A40", badge: "#0C0C30", bannerBg: "#0A0A20",
    heroStyle: "gradient", cardStyle: "neon", headerStyle: "glass", footerStyle: "standard",
    borderRadius: "0.5rem", shadowSm: "0 0 8px rgba(0,229,255,0.1)", shadowMd: "0 0 24px rgba(0,229,255,0.15)", shadowLg: "0 0 48px rgba(0,229,255,0.2)",
    fontDisplay: "var(--font-sora), system-ui, sans-serif",
  },

  // ── 4. OCEAN — clean blues, calm ──
  ocean: {
    name: "ocean", label: "Ocean",
    globalColor: "#0284C7", headerColor: "#0C2D4A", headerTextColor: "#FFFFFF",
    footerColor: "#0C2D4A", footerTextColor: "#B0D8F0", footerMutedText: "#70A0C0",
    heroGradient: "from-sky-500 via-blue-500 to-indigo-600",
    accentColor: "#38BDF8", cardBg: "#FFFFFF", textColor: "#0C2D4A",
    mutedText: "#5A8AAA", border: "#D6EEF8", badge: "#E0F4FE", bannerBg: "#F0F9FF",
    heroStyle: "split", cardStyle: "rounded", headerStyle: "solid", footerStyle: "standard",
    borderRadius: "1rem", shadowSm: "0 1px 3px rgba(2,132,199,0.06)", shadowMd: "0 8px 24px rgba(2,132,199,0.10)", shadowLg: "0 20px 60px rgba(2,132,199,0.12)",
    fontDisplay: "var(--font-plus-jakarta), system-ui, sans-serif",
  },

  // ── 5. FOREST — earthy greens ──
  forest: {
    name: "forest", label: "Forest",
    globalColor: "#16A34A", headerColor: "#0D2818", headerTextColor: "#FFFFFF",
    footerColor: "#0D2818", footerTextColor: "#A8E0B8", footerMutedText: "#70B880",
    heroGradient: "from-emerald-600 via-green-500 to-teal-500",
    accentColor: "#4ADE80", cardBg: "#FAFFF5", textColor: "#1A3020",
    mutedText: "#5A8A60", border: "#C8E8C8", badge: "#E0F5E0", bannerBg: "#F0FFF0",
    heroStyle: "centered", cardStyle: "rounded", headerStyle: "floating", footerStyle: "minimal",
    borderRadius: "1.25rem", shadowSm: "0 1px 3px rgba(22,163,74,0.06)", shadowMd: "0 8px 24px rgba(22,163,74,0.10)", shadowLg: "0 20px 60px rgba(22,163,74,0.12)",
    fontDisplay: "var(--font-outfit), system-ui, sans-serif",
  },

  // ── 6. ROSE — romantic pinks, elegant ──
  rose: {
    name: "rose", label: "Rose",
    globalColor: "#E11D48", headerColor: "#2A0A15", headerTextColor: "#FFFFFF",
    footerColor: "#2A0A15", footerTextColor: "#F0B0C0", footerMutedText: "#C08090",
    heroGradient: "from-rose-500 via-pink-400 to-fuchsia-400",
    accentColor: "#FB7185", cardBg: "#FFFBFC", textColor: "#3A0E1A",
    mutedText: "#905A6A", border: "#FDD8E0", badge: "#FFF0F3", bannerBg: "#FFF5F7",
    heroStyle: "immersive", cardStyle: "glass", headerStyle: "floating", footerStyle: "standard",
    borderRadius: "1.5rem", shadowSm: "0 1px 3px rgba(225,29,72,0.06)", shadowMd: "0 8px 24px rgba(225,29,72,0.10)", shadowLg: "0 20px 60px rgba(225,29,72,0.15)",
    fontDisplay: "var(--font-cormorant), Georgia, serif",
  },

  // ── 7. LUXURY — gold + black, premium ──
  luxury: {
    name: "luxury", label: "Luxury",
    globalColor: "#D4A843", headerColor: "#0E0E0E", headerTextColor: "#F5E6C8",
    footerColor: "#0E0E0E", footerTextColor: "#A89060", footerMutedText: "#806830",
    heroGradient: "from-amber-700 via-yellow-600 to-amber-500",
    accentColor: "#F0D060", cardBg: "#141414", textColor: "#F0E4C8",
    mutedText: "#9A8A6A", border: "#302A18", badge: "#1E1A0A", bannerBg: "#18140A",
    heroStyle: "editorial", cardStyle: "sharp", headerStyle: "floating", footerStyle: "minimal",
    borderRadius: "0rem", shadowSm: "0 1px 3px rgba(212,168,67,0.08)", shadowMd: "0 8px 24px rgba(212,168,67,0.12)", shadowLg: "0 20px 60px rgba(212,168,67,0.18)",
    fontDisplay: "var(--font-cormorant), Georgia, serif",
  },

  // ── 8. MINT — fresh, clean ──
  mint: {
    name: "mint", label: "Mint",
    globalColor: "#059669", headerColor: "#FFFFFF", headerTextColor: "#064E3B",
    footerColor: "#ECFDF5", footerTextColor: "#065F46", footerMutedText: "#047857",
    heroGradient: "from-emerald-400 via-teal-400 to-cyan-400",
    accentColor: "#34D399", cardBg: "#FFFFFF", textColor: "#064E3B",
    mutedText: "#4A8A70", border: "#C8F0E0", badge: "#D1FAE5", bannerBg: "#F0FDF8",
    heroStyle: "minimal", cardStyle: "outlined", headerStyle: "minimal-light", footerStyle: "minimal",
    borderRadius: "0.75rem", shadowSm: "0 1px 3px rgba(5,150,105,0.06)", shadowMd: "0 8px 24px rgba(5,150,105,0.08)", shadowLg: "0 20px 60px rgba(5,150,105,0.10)",
    fontDisplay: "var(--font-dm-sans), system-ui, sans-serif",
  },

  // ── 9. SUNSET — warm oranges ──
  sunset: {
    name: "sunset", label: "Sunset",
    globalColor: "#EA580C", headerColor: "#2A1005", headerTextColor: "#FFFFFF",
    footerColor: "#2A1005", footerTextColor: "#F0C8A0", footerMutedText: "#C09060",
    heroGradient: "from-orange-500 via-rose-400 to-pink-500",
    accentColor: "#FB923C", cardBg: "#FFFCF5", textColor: "#2A1505",
    mutedText: "#8A6A4A", border: "#FDE0C0", badge: "#FFF0E0", bannerBg: "#FFF8F0",
    heroStyle: "full", cardStyle: "elevated", headerStyle: "glass", footerStyle: "standard",
    borderRadius: "1rem", shadowSm: "0 1px 3px rgba(234,88,12,0.06)", shadowMd: "0 8px 24px rgba(234,88,12,0.10)", shadowLg: "0 20px 60px rgba(234,88,12,0.15)",
    fontDisplay: "var(--font-plus-jakarta), system-ui, sans-serif",
  },

  // ── 10. STONE — neutral, sophisticated ──
  stone: {
    name: "stone", label: "Stone",
    globalColor: "#78716C", headerColor: "#FAFAF9", headerTextColor: "#1C1917",
    footerColor: "#F0EFED", footerTextColor: "#57534E", footerMutedText: "#78716C",
    heroGradient: "from-stone-500 via-stone-400 to-stone-600",
    accentColor: "#A8A29E", cardBg: "#FFFFFF", textColor: "#1C1917",
    mutedText: "#78716C", border: "#E7E5E4", badge: "#F5F5F4", bannerBg: "#FAFAF9",
    heroStyle: "minimal", cardStyle: "matte", headerStyle: "minimal-light", footerStyle: "minimal",
    borderRadius: "0.5rem", shadowSm: "0 1px 3px rgba(0,0,0,0.04)", shadowMd: "0 8px 24px rgba(0,0,0,0.06)", shadowLg: "0 20px 60px rgba(0,0,0,0.08)",
    fontDisplay: "var(--font-manrope), system-ui, sans-serif",
  },

  // ── 11. ELECTRIC — bold blue ──
  electric: {
    name: "electric", label: "Electric",
    globalColor: "#2563EB", headerColor: "#0A1040", headerTextColor: "#FFFFFF",
    footerColor: "#0A1040", footerTextColor: "#B0C8F0", footerMutedText: "#7090B0",
    heroGradient: "from-blue-600 via-indigo-600 to-violet-600",
    accentColor: "#60A5FA", cardBg: "#F4F6FF", textColor: "#0E1A40",
    mutedText: "#5A6A90", border: "#D0D8F0", badge: "#E0E8FF", bannerBg: "#F0F4FF",
    heroStyle: "gradient", cardStyle: "elevated", headerStyle: "glass", footerStyle: "standard",
    borderRadius: "1rem", shadowSm: "0 1px 3px rgba(37,99,235,0.06)", shadowMd: "0 8px 24px rgba(37,99,235,0.10)", shadowLg: "0 20px 60px rgba(37,99,235,0.15)",
    fontDisplay: "var(--font-sora), system-ui, sans-serif",
  },

  // ── 12. BLUSH — soft pink, feminine ──
  blush: {
    name: "blush", label: "Blush",
    globalColor: "#DB2777", headerColor: "#FFF0F5", headerTextColor: "#5A0A2A",
    footerColor: "#FFF0F5", footerTextColor: "#8A4A68", footerMutedText: "#A06880",
    heroGradient: "from-pink-400 via-rose-300 to-fuchsia-400",
    accentColor: "#F472B6", cardBg: "#FFFFFF", textColor: "#5A0A2A",
    mutedText: "#9A6A80", border: "#F9D0DE", badge: "#FFF0F5", bannerBg: "#FFF5F9",
    heroStyle: "centered", cardStyle: "glass", headerStyle: "floating", footerStyle: "standard",
    borderRadius: "1.5rem", shadowSm: "0 1px 3px rgba(219,39,119,0.06)", shadowMd: "0 8px 24px rgba(219,39,119,0.10)", shadowLg: "0 20px 60px rgba(219,39,119,0.15)",
    fontDisplay: "var(--font-cormorant), Georgia, serif",
  },

  // ── 13. SLATE — professional, corporate ──
  slate: {
    name: "slate", label: "Slate",
    globalColor: "#475569", headerColor: "#FFFFFF", headerTextColor: "#0F172A",
    footerColor: "#F1F5F9", footerTextColor: "#475569", footerMutedText: "#64748B",
    heroGradient: "from-slate-600 via-slate-500 to-gray-600",
    accentColor: "#94A3B8", cardBg: "#FFFFFF", textColor: "#0F172A",
    mutedText: "#64748B", border: "#E2E8F0", badge: "#F1F5F9", bannerBg: "#F8FAFC",
    heroStyle: "split", cardStyle: "outlined", headerStyle: "minimal-light", footerStyle: "editorial",
    borderRadius: "0.375rem", shadowSm: "0 1px 3px rgba(0,0,0,0.04)", shadowMd: "0 8px 24px rgba(0,0,0,0.06)", shadowLg: "0 20px 60px rgba(0,0,0,0.08)",
    fontDisplay: "var(--font-plus-jakarta), system-ui, sans-serif",
  },

  // ── 14. VOLCANIC — deep reds, dramatic ──
  volcanic: {
    name: "volcanic", label: "Volcanic",
    globalColor: "#DC2626", headerColor: "#1C0606", headerTextColor: "#FFFFFF",
    footerColor: "#1C0606", footerTextColor: "#F0A0A0", footerMutedText: "#C07070",
    heroGradient: "from-red-600 via-orange-500 to-amber-500",
    accentColor: "#F87171", cardBg: "#1A0A0A", textColor: "#FFE8E8",
    mutedText: "#C09090", border: "#3A1515", badge: "#2A0A0A", bannerBg: "#200808",
    heroStyle: "immersive", cardStyle: "sharp", headerStyle: "glass", footerStyle: "minimal",
    borderRadius: "0.25rem", shadowSm: "0 1px 3px rgba(220,38,38,0.1)", shadowMd: "0 8px 24px rgba(220,38,38,0.15)", shadowLg: "0 20px 60px rgba(220,38,38,0.2)",
    fontDisplay: "var(--font-space-grotesk), system-ui, sans-serif",
  },

  // ── 15. CREAM — warm, cozy, artisanal ──
  cream: {
    name: "cream", label: "Cream",
    globalColor: "#B45309", headerColor: "#FFFBF0", headerTextColor: "#4A2A05",
    footerColor: "#FFF5E0", footerTextColor: "#7A5A30", footerMutedText: "#9A7A50",
    heroGradient: "from-amber-600 via-orange-500 to-rose-400",
    accentColor: "#D97706", cardBg: "#FFFEF8", textColor: "#4A2A05",
    mutedText: "#907040", border: "#F0E0C0", badge: "#FFF5E0", bannerBg: "#FFFAE8",
    heroStyle: "editorial", cardStyle: "matte", headerStyle: "floating", footerStyle: "editorial",
    borderRadius: "0.75rem", shadowSm: "0 1px 3px rgba(180,83,9,0.06)", shadowMd: "0 8px 24px rgba(180,83,9,0.08)", shadowLg: "0 20px 60px rgba(180,83,9,0.10)",
    fontDisplay: "var(--font-dm-sans), system-ui, sans-serif",
  },
};

export function getThemeColors(themeName: string) {
  return STORE_THEMES[themeName] || STORE_THEMES.aurora;
}
