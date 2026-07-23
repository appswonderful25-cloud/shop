"use client";

import { useStore, CATEGORY_IMAGES, type Product } from "../../StoreContext";
import { useLanguage } from "../../LanguageContext";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";

function getProductImage(p: { title?: string; titleAr?: string; productCategory?: string; image?: { url: string } | null }) {
  if (p.image?.url) {
    const u = p.image.url;
    return u.startsWith("http") ? u : `http://localhost:1337${u}`;
  }
  const cat = (p.productCategory || "").toLowerCase().replace(/[^a-z]/g, "");
  if (CATEGORY_IMAGES[cat]) return CATEGORY_IMAGES[cat];
  if (CATEGORY_IMAGES[p.productCategory || ""]) return CATEGORY_IMAGES[p.productCategory || ""];
  return CATEGORY_IMAGES.general;
}

const VARIANT_MAP: Record<string, { label: string; options: string[] }[]> = {
  clothing: [{ label: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] }, { label: "Color", options: ["Black", "White", "Navy", "Gray", "Beige"] }],
  shoes: [{ label: "Size", options: ["38", "39", "40", "41", "42", "43", "44", "45"] }, { label: "Color", options: ["Black", "White", "Red", "Blue"] }],
  electronics: [{ label: "Storage", options: ["64GB", "128GB", "256GB", "512GB", "1TB"] }, { label: "Color", options: ["Black", "Silver", "White"] }],
  accessories: [{ label: "Color", options: ["Black", "Brown", "Gold", "Silver"] }],
  food: [{ label: "Size", options: ["Small", "Medium", "Large"] }],
  skincare: [{ label: "Size", options: ["30ml", "50ml", "100ml"] }],
  makeup: [{ label: "Shade", options: ["Light", "Medium", "Dark", "Universal"] }],
  general: [{ label: "Variant", options: ["Standard", "Premium"] }],
};

const PRODUCT_SPECS: Record<string, { label: string; value: string }[]> = {
  electronics: [
    { label: "Brand", value: "Premium Quality" }, { label: "Warranty", value: "12 Months" },
    { label: "Weight", value: "0.5 kg" }, { label: "Dimensions", value: "20 x 15 x 5 cm" },
    { label: "Material", value: "Aluminum & Glass" }, { label: "Origin", value: "International" },
  ],
  clothing: [
    { label: "Fabric", value: "100% Premium Cotton" }, { label: "Care", value: "Machine Washable" },
    { label: "Weight", value: "0.3 kg" }, { label: "Origin", value: "Ethically Made" },
  ],
  default: [
    { label: "Weight", value: "0.5 kg" }, { label: "Dimensions", value: "25 x 20 x 10 cm" },
    { label: "Material", value: "Premium Quality" }, { label: "Origin", value: "International" },
    { label: "Warranty", value: "30-Day Guarantee" },
  ],
};

function RelatedProductCard({ product, theme }: { product: Product; theme: any }) {
  const { locale } = useLanguage();
  const [loaded, setLoaded] = useState(false);
  const img = getProductImage(product);
  const br = theme.borderRadius;
  const displayTitle = locale === "ar" && product.titleAr ? product.titleAr : product.title;
  const displayCategory = locale === "ar" && product.productCategoryAr ? product.productCategoryAr : product.productCategory;
  return (
    <Link href={`/store/product/${product.id}`} className="group block">
      <div className="rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
        style={{ background: theme.cardBg, borderColor: theme.border, borderRadius: br }}>
        <div className="relative h-40 overflow-hidden" style={{ background: `${theme.globalColor}08` }}>
          <img src={img} alt={displayTitle} onLoad={() => setLoaded(true)}
            onError={(e) => { (e.target as HTMLImageElement).src = CATEGORY_IMAGES.general; setLoaded(true); }}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${loaded ? "opacity-100" : "opacity-0"}`} />
        </div>
        <div className="p-3">
          <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: theme.globalColor }}>{displayCategory}</p>
          <h4 className="text-xs font-bold mt-0.5 line-clamp-1" style={{ color: theme.textColor }}>{displayTitle}</h4>
          <p className="text-sm font-black mt-1" style={{ color: theme.globalColor }}>${product.price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
}

export default function ProductDetailPage() {
  const { settings, theme, products, addToCart, toggleWishlist, isWishlisted } = useStore();
  const { locale } = useLanguage();
  const params = useParams();
  const productId = Number(params.id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | "payment">("details");
  const [addedToCart, setAddedToCart] = useState(false);
  const br = theme.borderRadius;

  const product = useMemo(() => products.find(p => p.id === productId), [products, productId]);
  const displayTitle = locale === "ar" && product?.titleAr ? product.titleAr : product?.title;
  const displayCategory = locale === "ar" && product?.productCategoryAr ? product.productCategoryAr : product?.productCategory;
  const displayDescription = locale === "ar" && product?.descriptionAr ? product.descriptionAr : product?.description;
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter(p => p.id !== product.id && p.productCategory === product.productCategory).slice(0, 6);
  }, [products, product]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: `${theme.globalColor}15`, borderRadius: br }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.textColor }}>Product Not Found</h2>
        <p className="text-sm mb-6" style={{ color: theme.mutedText }}>This product may have been removed or doesn&apos;t exist.</p>
        <Link href="/store" className="inline-block px-6 py-3 text-sm font-bold text-white rounded-xl" style={{ background: theme.globalColor }}>Browse Products</Link>
      </div>
    );
  }

  const imgSrc = getProductImage(product);
  const isOut = product.statusProduct === "out_of_stack";
  const isDiscounted = product.price > 20 && product.count > 5;
  const variants = VARIANT_MAP[product.productCategory] || VARIANT_MAP.general;
  const specs = PRODUCT_SPECS[product.productCategory] || PRODUCT_SPECS.default;
  const shippingCost = settings.shippingCost || 0;
  const taxPct = settings.taxPercentage || 0;
  const tax = product.price * (taxPct / 100);
  const totalWithTax = product.price + tax;
  const wishlistActive = isWishlisted(product.id);

  const handleAddToCart = () => {
    if (addedToCart || isOut) return;
    addToCart(product, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const allImages = [imgSrc, imgSrc, imgSrc, imgSrc];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs mb-6 flex-wrap" style={{ color: theme.mutedText }}>
        <Link href="/store" className="hover:underline" style={{ color: theme.globalColor }}>Home</Link>
        <span>/</span>
        <Link href="/store" className="hover:underline" style={{ color: theme.globalColor }}>Shop</Link>
        <span>/</span>
        <span style={{ color: theme.textColor }} className="font-medium">{displayTitle}</span>
      </nav>

      {/* Product Main */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-16">
        {/* Images */}
        <div>
          <div className="relative rounded-2xl overflow-hidden mb-3 aspect-square" style={{ background: `${theme.globalColor}06`, borderRadius: br }}>
            <img src={allImages[selectedImage]} alt={displayTitle || ""} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isDiscounted && <span className="px-3 py-1 text-xs font-bold text-white rounded-lg" style={{ background: "#EF4444" }}>-20% OFF</span>}
              {product.statusProduct === "active" && <span className="px-3 py-1 text-xs font-bold text-white rounded-lg" style={{ background: theme.globalColor }}>In Stock</span>}
              {isOut && <span className="px-3 py-1 text-xs font-bold text-white rounded-lg bg-gray-500">Sold Out</span>}
            </div>
            <button onClick={() => toggleWishlist(product.id)}
              className="absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              style={{ background: wishlistActive ? "#EF4444" : "rgba(255,255,255,0.9)", borderRadius: "50%" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill={wishlistActive ? "white" : "none"} stroke={wishlistActive ? "white" : "#EF4444"} strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {allImages.map((img, i) => (
              <button key={i} onClick={() => setSelectedImage(i)}
                className="aspect-square rounded-xl overflow-hidden border-2 transition-all"
                style={{ borderColor: selectedImage === i ? theme.globalColor : theme.border, borderRadius: br, opacity: selectedImage === i ? 1 : 0.6 }}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: theme.globalColor }}>{displayCategory}</p>
          <h1 className="text-2xl md:text-3xl font-black mb-3" style={{ color: theme.textColor }}>{displayTitle}</h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(s => (
                <svg key={s} width="16" height="16" viewBox="0 0 24 24" fill={s <= 4 ? theme.globalColor : "none"} stroke={theme.globalColor} strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              ))}
              <span className="text-xs ml-1" style={{ color: theme.mutedText }}>(4.0)</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: isOut ? "#F3F4F6" : `${theme.globalColor}15`, color: isOut ? "#9CA3AF" : theme.globalColor }}>
              {isOut ? "Out of Stock" : `${product.count} in stock`}
            </span>
          </div>

          <p className="text-sm leading-relaxed mb-6" style={{ color: theme.mutedText }}>{displayDescription}</p>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-black" style={{ color: theme.globalColor }}>${product.price.toFixed(2)}</span>
            {isDiscounted && <span className="text-lg line-through" style={{ color: theme.mutedText }}>${(product.price * 1.25).toFixed(2)}</span>}
            {isDiscounted && <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white bg-red-500">SAVE ${(product.price * 0.25).toFixed(2)}</span>}
          </div>

          {/* Variants */}
          <div className="space-y-4 mb-6">
            {variants.map(v => (
              <div key={v.label}>
                <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: theme.textColor }}>{v.label}: <span style={{ color: theme.globalColor }}>{selectedVariants[v.label] || v.options[0]}</span></p>
                <div className="flex flex-wrap gap-2">
                  {v.options.map(opt => (
                    <button key={opt} onClick={() => setSelectedVariants(prev => ({ ...prev, [v.label]: opt }))}
                      className="px-4 py-2 text-xs font-semibold border transition-all"
                      style={{
                        borderRadius: br,
                        borderColor: (selectedVariants[v.label] || v.options[0]) === opt ? theme.globalColor : theme.border,
                        background: (selectedVariants[v.label] || v.options[0]) === opt ? theme.globalColor : "transparent",
                        color: (selectedVariants[v.label] || v.options[0]) === opt ? "white" : theme.textColor,
                      }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border" style={{ borderColor: theme.border, borderRadius: br }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-sm font-bold" style={{ color: theme.textColor }}>-</button>
              <span className="w-10 h-10 flex items-center justify-center text-sm font-bold border-x" style={{ borderColor: theme.border, color: theme.textColor }}>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.count, q + 1))} className="w-10 h-10 flex items-center justify-center text-sm font-bold" style={{ color: theme.textColor }}>+</button>
            </div>
            <button onClick={handleAddToCart} disabled={isOut}
              className="flex-1 py-3.5 text-sm font-bold text-white transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01]"
              style={{ borderRadius: br, background: addedToCart ? "#22C55E" : isOut ? "#9CA3AF" : `linear-gradient(135deg, ${theme.globalColor}, ${theme.accentColor})` }}>
              {addedToCart ? "Added to Cart!" : isOut ? "Sold Out" : `Add to Cart — $${(product.price * quantity).toFixed(2)}`}
            </button>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8l4 2.5V16h-2"/></svg>, label: shippingCost === 0 ? "Free Shipping" : `Shipping $${shippingCost}`, sub: "On orders over $50" },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 105.64-8.36L1 10"/></svg>, label: "30-Day Returns", sub: "Easy refund policy" },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>, label: "Secure Payment", sub: "100% protected" },
              { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>, label: "24/7 Support", sub: "Always here to help" },
            ].map((info, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 border" style={{ borderColor: theme.border, borderRadius: br }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg shrink-0" style={{ background: `${theme.globalColor}10`, color: theme.globalColor }}>{info.icon}</div>
                <div>
                  <p className="text-[11px] font-bold" style={{ color: theme.textColor }}>{info.label}</p>
                  <p className="text-[10px]" style={{ color: theme.mutedText }}>{info.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Details / Shipping / Payment */}
      <div className="mb-16">
        <div className="flex gap-1 border-b mb-6" style={{ borderColor: theme.border }}>
          {([
            { key: "details" as const, label: "Product Details" },
            { key: "shipping" as const, label: "Shipping Info" },
            { key: "payment" as const, label: "Payment Methods" },
          ]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="px-5 py-3 text-sm font-bold border-b-2 transition-all -mb-px"
              style={{
                borderColor: activeTab === tab.key ? theme.globalColor : "transparent",
                color: activeTab === tab.key ? theme.globalColor : theme.mutedText,
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "details" && (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: theme.textColor }}>Specifications</h3>
              <div className="space-y-0">
                {specs.map((spec, i) => (
                  <div key={i} className="flex justify-between py-3 border-b" style={{ borderColor: theme.border }}>
                    <span className="text-sm" style={{ color: theme.mutedText }}>{spec.label}</span>
                    <span className="text-sm font-semibold" style={{ color: theme.textColor }}>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: theme.textColor }}>Description</h3>
              <p className="text-sm leading-relaxed" style={{ color: theme.mutedText }}>{displayDescription}</p>
              <div className="mt-6 p-4 border" style={{ borderColor: theme.border, borderRadius: br, background: `${theme.globalColor}05` }}>
                <p className="text-xs font-bold mb-1" style={{ color: theme.textColor }}>Sku: {`SKU-${String(product.id).padStart(6, "0")}`}</p>
                <p className="text-xs" style={{ color: theme.mutedText }}>Category: {product.productCategory}</p>
                <p className="text-xs" style={{ color: theme.mutedText }}>Availability: {isOut ? "Out of Stock" : "In Stock"}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="max-w-2xl space-y-6">
            <div className="p-5 border" style={{ borderColor: theme.border, borderRadius: br }}>
              <h4 className="font-bold text-sm mb-2" style={{ color: theme.textColor }}>Standard Shipping</h4>
              <p className="text-sm" style={{ color: theme.mutedText }}>3-7 business days — {shippingCost === 0 ? "FREE" : `$${shippingCost}`}</p>
            </div>
            <div className="p-5 border" style={{ borderColor: theme.border, borderRadius: br }}>
              <h4 className="font-bold text-sm mb-2" style={{ color: theme.textColor }}>Express Shipping</h4>
              <p className="text-sm" style={{ color: theme.mutedText }}>1-2 business days — ${(shippingCost * 2.5 || 15).toFixed(2)}</p>
            </div>
            <div className="p-5 border" style={{ borderColor: theme.border, borderRadius: br }}>
              <h4 className="font-bold text-sm mb-2" style={{ color: theme.textColor }}>Free Shipping</h4>
              <p className="text-sm" style={{ color: theme.mutedText }}>Available on orders over $50</p>
            </div>
            <div className="p-5 border" style={{ borderColor: theme.border, borderRadius: br, background: `${theme.globalColor}05` }}>
              <h4 className="font-bold text-sm mb-2" style={{ color: theme.textColor }}>Tax Information</h4>
              <p className="text-sm" style={{ color: theme.mutedText }}>
                {taxPct > 0 ? `Tax: ${taxPct}% (${taxPct}% = $${tax.toFixed(2)} on this product)` : "No additional tax applied"}
              </p>
              <p className="text-sm mt-1 font-semibold" style={{ color: theme.textColor }}>
                Total with tax: ${totalWithTax.toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {activeTab === "payment" && (
          <div className="max-w-2xl space-y-4">
            {settings.acceptCard && (
              <div className="flex items-center gap-4 p-5 border" style={{ borderColor: theme.border, borderRadius: br }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${theme.globalColor}10` }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: theme.textColor }}>Credit / Debit Card</h4>
                  <p className="text-xs" style={{ color: theme.mutedText }}>Visa, Mastercard, AMEX accepted</p>
                </div>
              </div>
            )}
            {settings.acceptPaypal && (
              <div className="flex items-center gap-4 p-5 border" style={{ borderColor: theme.border, borderRadius: br }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${theme.globalColor}10` }}>
                  <span className="text-lg font-bold" style={{ color: theme.globalColor }}>P</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: theme.textColor }}>PayPal</h4>
                  <p className="text-xs" style={{ color: theme.mutedText }}>Pay securely with your PayPal account</p>
                </div>
              </div>
            )}
            {settings.acceptCOD && (
              <div className="flex items-center gap-4 p-5 border" style={{ borderColor: theme.border, borderRadius: br }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${theme.globalColor}10` }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: theme.textColor }}>Cash on Delivery</h4>
                  <p className="text-xs" style={{ color: theme.mutedText }}>Pay when you receive your order</p>
                </div>
              </div>
            )}
            {!settings.acceptCard && !settings.acceptPaypal && !settings.acceptCOD && (
              <div className="flex items-center gap-4 p-5 border" style={{ borderColor: theme.border, borderRadius: br }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${theme.globalColor}10` }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={theme.globalColor} strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: theme.textColor }}>Credit / Debit Card</h4>
                  <p className="text-xs" style={{ color: theme.mutedText }}>Visa, Mastercard accepted</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black" style={{ color: theme.textColor }}>Related Products</h2>
            <Link href="/store" className="text-xs font-bold hover:underline" style={{ color: theme.globalColor }}>View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {relatedProducts.map(p => (
              <RelatedProductCard key={p.id} product={p} theme={theme} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
