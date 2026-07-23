export type CategoryLayout = "bento" | "editorial" | "organic" | "magazine" | "gallery" | "dynamic" | "playful" | "classic" | "showcase" | "minimal" | "friendly" | "industrial";

export interface StoreCategory {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  icon: string;
  layoutType: CategoryLayout;
  fontFamily: string;
  borderRadius: string;
  theme: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    accent: string;
    bg: string;
    cardBg: string;
    textColor: string;
    mutedText: string;
    border: string;
    headerBg: string;
    headerText: string;
    footerBg: string;
    footerText: string;
    footerMuted: string;
    heroGradient: string;
    badge: string;
  };
  products: Array<{
    title: string;
    titleAr: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    image: string;
    badge?: string;
  }>;
  heroTag: string;
  heroTitle: string;
  heroDesc: string;
  heroImages: string[];
  features: Array<{ title: string; titleAr: string; desc: string; descAr: string; icon: string }>;
}

export const STORE_CATEGORIES: Record<string, StoreCategory> = {
  electronics: {
    id: "electronics", name: "Electronics", nameAr: "الإلكترونيات", description: "Latest phones, laptops, and tech gadgets", icon: "📱",
    layoutType: "bento", fontFamily: "var(--font-sora), system-ui, sans-serif", borderRadius: "0.75rem",
    theme: {
      primary: "#2563EB", primaryDark: "#1D4ED8", primaryLight: "#93C5FD", accent: "#06B6D4",
      bg: "#F0F4FF", cardBg: "#FFFFFF", textColor: "#0E1A40", mutedText: "#5A6A90",
      border: "#D0D8F0", headerBg: "#0E1A40", headerText: "#FFFFFF",
      footerBg: "#0E1A40", footerText: "#B0C8F0", footerMuted: "#7090B0",
      heroGradient: "linear-gradient(135deg, #0E1A40 0%, #1E3A6F 50%, #0E1A40 100%)", badge: "#2563EB",
    },
    products: [
      { title: "iPhone 16 Pro Max", titleAr: "آيفون 16 برو ماكس", description: "Latest Apple flagship with A18 Pro chip, titanium design", price: 1199, originalPrice: 1299, category: "phones", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80", badge: "NEW" },
      { title: "Samsung Galaxy S25 Ultra", titleAr: "سامسونج جالكسي S25", description: "Premium Android with S Pen, 200MP camera", price: 1099, originalPrice: 1199, category: "phones", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80", badge: "HOT" },
      { title: "MacBook Pro M4 16\"", titleAr: "ماك بوك برو M4", description: "M4 Pro chip, 36GB RAM, Liquid Retina XDR", price: 2499, category: "laptops", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80" },
      { title: "Sony WH-1000XM6", titleAr: "سوني سماعات", description: "Industry-leading noise cancellation, 30hr battery", price: 349, originalPrice: 399, category: "audio", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", badge: "-13%" },
      { title: "iPad Pro M4 13\"", titleAr: "آيباد برو", description: "Ultra-thin, tandem OLED, Apple Pencil Pro", price: 1299, category: "tablets", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80" },
      { title: "Samsung 65\" OLED 4K TV", titleAr: "شاشة سامسونج OLED", description: "AI upscaling, 120Hz gaming mode", price: 1899, originalPrice: 2199, category: "displays", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80", badge: "-14%" },
      { title: "Apple Watch Ultra 3", titleAr: "آبل ووتش", description: "GPS, 72-hour battery, dual-frequency", price: 799, category: "wearables", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80" },
      { title: "AirPods Pro 3", titleAr: "إيربودز برو", description: "ANC, spatial audio, USB-C charging", price: 249, category: "audio", image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=400&q=80" },
    ],
    heroTag: "LATEST TECH", heroTitle: "Future\nTechnology", heroDesc: "Discover the latest in phones, laptops, and cutting-edge gadgets",
    heroImages: ["https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&q=80", "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80", "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80"],
    features: [
      { title: "Free Delivery", titleAr: "شحن سريع", desc: "On orders over $99", descAr: "توصيل في 24 ساعة", icon: "truck" },
      { title: "2-Year Warranty", titleAr: "منتجات أصلية", desc: "Full coverage", descAr: "100% مضمونة", icon: "shield" },
      { title: "Trade-In", titleAr: "دفع آمن", desc: "Upgrade your device", descAr: "حماية كاملة", icon: "refresh" },
      { title: "24/7 Support", titleAr: "دعم فني", desc: "Expert help", descAr: "متخصصون في التقنية", icon: "headset" },
    ],
  },

  fashion: {
    id: "fashion", name: "Fashion", nameAr: "الأزياء", description: "Premium clothing, shoes, and accessories", icon: "👗",
    layoutType: "editorial", fontFamily: "var(--font-cormorant), Georgia, serif", borderRadius: "0rem",
    theme: {
      primary: "#18181B", primaryDark: "#000000", primaryLight: "#A1A1AA", accent: "#E11D48",
      bg: "#FAFAFA", cardBg: "#FFFFFF", textColor: "#18181B", mutedText: "#71717A",
      border: "#E4E4E7", headerBg: "#FFFFFF", headerText: "#18181B",
      footerBg: "#18181B", footerText: "#D4D4D8", footerMuted: "#A1A1AA",
      heroGradient: "linear-gradient(135deg, #18181B 0%, #27272A 50%, #18181B 100%)", badge: "#E11D48",
    },
    products: [
      { title: "Premium Leather Jacket", titleAr: "جاكيت جلد", description: "Genuine Italian leather, timeless design", price: 289, originalPrice: 349, category: "outerwear", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80", badge: "NEW" },
      { title: "Cashmere Sweater", titleAr: "سويتر كشمير", description: "100% Mongolian cashmere, relaxed fit", price: 189, category: "knitwear", image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80" },
      { title: "Slim Fit Denim Jeans", titleAr: "جينز سليم", description: "Premium stretch denim, modern slim fit", price: 98, originalPrice: 128, category: "bottoms", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", badge: "-23%" },
      { title: "Silk Evening Dress", titleAr: "فستان سهرة", description: "Flowing silk charmeuse, asymmetric hemline", price: 459, category: "dresses", image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80" },
      { title: "Italian Leather Boots", titleAr: "حذاء جلد", description: "Handcrafted in Florence, Goodyear welted", price: 349, category: "shoes", image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=80" },
      { title: "Merino Wool Overcoat", titleAr: "معطف صوف", description: "Double-breasted, Australian merino", price: 399, originalPrice: 499, category: "outerwear", image: "https://images.unsplash.com/photo-1544923408-75c5cef46f14?w=400&q=80", badge: "-20%" },
      { title: "Linen Summer Shirt", titleAr: "قميص صيفي", description: "French linen, relaxed fit", price: 89, category: "tops", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80" },
      { title: "Suede Crossbody Bag", titleAr: "حقيبة كروس", description: "Italian suede, adjustable strap, gold hardware", price: 229, category: "accessories", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80" },
    ],
    heroTag: "NEW COLLECTION", heroTitle: "Timeless\nElegance", heroDesc: "Curated fashion for the modern wardrobe",
    heroImages: ["https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80", "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200&q=80"],
    features: [
      { title: "Free Shipping", titleAr: "شحن مجاني", desc: "Orders over $100", descAr: "على الطلبات فوق 50$", icon: "truck" },
      { title: "Easy Returns", titleAr: "إرجاع سهل", desc: "30-day policy", descAr: "خلال 30 يوماً", icon: "refresh" },
      { title: "Size Guide", titleAr: "جودة عالية", desc: "Perfect fit", descAr: "خامات مختارة بعناية", icon: "ruler" },
      { title: "Styling Advice", titleAr: "دليل الأناقة", desc: "Expert consultation", descAr: "أحدث صيحات الموضة", icon: "star" },
    ],
  },

  food: {
    id: "food", name: "Food & Grocery", nameAr: "الأغذية", description: "Fresh organic food and gourmet ingredients", icon: "🍎",
    layoutType: "organic", fontFamily: "var(--font-dm-sans), system-ui, sans-serif", borderRadius: "1.5rem",
    theme: {
      primary: "#16A34A", primaryDark: "#15803D", primaryLight: "#86EFAC", accent: "#F59E0B",
      bg: "#F0FFF4", cardBg: "#FFFFFF", textColor: "#14532D", mutedText: "#3D8B40",
      border: "#BBF7D0", headerBg: "#14532D", headerText: "#FFFFFF",
      footerBg: "#14532D", footerText: "#BBF7D0", footerMuted: "#6EE080",
      heroGradient: "linear-gradient(135deg, #14532D 0%, #166534 50%, #14532D 100%)", badge: "#16A34A",
    },
    products: [
      { title: "Organic Avocados (6pc)", titleAr: "أفوكادو عضوي", description: "Hand-picked Hass avocados, perfectly ripe", price: 8.99, category: "fruits", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&q=80", badge: "FRESH" },
      { title: "Sourdough Bread Loaf", titleAr: "خبز ساور دو", description: "24-hour fermented, stone-baked artisan", price: 6.49, category: "bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80" },
      { title: "Atlantic Salmon Fillet", titleAr: "سلمون أطلسي", description: "Wild-caught, sustainably sourced, 400g", price: 24.99, originalPrice: 29.99, category: "seafood", image: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=400&q=80", badge: "-17%" },
      { title: "Extra Virgin Olive Oil", titleAr: "زيت زيتون بكر", description: "Cold-pressed Italian, 500ml, first harvest", price: 18.99, category: "pantry", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80" },
      { title: "Mixed Berry Box", titleAr: "فاكهة مشكلة", description: "Strawberries, blueberries, raspberries 500g", price: 12.99, category: "fruits", image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=400&q=80" },
      { title: "Artisan Cheese Selection", titleAr: "أجبان حرفية", description: "French brie, cheddar, gouda — 300g", price: 22.99, category: "dairy", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&q=80" },
      { title: "Free Range Eggs (12pc)", titleAr: "بيض طليق", description: "Farm-fresh, pasture-raised, omega-3", price: 7.99, category: "dairy", image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80" },
      { title: "Organic Pasta Bundle", titleAr: "معكرونة عضوية", description: "Bronze-died Italian pasta — 3 types", price: 14.99, category: "pantry", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80" },
    ],
    heroTag: "FARM FRESH", heroTitle: "Nature's\nBest", heroDesc: "Fresh organic produce delivered to your doorstep",
    heroImages: ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80", "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=1200&q=80", "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&q=80"],
    features: [
      { title: "Same-Day Delivery", titleAr: "طازج من المزرعة", desc: "Order before 2 PM", descAr: "مصدر مباشر من المزارع", icon: "truck" },
      { title: "100% Organic", titleAr: "توصيل سريع", desc: "Certified fresh", descAr: "توصيل في نفس اليوم", icon: "leaf" },
      { title: "Cold Chain", titleAr: "جودة مضمونة", desc: "Always fresh", descAr: "معايير صارمة", icon: "snowflake" },
      { title: "Recipe Ideas", titleAr: "خيارات عضوية", desc: "Cook with us", descAr: "منتجات طبيعية", icon: "book" },
    ],
  },

  beauty: {
    id: "beauty", name: "Beauty", nameAr: "الجمال", description: "Premium skincare, makeup, and fragrance", icon: "💄",
    layoutType: "magazine", fontFamily: "var(--font-cormorant), Georgia, serif", borderRadius: "1rem",
    theme: {
      primary: "#BE185D", primaryDark: "#9D174D", primaryLight: "#F9A8D4", accent: "#C9A84C",
      bg: "#FFF0F5", cardBg: "#FFFFFF", textColor: "#5A0A2A", mutedText: "#9A4A68",
      border: "#F9D0DE", headerBg: "#5A0A2A", headerText: "#FFFFFF",
      footerBg: "#5A0A2A", footerText: "#F0B8D0", footerMuted: "#C08098",
      heroGradient: "linear-gradient(135deg, #5A0A2A 0%, #9D174D 50%, #5A0A2A 100%)", badge: "#BE185D",
    },
    products: [
      { title: "Hydrating Serum", titleAr: "سيروم مرطب", description: "Hyaluronic acid + Vitamin C, 30ml", price: 59, originalPrice: 79, category: "skincare", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80", badge: "BESTSELLER" },
      { title: "Velvet Matte Lipstick", titleAr: "أحمر شفاه مات", description: "Long-lasting 12-hour wear, rich pigment", price: 32, category: "makeup", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&q=80" },
      { title: "Rose Gold Eyeshadow", titleAr: "باليت ظلال", description: "12 shimmery and matte shades", price: 45, category: "makeup", image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80" },
      { title: "Retinol Night Cream", titleAr: "كريم ليلي", description: "Anti-aging, 0.5% retinol, 50ml", price: 68, category: "skincare", image: "https://images.unsplash.com/photo-1570194065650-d99fb4a38691?w=400&q=80" },
      { title: "Luxury Perfume Oil", titleAr: "زيت عطر فاخر", description: "Concentrated, 12ml, Oud & Rose", price: 129, originalPrice: 159, category: "fragrance", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80", badge: "-19%" },
      { title: "Keratin Hair Mask", titleAr: "ماسك كيراتين", description: "Deep conditioning, 250ml", price: 38, category: "haircare", image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&q=80" },
      { title: "SPF 50 Sunscreen", titleAr: "واقي شمس", description: "Lightweight, invisible finish, 50ml", price: 28, category: "skincare", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80" },
      { title: "Makeup Brush Set", titleAr: "فرش مكياج", description: "12-piece, synthetic bristles", price: 55, category: "tools", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80" },
    ],
    heroTag: "BEAUTY COLLECTION", heroTitle: "Glow\nBeautifully", heroDesc: "Premium skincare and makeup for your daily routine",
    heroImages: ["https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80", "https://images.unsplash.com/photo-1612817288687-0b97d8f4b379?w=1200&q=80"],
    features: [
      { title: "Free Samples", titleAr: "عينات مجانية", desc: "With every order", descAr: "مع كل طلب", icon: "gift" },
      { title: "Expert Advice", titleAr: "نصائح متخصصة", desc: "Beauty consultants", descAr: "استشارات جمالية", icon: "star" },
      { title: "Authentic", titleAr: "خالٍ من التجارب", desc: "100% genuine", descAr: "لم يُختبر على الحيوانات", icon: "shield" },
      { title: "Gift Wrapping", titleAr: "جمال نظيف", desc: "Luxury packaging", descAr: "مكونات آمنة وطبيعية", icon: "package" },
    ],
  },

  home: {
    id: "home", name: "Home & Furniture", nameAr: "المنزل", description: "Modern furniture, decor, and essentials", icon: "🏠",
    layoutType: "gallery", fontFamily: "var(--font-dm-sans), system-ui, sans-serif", borderRadius: "1.25rem",
    theme: {
      primary: "#92400E", primaryDark: "#78350F", primaryLight: "#FCD34D", accent: "#059669",
      bg: "#FFFBEB", cardBg: "#FFFFFF", textColor: "#451A03", mutedText: "#8A6020",
      border: "#FDE68A", headerBg: "#451A03", headerText: "#FEF3C7",
      footerBg: "#451A03", footerText: "#FDE68A", footerMuted: "#C0A050",
      heroGradient: "linear-gradient(135deg, #451A03 0%, #78350F 50%, #451A03 100%)", badge: "#D97706",
    },
    products: [
      { title: "Scandinavian Sofa", titleAr: "أريكة اسكندنافية", description: "Minimalist, oak legs, premium linen", price: 1299, originalPrice: 1599, category: "living", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", badge: "-19%" },
      { title: "Walnut Dining Table", titleAr: "طاولة جوز", description: "Solid American walnut, seats 6", price: 899, category: "dining", image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&q=80" },
      { title: "Ceramic Table Lamp", titleAr: "مصباح سيراميك", description: "Hand-thrown ceramic, dimmable LED", price: 149, category: "lighting", image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab866?w=400&q=80" },
      { title: "Velvet Accent Chair", titleAr: "كرسي مخملي", description: "Mid-century, emerald velvet, brass legs", price: 449, category: "living", image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&q=80" },
      { title: "Handwoven Area Rug", titleAr: "سجادة منسوجة", description: "Moroccan-inspired, 200x300cm", price: 349, originalPrice: 449, category: "decor", image: "https://images.unsplash.com/photo-1600166898405-da9535204843?w=400&q=80", badge: "-22%" },
      { title: "Oak Bookshelf", titleAr: "رف كتب", description: "5-tier solid oak, adjustable shelves", price: 299, category: "storage", image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&q=80" },
      { title: "Linen Bedding Set", titleAr: "طقم ملاحي", description: "Stonewashed French linen, queen size", price: 199, category: "bedroom", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80" },
      { title: "Marble Coffee Table", titleAr: "طاولة رخامية", description: "Carrara marble, steel frame, 120cm", price: 599, category: "living", image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=400&q=80" },
    ],
    heroTag: "HOME STYLING", heroTitle: "Design\nYour Space", heroDesc: "Modern furniture and decor for every room",
    heroImages: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"],
    features: [
      { title: "Free Assembly", titleAr: "استشارة تصميم", desc: "White glove service", descAr: "مساعدة في اختيار الديكور", icon: "tools" },
      { title: "Room Planner", titleAr: "تركيب سريع", desc: "3D visualization", descAr: "خدمة تركيب متاحة", icon: "cube" },
      { title: "Easy Returns", titleAr: "ضمان مشمول", desc: "30-day policy", descAr: "ضمان شامل", icon: "refresh" },
      { title: "Price Match", titleAr: "إرجاع مجاني", desc: "Best value", descAr: "شحن الإرجاع على حسابنا", icon: "tag" },
    ],
  },

  sports: {
    id: "sports", name: "Sports & Fitness", nameAr: "الرياضة", description: "Athletic gear, gym equipment, and sportswear", icon: "⚽",
    layoutType: "dynamic", fontFamily: "var(--font-outfit), system-ui, sans-serif", borderRadius: "0.5rem",
    theme: {
      primary: "#DC2626", primaryDark: "#B91C1C", primaryLight: "#FCA5A5", accent: "#F97316",
      bg: "#FFF5F5", cardBg: "#FFFFFF", textColor: "#5A0A0A", mutedText: "#9A3030",
      border: "#FECACA", headerBg: "#5A0A0A", headerText: "#FFFFFF",
      footerBg: "#5A0A0A", footerText: "#F0B0B0", footerMuted: "#C08080",
      heroGradient: "linear-gradient(135deg, #5A0A0A 0%, #991B1B 50%, #5A0A0A 100%)", badge: "#DC2626",
    },
    products: [
      { title: "Running Shoes Pro", titleAr: "حذاء رياضي", description: "Lightweight, responsive cushioning", price: 159, originalPrice: 189, category: "footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", badge: "NEW" },
      { title: "Adjustable Dumbbells", titleAr: "دمبلز", description: "5-50 lbs each, quick-change", price: 349, category: "equipment", image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400&q=80" },
      { title: "Yoga Mat Premium", titleAr: "سجادة يوغا", description: "6mm, non-slip, eco-friendly TPE", price: 49, category: "accessories", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80" },
      { title: "Compression Shirt", titleAr: "قميص رياضي", description: "Moisture-wicking, 4-way stretch", price: 59, category: "apparel", image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80" },
      { title: "Smart Fitness Watch", titleAr: "ساعة ذكية", description: "GPS, heart rate, 14-day battery", price: 249, originalPrice: 299, category: "wearables", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", badge: "-17%" },
      { title: "Protein Shaker", titleAr: "زجاجة بروتين", description: "BPA-free, leak-proof, 700ml", price: 18, category: "accessories", image: "https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&q=80" },
      { title: "Resistance Bands", titleAr: "أحزمة مقاومة", description: "5 levels, door anchor, handles", price: 35, category: "equipment", image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&q=80" },
      { title: "Gym Duffel Bag", titleAr: "حقيبة رياضية", description: "Water-resistant, shoe compartment", price: 79, category: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80" },
    ],
    heroTag: "GEAR UP", heroTitle: "Push Your\nLimits", heroDesc: "Premium athletic gear for peak performance",
    heroImages: ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80", "https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=1200&q=80"],
    features: [
      { title: "Free Shipping", titleAr: "نصائح متخصصة", desc: "Orders over $75", descAr: "من مدربين معتمدين", icon: "truck" },
      { title: "Expert Support", titleAr: "شحن سريع", desc: "Fitness advisors", descAr: "توصيل خلال 48 ساعة", icon: "headset" },
      { title: "Easy Exchanges", titleAr: "جودة عالية", desc: "60-day returns", descAr: "حصريا ماركات عالمية", icon: "refresh" },
      { title: "Member Deals", titleAr: "إرجاع سهل", desc: "Exclusive offers", descAr: "خلال 30 يوماً", icon: "tag" },
    ],
  },

  kids: {
    id: "kids", name: "Kids & Toys", nameAr: "الأطفال", description: "Educational toys, games, and essentials", icon: "🧸",
    layoutType: "playful", fontFamily: "var(--font-outfit), system-ui, sans-serif", borderRadius: "1.5rem",
    theme: {
      primary: "#7C3AED", primaryDark: "#6D28D9", primaryLight: "#D8B4FE", accent: "#EC4899",
      bg: "#FAF5FF", cardBg: "#FFFFFF", textColor: "#3A0A6A", mutedText: "#7A4AA0",
      border: "#E9D5FF", headerBg: "#3A0A6A", headerText: "#FFFFFF",
      footerBg: "#3A0A6A", footerText: "#D0B8F0", footerMuted: "#A080C0",
      heroGradient: "linear-gradient(135deg, #3A0A6A 0%, #6D28D9 50%, #3A0A6A 100%)", badge: "#7C3AED",
    },
    products: [
      { title: "STEM Robot Kit", titleAr: "روبوت تعليمي", description: "Build & program, 100+ pieces, ages 8+", price: 79, originalPrice: 99, category: "educational", image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400&q=80", badge: "POPULAR" },
      { title: "Wooden Building Blocks", titleAr: "مكعبات خشبية", description: "100 natural wood blocks, non-toxic", price: 39, category: "toys", image: "https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400&q=80" },
      { title: "Kids Tablet 10\"", titleAr: "تابلت أطفال", description: "Kid-proof case, parental controls", price: 149, category: "electronics", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80" },
      { title: "Plush Teddy Bear", titleAr: "دب ناعم", description: "Ultra-soft premium plush, 45cm", price: 29, category: "toys", image: "https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400&q=80" },
      { title: "Board Game Collection", titleAr: "ألعاب طاولة", description: "Strategy, puzzle, family — set of 5", price: 59, originalPrice: 75, category: "games", image: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400&q=80", badge: "-21%" },
      { title: "Kids Art Set", titleAr: "طقم فنون", description: "150 pieces: crayons, markers, paints", price: 45, category: "creative", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80" },
      { title: "RC Car", titleAr: "سيارة تحكم", description: "High-speed 4WD, rechargeable, 30km/h", price: 69, category: "toys", image: "https://images.unsplash.com/photo-1581235707260-92753a3c65fb?w=400&q=80" },
      { title: "Children's Books Set", titleAr: "كتب أطفال", description: "10 illustrated storybooks, ages 3-7", price: 35, category: "books", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80" },
    ],
    heroTag: "PLAY & LEARN", heroTitle: "Imagination\nUnlimited", heroDesc: "Toys and games that inspire creativity and learning",
    heroImages: ["https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1200&q=80", "https://images.unsplash.com/photo-1576444356170-66073cbf02dc?w=1200&q=80", "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80"],
    features: [
      { title: "Safe Materials", titleAr: "خامات آمنة", desc: "Non-toxic certified", descAr: "خالية من المواد الضارة", icon: "shield" },
      { title: "Free Gift Wrap", titleAr: "شحن مجاني", desc: "Birthday ready", descAr: "على الطلبات فوق 30$", icon: "gift" },
      { title: "Easy Returns", titleAr: "إرجاع سهل", desc: "60-day policy", descAr: "خلال 14 يوماً", icon: "refresh" },
      { title: "Kids Club", titleAr: "تغليف هدايا", desc: "Monthly surprises", descAr: "تغليف مجاني", icon: "star" },
    ],
  },

  books: {
    id: "books", name: "Books & Stationery", nameAr: "الكتب", description: "Bestselling books, journals, and stationery", icon: "📚",
    layoutType: "classic", fontFamily: "var(--font-cormorant), Georgia, serif", borderRadius: "0.375rem",
    theme: {
      primary: "#78350F", primaryDark: "#451A03", primaryLight: "#FCD34D", accent: "#0891B2",
      bg: "#FFFBEB", cardBg: "#FFFFFF", textColor: "#3A1A05", mutedText: "#8A6020",
      border: "#FDE68A", headerBg: "#3A1A05", headerText: "#FEF3C7",
      footerBg: "#3A1A05", footerText: "#F0D8A0", footerMuted: "#C0A050",
      heroGradient: "linear-gradient(135deg, #3A1A05 0%, #5C2A0A 50%, #3A1A05 100%)", badge: "#D97706",
    },
    products: [
      { title: "Atomic Habits", titleAr: "العادات الذرية", description: "James Clear — Build good habits", price: 16.99, category: "nonfiction", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80", badge: "BESTSELLER" },
      { title: "Leather Journal", titleAr: "دفتر جلدي", description: "Italian leather, 200 pages, lay-flat", price: 34, originalPrice: 45, category: "journals", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80", badge: "-24%" },
      { title: "Fountain Pen Set", titleAr: "أقلام حبر", description: "German-engineered, 3 nibs included", price: 89, category: "pens", image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&q=80" },
      { title: "The Art of Design", titleAr: "فن التصميم", description: "Coffee table book, 300 pages", price: 49, category: "art", image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&q=80" },
      { title: "Premium Notebook Set", titleAr: "دفاتر بريميوم", description: "3 notebooks, 120gsm, A5 size", price: 28, category: "notebooks", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&q=80" },
      { title: "Calligraphy Kit", titleAr: "طقم خط عربي", description: "6 pens, ink, practice sheets", price: 42, category: "calligraphy", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80" },
      { title: "World Atlas", titleAr: "أطلس العالم", description: "Large format, 200 maps, 2024", price: 39, category: "reference", image: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&q=80" },
      { title: "Desk Organizer", titleAr: "رُتب مكتب", description: "Bamboo wood, pen holder, letter tray", price: 55, category: "stationery", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80" },
    ],
    heroTag: "READ & CREATE", heroTitle: "Knowledge\nAwaits", heroDesc: "Discover bestselling books and premium stationery",
    heroImages: ["https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80", "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80", "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1200&q=80"],
    features: [
      { title: "Free Bookmark", titleAr: "علامة مجانية", desc: "With every book", descAr: "مع كل كتاب", icon: "tag" },
      { title: "Book Club", titleAr: "مجموعة مختارة", desc: "Monthly picks", descAr: "كتب منتقاة بعناية", icon: "star" },
      { title: "Gift Wrapping", titleAr: "تغليف هدايا", desc: "Paper & ribbon", descAr: "تغليف مجاني", icon: "gift" },
      { title: "Author Events", titleAr: "أدلة قراءة", desc: "Virtual signings", descAr: "ملخصات وتحليلات", icon: "users" },
    ],
  },

  jewelry: {
    id: "jewelry", name: "Jewelry & Watches", nameAr: "المجوارات", description: "Fine jewelry and luxury watches", icon: "💎",
    layoutType: "showcase", fontFamily: "var(--font-cormorant), Georgia, serif", borderRadius: "0rem",
    theme: {
      primary: "#D4A843", primaryDark: "#A57823", primaryLight: "#F0D060", accent: "#F5F5F5",
      bg: "#0E0E0E", cardBg: "#1A1A1A", textColor: "#F0E4C8", mutedText: "#9A8A6A",
      border: "#302A18", headerBg: "#0A0A0A", headerText: "#F0E4C8",
      footerBg: "#0A0A0A", footerText: "#C0A860", footerMuted: "#8A7A5A",
      heroGradient: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #0A0A0A 100%)", badge: "#D4A843",
    },
    products: [
      { title: "Diamond Solitaire Ring", titleAr: "خاتم الماسة", description: "1.5ct brilliant cut, VS1, 18K gold", price: 4999, category: "rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80", badge: "LUXURY" },
      { title: "Gold Chain Necklace", titleAr: "سلسلة ذهبية", description: "24K gold-plated, 20 inch", price: 189, originalPrice: 249, category: "necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80", badge: "-24%" },
      { title: "Luxury Watch", titleAr: "ساعة فاخرة", description: "Swiss automatic, sapphire crystal", price: 1299, category: "watches", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80" },
      { title: "Pearl Earrings", titleAr: "أقراط لؤلؤ", description: "Freshwater pearls, 14K gold posts", price: 129, category: "earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80" },
      { title: "Sapphire Bracelet", titleAr: "سوار ياقوت", description: "Blue sapphire, 18K gold, 7 inches", price: 2499, category: "bracelets", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80" },
      { title: "Men's Signet Ring", titleAr: "خاتم رجالي", description: "Sterling silver, onyx inlay", price: 149, category: "rings", image: "https://images.unsplash.com/photo-1590548784585-643d2b9f29c5?w=400&q=80" },
      { title: "Emerald Pendant", titleAr: "قلادة زمرد", description: "Colombian emerald, diamond halo", price: 3499, category: "necklaces", image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&q=80" },
      { title: "Chronograph Watch", titleAr: "ساعة كرونوغراف", description: "Titanium, ceramic bezel, Swiss quartz", price: 899, originalPrice: 1099, category: "watches", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&q=80", badge: "-18%" },
    ],
    heroTag: "FINE JEWELRY", heroTitle: "Eternal\nBrilliance", heroDesc: "Exquisite jewelry and timepieces",
    heroImages: ["https://images.unsplash.com/photo-1515562141589-67f0d569b986?w=1200&q=80", "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200&q=80", "https://images.unsplash.com/photo-1612817288687-0b97d8f4b379?w=1200&q=80"],
    features: [
      { title: "GIA Certified", titleAr: "جودة معتمدة", desc: "Authentic gems", descAr: "شهادات أصالة", icon: "shield" },
      { title: "Free Sizing", titleAr: "تغليف فاخر", desc: "Perfect fit", descAr: "تغليف هدايا مجاني", icon: "ruler" },
      { title: "Lifetime Warranty", titleAr: "ضمان مدى الحياة", desc: "Quality guaranteed", descAr: "ضمان دائم", icon: "star" },
      { title: "Luxury Box", titleAr: "شحن آمن", desc: "Premium packaging", descAr: "تأمين شامل", icon: "package" },
    ],
  },

  health: {
    id: "health", name: "Health & Wellness", nameAr: "الصحة", description: "Vitamins, supplements, and wellness", icon: "💊",
    layoutType: "minimal", fontFamily: "var(--font-manrope), system-ui, sans-serif", borderRadius: "0.75rem",
    theme: {
      primary: "#0891B2", primaryDark: "#0E7490", primaryLight: "#A5F3FC", accent: "#10B981",
      bg: "#F0FDFA", cardBg: "#FFFFFF", textColor: "#164E63", mutedText: "#3A8A9A",
      border: "#C8F0F0", headerBg: "#164E63", headerText: "#FFFFFF",
      footerBg: "#164E63", footerText: "#A0E8F0", footerMuted: "#60C0D0",
      heroGradient: "linear-gradient(135deg, #164E63 0%, #0E7490 50%, #164E63 100%)", badge: "#0891B2",
    },
    products: [
      { title: "Omega-3 Fish Oil", titleAr: "أوميغا 3", description: "1000mg EPA/DHA, 120 softgels", price: 29, category: "supplements", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80" },
      { title: "Multivitamin Complex", titleAr: "فيتامينات شاملة", description: "42 nutrients, 90 tablets", price: 39, originalPrice: 49, category: "vitamins", image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&q=80", badge: "-20%" },
      { title: "Protein Powder", titleAr: "بروتين", description: "Whey isolate, 25g/serving, 2.2kg", price: 59, category: "nutrition", image: "https://images.unsplash.com/photo-1622484211149-a6b80e5a1523?w=400&q=80" },
      { title: "Essential Oil Set", titleAr: "زيوت عطرية", description: "6 oils: lavender, peppermint, etc.", price: 34, category: "wellness", image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80" },
      { title: "BP Monitor", titleAr: "جهاز ضغط الدم", description: "FDA approved, Bluetooth, 120 readings", price: 69, category: "devices", image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&q=80" },
      { title: "Collagen Peptides", titleAr: "كولاجين", description: "Grass-fed, unflavored, 30 servings", price: 45, category: "supplements", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80" },
      { title: "Yoga Mat", titleAr: "سجادة يوغا", description: "6mm TPE, alignment lines", price: 55, category: "fitness", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80" },
      { title: "Sleep Aid", titleAr: "مكمل النوم", description: "Melatonin + magnesium, 60 caps", price: 24, category: "wellness", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&q=80" },
    ],
    heroTag: "WELLNESS", heroTitle: "Feel Your\nBest", heroDesc: "Premium vitamins, supplements, and health essentials",
    heroImages: ["https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=80", "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80", "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80"],
    features: [
      { title: "Lab Tested", titleAr: "مختبر ومعتمد", desc: "Third-party verified", descAr: "معايير جودة صارمة", icon: "shield" },
      { title: "Free Shipping", titleAr: "توصيل سريع", desc: "Orders over $50", descAr: "توصيل خلال 24 ساعة", icon: "truck" },
      { title: "Auto-Ship", titleAr: "دعم متخصص", desc: "Save 15% monthly", descAr: "استشارات صحية", icon: "refresh" },
      { title: "Expert Advice", titleAr: "رضا مضمون", desc: "Nutritionists online", descAr: "استرداد المال", icon: "headset" },
    ],
  },

  pets: {
    id: "pets", name: "Pet Supplies", nameAr: "الحيوانات", description: "Food, toys, and accessories for pets", icon: "🐾",
    layoutType: "friendly", fontFamily: "var(--font-dm-sans), system-ui, sans-serif", borderRadius: "1.25rem",
    theme: {
      primary: "#EA580C", primaryDark: "#C2410C", primaryLight: "#FDBA74", accent: "#16A34A",
      bg: "#FFF7ED", cardBg: "#FFFFFF", textColor: "#5A2A0A", mutedText: "#9A5A30",
      border: "#FED7AA", headerBg: "#5A2A0A", headerText: "#FFFFFF",
      footerBg: "#5A2A0A", footerText: "#F0C8A0", footerMuted: "#C09060",
      heroGradient: "linear-gradient(135deg, #5A2A0A 0%, #7C3A10 50%, #5A2A0A 100%)", badge: "#EA580C",
    },
    products: [
      { title: "Premium Dog Food", titleAr: "طعام كلاب", description: "Grain-free, real chicken, 12kg", price: 89, category: "food", image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&q=80" },
      { title: "Interactive Cat Toy", titleAr: "لعبة قطط", description: "Automatic laser, 3 speeds", price: 29, category: "toys", image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&q=80" },
      { title: "Orthopedic Dog Bed", titleAr: "سرير كلاب", description: "Memory foam, waterproof, washable", price: 79, originalPrice: 99, category: "beds", image: "https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=400&q=80", badge: "-20%" },
      { title: "Cat Scratching Post", titleAr: "عمود خدش", description: "Sisal-wrapped, 3-tier", price: 45, category: "accessories", image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&q=80" },
      { title: "Dog Leash Premium", titleAr: "مقود كلاب", description: "Reflective nylon, padded handle, 1.8m", price: 25, category: "accessories", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80" },
      { title: "Aquarium Filter Kit", titleAr: "فلتر حوض", description: "Up to 200L, quiet, 3-stage", price: 65, category: "aquarium", image: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=400&q=80" },
      { title: "Pet Carrier Bag", titleAr: "حقيبة نقل", description: "Airline-approved, mesh windows", price: 55, category: "travel", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80" },
      { title: "Cat Tree Tower", titleAr: "برج قطط", description: "180cm, 5 platforms, scratching posts", price: 129, category: "furniture", image: "https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?w=400&q=80" },
    ],
    heroTag: "FOR YOUR PETS", heroTitle: "Paws &\nPlay", heroDesc: "Everything your furry friends need and love",
    heroImages: ["https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1200&q=80", "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1200&q=80", "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=1200&q=80"],
    features: [
      { title: "Vet Approved", titleAr: "معتمد من الأطباء", desc: "Expert recommended", descAr: "منتجات موصى بها", icon: "shield" },
      { title: "Free Delivery", titleAr: "شحن مجاني", desc: "Orders over $50", descAr: "على الطلبات فوق 25$", icon: "truck" },
      { title: "Auto-Ship", titleAr: "مكونات عالية الجودة", desc: "Never run out", descAr: "طبيعية وآمنة", icon: "refresh" },
      { title: "Pet Insurance", titleAr: "إرجاع سهل", desc: "Coverage plans", descAr: "خلال 30 يوماً", icon: "star" },
    ],
  },

  automotive: {
    id: "automotive", name: "Automotive", nameAr: "السيارات", description: "Car parts, accessories, and maintenance", icon: "🚗",
    layoutType: "industrial", fontFamily: "var(--font-space-grotesk), system-ui, sans-serif", borderRadius: "0.25rem",
    theme: {
      primary: "#334155", primaryDark: "#1E293B", primaryLight: "#CBD5E1", accent: "#EAB308",
      bg: "#F8FAFC", cardBg: "#FFFFFF", textColor: "#0F172A", mutedText: "#5A6A80",
      border: "#D0D8E0", headerBg: "#0F172A", headerText: "#F8FAFC",
      footerBg: "#0F172A", footerText: "#B0C0D0", footerMuted: "#7088A0",
      heroGradient: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)", badge: "#475569",
    },
    products: [
      { title: "Performance Brake Pads", titleAr: "فرامل أداء", description: "Ceramic compound, low dust, front set", price: 89, category: "brakes", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80" },
      { title: "LED Headlight Kit", titleAr: "مصابيح LED", description: "6000K white, 12000 lumens, pair", price: 129, originalPrice: 159, category: "lighting", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80", badge: "-19%" },
      { title: "Car Seat Covers", titleAr: "غطية مقاعد", description: "Premium leather, universal fit, 4 pcs", price: 199, category: "interior", image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&q=80" },
      { title: "Dash Camera 4K", titleAr: "كاميرا لوحة", description: "4K front + 1080p rear, night vision", price: 179, category: "electronics", image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&q=80" },
      { title: "Car Vacuum", titleAr: "مكنسة سيارة", description: "12V, 12000PA, HEPA filter, 5m", price: 45, category: "cleaning", image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80" },
      { title: "Tire Pressure Monitor", titleAr: "مراقبة الإطارات", description: "4 sensors, solar, real-time", price: 69, category: "safety", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80" },
      { title: "Engine Oil Filter", titleAr: "فلتر زيت", description: "Premium synthetic, 10-pack", price: 49, category: "maintenance", image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&q=80" },
      { title: "Trunk Organizer", titleAr: "منظم صندوق", description: "Collapsible, waterproof, 3 compartments", price: 35, category: "accessories", image: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=400&q=80" },
    ],
    heroTag: "AUTO ESSENTIALS", heroTitle: "Drive\nBetter", heroDesc: "Premium parts and accessories for your vehicle",
    heroImages: ["https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&q=80", "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80", "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80"],
    features: [
      { title: "Fitment Guarantee", titleAr: "مستوى احترافي", desc: "Right part, every time", descAr: "قطع غيار أصلية", icon: "shield" },
      { title: "Free Installation", titleAr: "تركيب متخصص", desc: "Select items", descAr: "خدمة تركيب متاحة", icon: "tools" },
      { title: "60-Day Returns", titleAr: "شحن سريع", desc: "No questions asked", descAr: "توصيل سريع", icon: "refresh" },
      { title: "Expert Advice", titleAr: "ضمان مشمول", desc: "Mechanics online", descAr: "ضمان شامل", icon: "headset" },
    ],
  },
};

export const CATEGORY_LIST = Object.values(STORE_CATEGORIES);
export const CATEGORY_IDS = Object.keys(STORE_CATEGORIES);
