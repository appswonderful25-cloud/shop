import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL?.replace("/api", "") || "http://localhost:1337";

const TOOLS = [
  {
    type: "function" as const,
    function: {
      name: "get_store_stats",
      description: "Get store overview statistics: total products, orders, revenue, returns, wallet balance",
      parameters: { type: "object" as const, properties: {}, required: [] },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "list_products",
      description: "List all products in the store with their details",
      parameters: {
        type: "object" as const,
        properties: {
          limit: { type: "number" as const, description: "Max products to return (default 20)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_product",
      description: "Create a new product in the store",
      parameters: {
        type: "object" as const,
        properties: {
          title: { type: "string" as const, description: "Product name" },
          description: { type: "string" as const, description: "Product description" },
          price: { type: "number" as const, description: "Product price" },
          count: { type: "number" as const, description: "Stock quantity" },
          productCategory: { type: "string" as const, description: "Product category" },
          statusProduct: { type: "string" as const, description: "Status: active, draft, out_of_stack" },
        },
        required: ["title", "description", "price", "count", "productCategory"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "list_orders",
      description: "List recent orders",
      parameters: {
        type: "object" as const,
        properties: {
          limit: { type: "number" as const, description: "Max orders to return (default 10)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "reply_to_message",
      description: "Reply to a customer message/conversation",
      parameters: {
        type: "object" as const,
        properties: {
          conversation_id: { type: "string" as const, description: "The conversation document ID" },
          message: { type: "string" as const, description: "The reply message text" },
        },
        required: ["conversation_id", "message"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "list_messages",
      description: "List recent customer messages/conversations",
      parameters: {
        type: "object" as const,
        properties: {
          limit: { type: "number" as const, description: "Max conversations to return (default 10)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "generate_marketing",
      description: "Generate marketing content for a product or the store. Returns suggested text for social media, email campaigns, or ads.",
      parameters: {
        type: "object" as const,
        properties: {
          product_name: { type: "string" as const, description: "Product name to market (or 'store' for general)" },
          platform: { type: "string" as const, description: "Platform: instagram, facebook, email, twitter, tiktok" },
          tone: { type: "string" as const, description: "Tone: professional, casual, fun, urgent, luxury" },
        },
        required: ["product_name", "platform"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "suggest_theme",
      description: "Suggest a store theme/design based on store type and preferences",
      parameters: {
        type: "object" as const,
        properties: {
          store_type: { type: "string" as const, description: "Type of store: fashion, electronics, food, beauty, general" },
          style: { type: "string" as const, description: "Preferred style: modern, minimal, luxury, playful, professional" },
          colors: { type: "string" as const, description: "Preferred color scheme (e.g., 'blue and white', 'dark mode')" },
        },
        required: ["store_type"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "adjust_pricing",
      description: "Analyze and suggest pricing adjustments for products based on market data",
      parameters: {
        type: "object" as const,
        properties: {
          strategy: { type: "string" as const, description: "Strategy: increase_margin, competitive, discount, bundle" },
          product_id: { type: "string" as const, description: "Specific product ID (optional, applies to all if empty)" },
        },
        required: ["strategy"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "list_returns",
      description: "List recent return requests",
      parameters: {
        type: "object" as const,
        properties: {
          limit: { type: "number" as const, description: "Max returns to return (default 10)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_wallet_info",
      description: "Get wallet balance and payout history",
      parameters: { type: "object" as const, properties: {}, required: [] },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_coupon",
      description: "Create a discount coupon",
      parameters: {
        type: "object" as const,
        properties: {
          code: { type: "string" as const, description: "Coupon code (e.g., SUMMER20)" },
          discount: { type: "number" as const, description: "Discount percentage (e.g., 20 for 20%)" },
          description: { type: "string" as const, description: "Coupon description" },
        },
        required: ["code", "discount"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_store_settings",
      description: "Get current store settings: name, description, colors, logo, currency, etc.",
      parameters: { type: "object" as const, properties: {}, required: [] },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_store_colors",
      description: "Change the store colors: global (main), header, footer. Provide hex colors like #FF5733",
      parameters: {
        type: "object" as const,
        properties: {
          globalColor: { type: "string" as const, description: "Main/global theme color (hex, e.g. #6366F1)" },
          headerColor: { type: "string" as const, description: "Header background color (hex)" },
          footerColor: { type: "string" as const, description: "Footer background color (hex)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_store_info",
      description: "Update store name, description, currency, language, email, phone, address, or SEO settings",
      parameters: {
        type: "object" as const,
        properties: {
          nameStore: { type: "string" as const, description: "Store name" },
          descriptionStore: { type: "string" as const, description: "Store description" },
          currency: { type: "string" as const, description: "Currency code (USD, EUR, SAR, AED, JOD)" },
          language: { type: "string" as const, description: "Language code (en, ar)" },
          emailStore: { type: "string" as const, description: "Store email" },
          phoneStore: { type: "string" as const, description: "Store phone" },
          addressStore: { type: "string" as const, description: "Store address" },
          seoTitle: { type: "string" as const, description: "SEO page title" },
          seoDescription: { type: "string" as const, description: "SEO meta description" },
          seoKeywords: { type: "string" as const, description: "SEO keywords (comma separated)" },
          taxPercentage: { type: "number" as const, description: "Tax percentage" },
          shippingCost: { type: "number" as const, description: "Shipping cost" },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "apply_theme",
      description: "Apply a complete theme to the store. Sets colors, name, description, and SEO in one action based on the store type",
      parameters: {
        type: "object" as const,
        properties: {
          theme_name: { type: "string" as const, description: "Theme name: aurora, noir, neonCyber, ocean, forest, rose, luxury, mint, sunset, stone, electric, blush, slate, volcanic, cream" },
          store_name: { type: "string" as const, description: "New store name (optional)" },
          store_description: { type: "string" as const, description: "New store description (optional)" },
        },
        required: ["theme_name"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_seo",
      description: "Update SEO settings for the store",
      parameters: {
        type: "object" as const,
        properties: {
          title: { type: "string" as const, description: "SEO page title" },
          description: { type: "string" as const, description: "SEO meta description" },
          keywords: { type: "string" as const, description: "SEO keywords (comma separated)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_social_links",
      description: "Update social media links for the store",
      parameters: {
        type: "object" as const,
        properties: {
          facebook: { type: "string" as const, description: "Facebook URL" },
          instagram: { type: "string" as const, description: "Instagram URL" },
          twitter: { type: "string" as const, description: "Twitter/X URL" },
          tiktok: { type: "string" as const, description: "TikTok URL" },
          linkedin: { type: "string" as const, description: "LinkedIn URL" },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_store_policies",
      description: "Update store policy pages: privacy policy, terms, support, shipping, about, contact, FAQ, tracking",
      parameters: {
        type: "object" as const,
        properties: {
          policy: { type: "string" as const, description: "Privacy policy content or URL" },
          terms: { type: "string" as const, description: "Terms & conditions content or URL" },
          support: { type: "string" as const, description: "Support page content or URL" },
          shipping_returns: { type: "string" as const, description: "Shipping & returns policy content or URL" },
          about: { type: "string" as const, description: "About us page content or URL" },
          contact: { type: "string" as const, description: "Contact page content or URL" },
          faq: { type: "string" as const, description: "FAQ page content or URL" },
          tracking: { type: "string" as const, description: "Order tracking page URL" },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_payment_and_taxes",
      description: "Update payment methods (COD, Card, PayPal) and tax/shipping settings",
      parameters: {
        type: "object" as const,
        properties: {
          acceptCOD: { type: "boolean" as const, description: "Accept Cash on Delivery" },
          acceptCard: { type: "boolean" as const, description: "Accept credit/debit cards" },
          acceptPaypal: { type: "boolean" as const, description: "Accept PayPal" },
          taxPercentage: { type: "number" as const, description: "Tax percentage (e.g. 15 for 15%)" },
          shippingCost: { type: "number" as const, description: "Default shipping cost" },
          taxNumber: { type: "string" as const, description: "Tax registration number" },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_tracking_pixels",
      description: "Update analytics/tracking pixel IDs for Facebook, TikTok, Google Analytics",
      parameters: {
        type: "object" as const,
        properties: {
          facebookPixelId: { type: "string" as const, description: "Facebook Pixel ID" },
          tiktokPixelId: { type: "string" as const, description: "TikTok Pixel ID" },
          googleAnalyticsId: { type: "string" as const, description: "Google Analytics ID (G-XXXXXXX)" },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_store_images",
      description: "Update store images: logo URL, hero image URL, favicon URL",
      parameters: {
        type: "object" as const,
        properties: {
          logo: { type: "string" as const, description: "Logo image URL" },
          heroImage: { type: "string" as const, description: "Hero/banner image URL" },
          favicon: { type: "string" as const, description: "Favicon image URL" },
        },
        required: [],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "update_header_menu",
      description: "Update the store header navigation menu items",
      parameters: {
        type: "object" as const,
        properties: {
          items: {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                label: { type: "string" as const, description: "Menu item label" },
                url: { type: "string" as const, description: "Menu item URL" },
              },
            },
            description: "Array of menu items",
          },
        },
        required: ["items"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "toggle_maintenance",
      description: "Turn maintenance mode on or off",
      parameters: {
        type: "object" as const,
        properties: {
          enabled: { type: "boolean" as const, description: "true to enable, false to disable" },
        },
        required: ["enabled"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "build_my_store",
      description: "Build/design a complete store in one action. Sets theme, name, description, colors, SEO, payment, policies, and menu. This is the ONE-CLICK store builder.",
      parameters: {
        type: "object" as const,
        properties: {
          theme: { type: "string" as const, description: "Theme: aurora, noir, neonCyber, ocean, forest, rose, luxury, mint, sunset, stone, electric, blush, slate, volcanic, cream" },
          store_name: { type: "string" as const, description: "Store name" },
          store_description: { type: "string" as const, description: "Store description/slogan" },
          store_type: { type: "string" as const, description: "Store type: fashion, electronics, food, beauty, general, luxury, sports, home" },
          language: { type: "string" as const, description: "Language: en, ar" },
          currency: { type: "string" as const, description: "Currency: USD, EUR, SAR, AED, JOD" },
          enable_cod: { type: "boolean" as const, description: "Enable Cash on Delivery" },
          enable_card: { type: "boolean" as const, description: "Enable card payments" },
          enable_paypal: { type: "boolean" as const, description: "Enable PayPal" },
          tax_percent: { type: "number" as const, description: "Tax percentage" },
          shipping_cost: { type: "number" as const, description: "Shipping cost" },
        },
        required: ["theme", "store_name"],
      },
    },
  },
];

const SYSTEM_PROMPT = `You are ShopShop AI, an intelligent e-commerce assistant. You can CONTROL the entire store.

FULL capabilities — you can DO all of these, not just suggest:
- **Products**: List, create, analyze products
- **Orders**: View and analyze orders
- **Messages**: Read and reply to customer messages
- **Marketing**: Generate marketing content
- **Theme & Colors**: CHANGE store colors and apply themes (12 presets)
- **Store Info**: UPDATE name, description, currency, language, contact info
- **Store Images**: UPDATE logo, hero image, favicon
- **Header Menu**: UPDATE navigation menu items
- **SEO**: UPDATE title, description, keywords
- **Social Links**: UPDATE Facebook, Instagram, Twitter, TikTok, LinkedIn
- **Policies**: UPDATE privacy, terms, shipping, about, contact, FAQ
- **Payments**: ENABLE/DISABLE COD, Card, PayPal
- **Taxes**: SET tax percentage, shipping cost, tax number
- **Tracking**: SET Facebook Pixel, TikTok Pixel, Google Analytics
- **Maintenance Mode**: TURN ON/OFF maintenance mode
- **BUILD MY STORE**: ONE-CLICK complete store setup with theme, name, colors, menu, SEO, payments

When the merchant asks you to change something, USE THE TOOL to actually do it. Don't just suggest — ACT.

Theme presets: aurora, noir, neonCyber, ocean, forest, rose, luxury, mint, sunset, stone, electric, blush, slate, volcanic, cream

IMPORTANT: When merchant says "صمملي متجر" or "build me a store" or "design my store", use build_my_store tool with ALL the info they gave you. If they didn't specify details, ask for: store name, type, preferred style/colors.

Respond in the same language the merchant uses (Arabic or English).
Be concise but thorough.`;

async function executeTool(name: string, args: Record<string, unknown>, sessionToken: string = "") {
  const strapiGet = async (path: string) => {
    const res = await fetch(`${STRAPI_BASE}${path}`);
    if (!res.ok) return { error: `API error: ${res.status}` };
    return res.json();
  };

  const strapiPost = async (path: string, data: Record<string, unknown>) => {
    const res = await fetch(`${STRAPI_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
    if (!res.ok) {
      const err = await res.text();
      return { error: `API error: ${res.status}: ${err}` };
    }
    return res.json();
  };

  const strapiPut = async (path: string, data: Record<string, unknown>) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (sessionToken) headers["Authorization"] = `Bearer ${sessionToken}`;
    const res = await fetch(`${STRAPI_BASE}${path}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.text();
      return { error: `API error: ${res.status}: ${err}` };
    }
    return res.json();
  };

  const strapiGetAuth = async (path: string) => {
    const headers: Record<string, string> = {};
    if (sessionToken) headers["Authorization"] = `Bearer ${sessionToken}`;
    const res = await fetch(`${STRAPI_BASE}${path}`, { headers });
    if (!res.ok) return { error: `API error: ${res.status}` };
    return res.json();
  };

  try {
    // Track AI earnings for impactful actions
    const trackEarning = async (action: string, description: string, impact: string, estimatedValue: number, metadata: Record<string, unknown> = {}) => {
      try {
        await fetch(`${STRAPI_BASE}/api/ai-earnings`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: { action, description, impact, estimatedValue, actualValue: 0, metadata },
          }),
        });
      } catch { /* ignore tracking errors */ }
    };

    switch (name) {
      case "get_store_stats": {
        const [products, orders, wallets, returns_] = await Promise.all([
          strapiGet("/api/products"),
          strapiGet("/api/orders"),
          strapiGet("/api/wallets"),
          strapiGet("/api/returns"),
        ]);
        const productCount = products?.data?.length || 0;
        const orderCount = orders?.data?.length || 0;
        const totalRevenue = orders?.data?.reduce((sum: number, o: Record<string, unknown>) => {
          const items = (o.orderItems as Array<Record<string, unknown>> | undefined) || [];
          return sum + items.reduce((s: number, i: Record<string, unknown>) => s + ((i.price as number) || 0) * ((i.quantity as number) || 0), 0);
        }, 0) || 0;
        const wallet = wallets?.data?.[0];
        const returnCount = returns_?.data?.length || 0;
        return {
          products: productCount,
          orders: orderCount,
          totalRevenue: totalRevenue.toFixed(2),
          walletBalance: wallet?.currentBalance || 0,
          returns: returnCount,
          pendingReturns: returns_?.data?.filter((r: Record<string, unknown>) => r.statusReturn === "pending").length || 0,
        };
      }
      case "list_products": {
        const limit = (args.limit as number) || 20;
        const res = await strapiGet(`/api/products?pagination[pageSize]=${limit}`);
        return (res?.data || []).map((p: Record<string, unknown>) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          count: p.count,
          category: p.productCategory,
          status: p.statusProduct,
        }));
      }
      case "create_product": {
        const result = await strapiPost("/api/products", {
          title: args.title,
          description: args.description,
          price: args.price,
          count: args.count,
          productCategory: args.productCategory,
          statusProduct: args.statusProduct || "active",
          dateProduct: new Date().toISOString().split("T")[0],
        });
        if (result?.data) {
          await trackEarning(
            "product_created",
            `Created product: ${args.title} ($${args.price})`,
            "positive",
            (args.price as number) * 0.1, // estimated 10% margin
            { productId: result.data.id, title: args.title, price: args.price }
          );
        }
        return result?.data
          ? { success: true, product: { id: result.data.id, title: result.data.title, price: result.data.price } }
          : result;
      }
      case "list_orders": {
        const limit = (args.limit as number) || 10;
        const res = await strapiGet(`/api/orders?pagination[pageSize]=${limit}&sort=createdAt:desc`);
        return (res?.data || []).map((o: Record<string, unknown>) => ({
          id: o.id,
          customer: o.customerName,
          status: o.statusOrder,
          total: (o.orderItems as Array<Record<string, unknown>> | undefined)?.reduce((s: number, i: Record<string, unknown>) => s + ((i.price as number) || 0) * ((i.quantity as number) || 0), 0) || 0,
          date: o.dateOrder,
        }));
      }
      case "reply_to_message": {
        const result = await strapiPost("/api/messages-conversations", {
          userMessage: args.message,
          conversationId: args.conversation_id,
          sender: "merchant",
        });
        if (result?.data) {
          await trackEarning(
            "message_replied",
            `Replied to customer message`,
            "positive",
            2, // estimated $2 value per customer reply
            { conversationId: args.conversation_id }
          );
        }
        return result?.data
          ? { success: true, reply: result.data }
          : result;
      }
      case "list_messages": {
        const limit = (args.limit as number) || 10;
        const res = await strapiGet(`/api/messages-conversations?pagination[pageSize]=${limit}&sort=createdAt:desc`);
        return (res?.data || []).map((m: Record<string, unknown>) => ({
          id: m.id,
          subject: m.subject,
          lastMessage: m.userMessage,
          date: m.createdAt,
        }));
      }
      case "generate_marketing": {
        // Marketing content is generated by the AI itself, we just return a prompt
        return { note: "Marketing content generation handled by AI model directly" };
      }
      case "suggest_theme": {
        return { note: "Theme suggestion handled by AI model directly" };
      }
      case "adjust_pricing": {
        const res = await strapiGet("/api/products?pagination[pageSize]=100");
        const products = (res?.data || []).map((p: Record<string, unknown>) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          count: p.count,
          category: p.productCategory,
        }));
        return { products, strategy: args.strategy, note: "Pricing analysis handled by AI model" };
      }
      case "list_returns": {
        const limit = (args.limit as number) || 10;
        const res = await strapiGet(`/api/returns?pagination[pageSize]=${limit}&sort=createdAt:desc`);
        return (res?.data || []).map((r: Record<string, unknown>) => ({
          id: r.id,
          reason: r.reason,
          status: r.statusReturn,
          date: r.dateReturn,
        }));
      }
      case "get_wallet_info": {
        const res = await strapiGet("/api/wallets");
        const wallet = res?.data?.[0];
        return {
          balance: wallet?.currentBalance || 0,
          totalEarnings: wallet?.totalEarnings || 0,
          pendingClearance: wallet?.pendingClearance || 0,
          totalWithdrawn: wallet?.totalWithdrawn || 0,
          linkedAccounts: wallet?.linkedAccounts?.length || 0,
          recentPayouts: wallet?.payoutHistory?.slice(0, 5) || [],
        };
      }
      case "create_coupon": {
        const now = new Date();
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 1);
        const result = await strapiPost("/api/coupons", {
          couponCode: args.code,
          discount: args.discount,
          discountType: "percentage",
          statusCoupon: true,
          dateStartCoupon: now.toISOString(),
          dateEndCoupon: endDate.toISOString(),
        });
        if (result?.data) {
          await trackEarning(
            "coupon_created",
            `Created coupon: ${args.code} (${args.discount}% off)`,
            "positive",
            5,
            { code: args.code, discount: args.discount }
          );
        }
        return result?.data
          ? { success: true, coupon: { code: result.data.couponCode, discount: result.data.discount } }
          : result;
      }
      case "get_store_settings": {
        const res = await strapiGetAuth("/api/store-setting/me");
        const s = res?.data || res;
        return {
          nameStore: s?.nameStore || "",
          descriptionStore: s?.descriptionStore || "",
          globalColor: s?.globalColor || "",
          headerColor: s?.headerColor || "",
          footerColor: s?.footerColor || "",
          currency: s?.currency || "",
          language: s?.language || "",
          emailStore: s?.emailStore || "",
          phoneStore: s?.phoneStore || "",
          addressStore: s?.addressStore || "",
          seoTitle: s?.seoTitle || "",
          seoDescription: s?.seoDescription || "",
          seoKeywords: s?.seoKeywords || "",
          taxPercentage: s?.taxPercentage || 0,
          shippingCost: s?.shippingCost || 0,
          urlFacebook: s?.urlFacebook || "",
          urlInstagram: s?.urlInstagram || "",
          urlTwitter: s?.urlTwitter || "",
          urlTiktok: s?.urlTiktok || "",
          urlLinkedin: s?.urlLinkedin || "",
          urlLogo: s?.urlLogo || "",
          urlFavicon: s?.urlFavicon || "",
          urlImageHero: s?.urlImageHero || "",
        };
      }
      case "update_store_colors": {
        const updateData: Record<string, unknown> = {};
        if (args.globalColor) updateData.globalColor = args.globalColor;
        if (args.headerColor) updateData.headerColor = args.headerColor;
        if (args.footerColor) updateData.footerColor = args.footerColor;
        const res = await strapiPut("/api/store-setting/me", { data: updateData });
        if (res?.data || res?.ok !== false) {
          await trackEarning("store_colors_updated", `Updated store colors: ${JSON.stringify(updateData)}`, "positive", 3, updateData);
        }
        return { success: true, updated: updateData, message: "Store colors updated successfully" };
      }
      case "update_store_info": {
        const updateData: Record<string, unknown> = {};
        const fields = ["nameStore", "descriptionStore", "currency", "language", "emailStore", "phoneStore", "addressStore", "seoTitle", "seoDescription", "seoKeywords", "taxPercentage", "shippingCost"];
        for (const field of fields) {
          if (args[field] !== undefined && args[field] !== null) updateData[field] = args[field];
        }
        const res = await strapiPut("/api/store-setting/me", { data: updateData });
        if (res?.data || res?.ok !== false) {
          await trackEarning("store_info_updated", `Updated store info: ${Object.keys(updateData).join(", ")}`, "positive", 2, updateData);
        }
        return { success: true, updated: updateData, message: "Store settings updated successfully" };
      }
      case "apply_theme": {
        const THEMES: Record<string, Record<string, string>> = {
          aurora: { globalColor: "#7C3AED", headerColor: "#1E1040", footerColor: "#1E1040" },
          noir: { globalColor: "#E5E5E5", headerColor: "#0A0A0A", footerColor: "#0A0A0A" },
          neonCyber: { globalColor: "#00E5FF", headerColor: "#06061A", footerColor: "#06061A" },
          ocean: { globalColor: "#0284C7", headerColor: "#0C2D4A", footerColor: "#0C2D4A" },
          forest: { globalColor: "#16A34A", headerColor: "#0D2818", footerColor: "#0D2818" },
          rose: { globalColor: "#E11D48", headerColor: "#2A0A15", footerColor: "#2A0A15" },
          luxury: { globalColor: "#D4A843", headerColor: "#0E0E0E", footerColor: "#0E0E0E" },
          mint: { globalColor: "#059669", headerColor: "#FFFFFF", footerColor: "#ECFDF5" },
          sunset: { globalColor: "#EA580C", headerColor: "#2A1005", footerColor: "#2A1005" },
          stone: { globalColor: "#78716C", headerColor: "#FAFAF9", footerColor: "#F0EFED" },
          electric: { globalColor: "#2563EB", headerColor: "#0A1040", footerColor: "#0A1040" },
          blush: { globalColor: "#DB2777", headerColor: "#FFF0F5", footerColor: "#FFF0F5" },
          slate: { globalColor: "#475569", headerColor: "#FFFFFF", footerColor: "#F1F5F9" },
          volcanic: { globalColor: "#DC2626", headerColor: "#1C0606", footerColor: "#1C0606" },
          cream: { globalColor: "#B45309", headerColor: "#FFFBF0", footerColor: "#FFF5E0" },
        };
        const theme = THEMES[(args.theme_name as string)] || THEMES.aurora;
        const updateData: Record<string, unknown> = { ...theme };
        if (args.store_name) updateData.nameStore = args.store_name;
        if (args.store_description) updateData.descriptionStore = args.store_description;
        const res = await strapiPut("/api/store-setting/me", { data: updateData });
        if (res?.data || res?.ok !== false) {
          await trackEarning("theme_applied", `Applied "${args.theme_name}" theme`, "positive", 5, { theme: args.theme_name, ...updateData });
        }
        return { success: true, theme: args.theme_name, colors: theme, message: `Applied "${args.theme_name}" theme successfully` };
      }
      case "update_seo": {
        const updateData: Record<string, unknown> = {};
        if (args.title) updateData.seoTitle = args.title;
        if (args.description) updateData.seoDescription = args.description;
        if (args.keywords) updateData.seoKeywords = args.keywords;
        const res = await strapiPut("/api/store-setting/me", { data: updateData });
        return { success: true, updated: updateData, message: "SEO settings updated" };
      }
      case "update_social_links": {
        const updateData: Record<string, unknown> = {};
        if (args.facebook) updateData.urlFacebook = args.facebook;
        if (args.instagram) updateData.urlInstagram = args.instagram;
        if (args.twitter) updateData.urlTwitter = args.twitter;
        if (args.tiktok) updateData.urlTiktok = args.tiktok;
        if (args.linkedin) updateData.urlLinkedin = args.linkedin;
        const res = await strapiPut("/api/store-setting/me", { data: updateData });
        return { success: true, updated: updateData, message: "Social links updated" };
      }
      case "update_store_policies": {
        const updateData: Record<string, unknown> = {};
        if (args.policy) updateData.urlPolicy = args.policy;
        if (args.terms) updateData.urlTerms = args.terms;
        if (args.support) updateData.urlSupport = args.support;
        if (args.shipping_returns) updateData.urlShippingReturnsPolicy = args.shipping_returns;
        if (args.about) updateData.urlAbout = args.about;
        if (args.contact) updateData.urlContact = args.contact;
        if (args.faq) updateData.urlFAQ = args.faq;
        if (args.tracking) updateData.urlTracking = args.tracking;
        const res = await strapiPut("/api/store-setting/me", { data: updateData });
        return { success: true, updated: updateData, message: "Store policies updated" };
      }
      case "update_payment_and_taxes": {
        const updateData: Record<string, unknown> = {};
        if (args.acceptCOD !== undefined) updateData.acceptCOD = args.acceptCOD;
        if (args.acceptCard !== undefined) updateData.acceptCard = args.acceptCard;
        if (args.acceptPaypal !== undefined) updateData.acceptPaypal = args.acceptPaypal;
        if (args.taxPercentage !== undefined) updateData.taxPercentage = args.taxPercentage;
        if (args.shippingCost !== undefined) updateData.shippingCost = args.shippingCost;
        if (args.taxNumber) updateData.taxNumber = args.taxNumber;
        const res = await strapiPut("/api/store-setting/me", { data: updateData });
        return { success: true, updated: updateData, message: "Payment & tax settings updated" };
      }
      case "update_tracking_pixels": {
        const updateData: Record<string, unknown> = {};
        if (args.facebookPixelId) updateData.facebookPixelId = args.facebookPixelId;
        if (args.tiktokPixelId) updateData.tiktokPixelId = args.tiktokPixelId;
        if (args.googleAnalyticsId) updateData.googleAnalyticsId = args.googleAnalyticsId;
        const res = await strapiPut("/api/store-setting/me", { data: updateData });
        return { success: true, updated: updateData, message: "Tracking pixels updated" };
      }
      case "update_store_images": {
        const updateData: Record<string, unknown> = {};
        if (args.logo) updateData.urlLogo = args.logo;
        if (args.heroImage) updateData.urlImageHero = args.heroImage;
        if (args.favicon) updateData.urlFavicon = args.favicon;
        const res = await strapiPut("/api/store-setting/me", { data: updateData });
        return { success: true, updated: updateData, message: "Store images updated" };
      }
      case "update_header_menu": {
        const res = await strapiPut("/api/store-setting/me", { data: { headerMenu: args.items } });
        return { success: true, menu: args.items, message: "Header menu updated" };
      }
      case "toggle_maintenance": {
        const res = await strapiPut("/api/store-setting/me", { data: { isMaintenanceMode: args.enabled } });
        return { success: true, enabled: args.enabled, message: args.enabled ? "Maintenance mode ON" : "Maintenance mode OFF" };
      }
      case "build_my_store": {
        const THEMES: Record<string, Record<string, string>> = {
          aurora: { globalColor: "#7C3AED", headerColor: "#1E1040", footerColor: "#1E1040" },
          noir: { globalColor: "#E5E5E5", headerColor: "#0A0A0A", footerColor: "#0A0A0A" },
          neonCyber: { globalColor: "#00E5FF", headerColor: "#06061A", footerColor: "#06061A" },
          ocean: { globalColor: "#0284C7", headerColor: "#0C2D4A", footerColor: "#0C2D4A" },
          forest: { globalColor: "#16A34A", headerColor: "#0D2818", footerColor: "#0D2818" },
          rose: { globalColor: "#E11D48", headerColor: "#2A0A15", footerColor: "#2A0A15" },
          luxury: { globalColor: "#D4A843", headerColor: "#0E0E0E", footerColor: "#0E0E0E" },
          mint: { globalColor: "#059669", headerColor: "#FFFFFF", footerColor: "#ECFDF5" },
          sunset: { globalColor: "#EA580C", headerColor: "#2A1005", footerColor: "#2A1005" },
          stone: { globalColor: "#78716C", headerColor: "#FAFAF9", footerColor: "#F0EFED" },
          electric: { globalColor: "#2563EB", headerColor: "#0A1040", footerColor: "#0A1040" },
          blush: { globalColor: "#DB2777", headerColor: "#FFF0F5", footerColor: "#FFF0F5" },
          slate: { globalColor: "#475569", headerColor: "#FFFFFF", footerColor: "#F1F5F9" },
          volcanic: { globalColor: "#DC2626", headerColor: "#1C0606", footerColor: "#1C0606" },
          cream: { globalColor: "#B45309", headerColor: "#FFFBF0", footerColor: "#FFF5E0" },
        };
        const MENUS: Record<string, Array<{ label: string; url: string }>> = {
          fashion: [
            { label: "New Arrivals", url: "#products" },
            { label: "Collections", url: "#products" },
            { label: "Sale", url: "#deals" },
            { label: "About", url: "/store/about" },
            { label: "Contact", url: "/store/contact" },
          ],
          electronics: [
            { label: "Products", url: "#products" },
            { label: "Deals", url: "#deals" },
            { label: "Support", url: "/store/support" },
            { label: "About", url: "/store/about" },
            { label: "Track Order", url: "/store/tracking" },
          ],
          food: [
            { label: "Menu", url: "#products" },
            { label: "Order Online", url: "#products" },
            { label: "Catering", url: "/store/support" },
            { label: "About", url: "/store/about" },
            { label: "Contact", url: "/store/contact" },
          ],
          beauty: [
            { label: "Shop", url: "#products" },
            { label: "Skincare", url: "#products" },
            { label: "New In", url: "#deals" },
            { label: "About", url: "/store/about" },
            { label: "Help", url: "/store/support" },
          ],
          general: [
            { label: "Shop", url: "#products" },
            { label: "Deals", url: "#deals" },
            { label: "About", url: "/store/about" },
            { label: "Contact", url: "/store/contact" },
            { label: "Help", url: "/store/support" },
          ],
        };

        const PRODUCT_TEMPLATES: Record<string, Array<{ title: string; description: string; price: number; count: number; category: string }>> = {
          fashion: [
            { title: "Classic Leather Jacket", description: "Premium genuine leather jacket, timeless design for all occasions", price: 189.99, count: 25, category: "clothing" },
            { title: "Slim Fit Denim Jeans", description: "Comfortable stretch denim, modern slim fit cut", price: 59.99, count: 50, category: "clothing" },
            { title: "Silk Evening Dress", description: "Elegant silk dress perfect for formal events and parties", price: 249.99, count: 15, category: "clothing" },
            { title: "Casual Linen Shirt", description: "Breathable linen shirt for a relaxed summer look", price: 45.99, count: 40, category: "clothing" },
            { title: "Designer Sunglasses", description: "UV400 protection polarized lenses with premium frame", price: 129.99, count: 30, category: "accessories" },
            { title: "Leather Crossbody Bag", description: "Handcrafted genuine leather bag with adjustable strap", price: 89.99, count: 20, category: "accessories" },
            { title: "Running Sneakers", description: "Lightweight breathable sneakers with cushion sole", price: 119.99, count: 35, category: "shoes" },
            { title: "Wool Blend Overcoat", description: "Luxurious wool blend overcoat for winter elegance", price: 299.99, count: 10, category: "clothing" },
            { title: "Cotton Polo Shirt", description: "Premium pima cotton polo, available in multiple colors", price: 39.99, count: 60, category: "clothing" },
            { title: "Canvas Tote Bag", description: "Durable canvas tote with leather handles, everyday essential", price: 34.99, count: 45, category: "accessories" },
          ],
          electronics: [
            { title: "Wireless Noise-Canceling Headphones", description: "Active noise cancellation, 30hr battery, premium sound", price: 299.99, count: 20, category: "audio" },
            { title: "4K Ultra HD Monitor 27\"", description: "IPS panel, 144Hz refresh rate, HDR support", price: 449.99, count: 12, category: "displays" },
            { title: "Mechanical Gaming Keyboard", description: "Cherry MX switches, RGB backlight, aluminum frame", price: 149.99, count: 25, category: "peripherals" },
            { title: "Portable Bluetooth Speaker", description: "Waterproof IPX7, 360° sound, 20hr battery life", price: 79.99, count: 40, category: "audio" },
            { title: "Smart Fitness Watch", description: "Heart rate, GPS, sleep tracking, 7-day battery", price: 199.99, count: 30, category: "wearables" },
            { title: "USB-C Docking Station", description: "Triple display support, 100W PD, 12 ports", price: 129.99, count: 18, category: "accessories" },
            { title: "Webcam 4K Pro", description: "Auto-focus, built-in ring light, noise-canc mic", price: 89.99, count: 35, category: "peripherals" },
            { title: "Wireless Charging Pad", description: "Fast charge 15W, compatible with all Qi devices", price: 29.99, count: 50, category: "accessories" },
            { title: "Portable SSD 1TB", description: "USB 3.2, read speeds up to 1050MB/s", price: 109.99, count: 28, category: "storage" },
            { title: "Smart Home Hub", description: "Voice control, connects 200+ devices, automation", price: 159.99, count: 22, category: "smart-home" },
          ],
          food: [
            { title: "Artisan Sourdough Bread", description: "Freshly baked 24hr fermented sourdough, crusty & tangy", price: 8.99, count: 50, category: "bakery" },
            { title: "Organic Extra Virgin Olive Oil", description: "Cold-pressed first harvest, 500ml bottle", price: 24.99, count: 40, category: "pantry" },
            { title: "Gourmet Coffee Blend", description: "Single origin arabica, medium roast, notes of chocolate", price: 18.99, count: 60, category: "beverages" },
            { title: "Fresh Pasta Variety Pack", description: "Handmade fettuccine, penne, and rigatoni, 3x250g", price: 14.99, count: 30, category: "pantry" },
            { title: "Mediterranean Spice Set", description: "6 premium spices: za'atar, sumac, cumin, coriander, turmeric, paprika", price: 29.99, count: 25, category: "pantry" },
            { title: "Dark Chocolate Collection", description: "Belgian dark chocolate 72%, box of 12 pralines", price: 34.99, count: 20, category: "sweets" },
            { title: "Cold-Pressed Juice Bundle", description: "6 bottles: green detox, carrot ginger, berry blast, and more", price: 22.99, count: 35, category: "beverages" },
            { title: "Gourmet Cheese Board Set", description: "3 aged cheeses with fig jam and crackers", price: 42.99, count: 15, category: "dairy" },
            { title: "Organic Honey Jar", description: "Raw unfiltered wildflower honey, 500g", price: 16.99, count: 45, category: "pantry" },
            { title: "Gift Hamper Deluxe", description: "Curated selection of premium foods in a gift box", price: 79.99, count: 10, category: "gifts" },
          ],
          beauty: [
            { title: "Vitamin C Brightening Serum", description: "20% Vitamin C + Hyaluronic Acid, 30ml", price: 38.99, count: 40, category: "skincare" },
            { title: "Hydrating Face Moisturizer", description: "Lightweight daily moisturizer with SPF 30", price: 28.99, count: 50, category: "skincare" },
            { title: "Rose Gold Eyeshadow Palette", description: "12 shades from nude to dramatic, blendable formula", price: 44.99, count: 25, category: "makeup" },
            { title: "Retinol Night Cream", description: "Anti-aging formula with peptides and ceramides", price: 52.99, count: 30, category: "skincare" },
            { title: "Coconut Hair Oil", description: "Deep conditioning treatment, repairs damaged hair", price: 19.99, count: 35, category: "haircare" },
            { title: "Mineral Sunscreen SPF50", description: "Zinc oxide formula, reef-safe, non-greasy", price: 24.99, count: 45, category: "skincare" },
            { title: "Luxury Perfume Set", description: "3 travel-size fragrances: floral, woody, fresh", price: 64.99, count: 15, category: "fragrance" },
            { title: "Clay Face Mask", description: "Dead Sea mineral mask, purifying and detoxifying", price: 22.99, count: 30, category: "skincare" },
            { title: "Lip Gloss Collection", description: "6 shades of high-shine lip gloss, non-sticky", price: 32.99, count: 20, category: "makeup" },
            { title: "Jade Roller & Gua Sha Set", description: "Authentic jade stone facial massage tools", price: 26.99, count: 25, category: "tools" },
          ],
          general: [
            { title: "Premium Wireless Earbuds", description: "Bluetooth 5.3, touch control, 24hr total battery", price: 59.99, count: 40, category: "electronics" },
            { title: "Ergonomic Office Chair", description: "Lumbar support, adjustable height, breathable mesh", price: 299.99, count: 15, category: "furniture" },
            { title: "Stainless Steel Water Bottle", description: "Double-wall vacuum insulated, 750ml, keeps hot/cold 24hr", price: 24.99, count: 60, category: "lifestyle" },
            { title: "LED Desk Lamp", description: "Touch dimmer, USB charging port, 5 color modes", price: 39.99, count: 30, category: "home" },
            { title: "Yoga Mat Premium", description: "Non-slip TPE, 6mm thick, carrying strap included", price: 34.99, count: 25, category: "fitness" },
            { title: "Notebook Journal Set", description: "3 premium notebooks, dotted, lined, and blank pages", price: 18.99, count: 50, category: "stationery" },
            { title: "Smart Plug 2-Pack", description: "WiFi enabled, voice control, energy monitoring", price: 22.99, count: 40, category: "smart-home" },
            { title: "Travel Backpack", description: "Anti-theft design, USB port, fits 15.6\" laptop", price: 69.99, count: 20, category: "accessories" },
            { title: "Bamboo Cutting Board Set", description: "3 sizes, antimicrobial, with juice grooves", price: 29.99, count: 35, category: "kitchen" },
            { title: "Plant Care Kit", description: "Mister, pruning shears, soil meter, and pots set", price: 44.99, count: 20, category: "garden" },
          ],
        };

        const COUPONS: Record<string, Array<{ code: string; discount: number }>> = {
          fashion: [{ code: "STYLE20", discount: 20 }, { code: "NEWLOOK15", discount: 15 }],
          electronics: [{ code: "TECH25", discount: 25 }, { code: "GEAR10", discount: 10 }],
          food: [{ code: "TASTE20", discount: 20 }, { code: "FRESH15", discount: 15 }],
          beauty: [{ code: "GLOW30", discount: 30 }, { code: "BEAUTY20", discount: 20 }],
          general: [{ code: "WELCOME20", discount: 20 }, { code: "SAVE15", discount: 15 }],
        };

        const theme = THEMES[(args.theme as string)] || THEMES.aurora;
        const menu = MENUS[(args.store_type as string)] || MENUS.general;
        const products = PRODUCT_TEMPLATES[(args.store_type as string)] || PRODUCT_TEMPLATES.general;
        const coupons = COUPONS[(args.store_type as string)] || COUPONS.general;
        const desc = (args.store_description as string) || `Welcome to ${(args.store_name as string)} - Your one-stop shop`;
        const now = new Date();
        const couponEnd = new Date(now);
        couponEnd.setMonth(couponEnd.getMonth() + 3);

        // 1. Update store settings
        const updateData: Record<string, unknown> = {
          ...theme,
          nameStore: args.store_name,
          descriptionStore: desc,
          currency: args.currency || "USD",
          language: args.language || "en",
          acceptCOD: args.enable_cod !== undefined ? args.enable_cod : true,
          acceptCard: args.enable_card !== undefined ? args.enable_card : true,
          acceptPaypal: args.enable_paypal !== undefined ? args.enable_paypal : false,
          taxPercentage: args.tax_percent || 0,
          shippingCost: args.shipping_cost || 0,
          seoTitle: `${args.store_name} - Your Online Store`,
          seoDescription: desc,
          seoKeywords: `${args.store_name}, ${args.store_type || 'shop'}, online store, shop online`,
          headerMenu: menu,
          urlFacebook: `https://facebook.com/${(args.store_name as string).replace(/\s+/g, "").toLowerCase()}`,
          urlInstagram: `https://instagram.com/${(args.store_name as string).replace(/\s+/g, "").toLowerCase()}`,
          urlTwitter: `https://twitter.com/${(args.store_name as string).replace(/\s+/g, "").toLowerCase()}`,
          urlSupport: `Support for ${args.store_name} — We're here to help!`,
          urlFAQ: `Frequently asked questions about ${args.store_name}. Contact us for any inquiries.`,
          urlContact: `Email: support@${(args.store_name as string).replace(/\s+/g, "").toLowerCase()}.com | Phone: +1 (555) 123-4567`,
          urlTracking: `Track your order using the tracking number sent to your email after purchase.`,
          urlPolicy: `Privacy Policy for ${args.store_name}. We respect your privacy and protect your data.`,
          urlTerms: `Terms and Conditions for ${args.store_name}. By using our services you agree to these terms.`,
          urlShippingReturnsPolicy: `Free shipping on orders over $50. Returns accepted within 30 days of purchase.`,
          urlAbout: `${args.store_name} is your trusted online store. We offer quality products with fast delivery and excellent customer service.`,
        };
        await strapiPut("/api/store-setting/me", { data: updateData });

        // 2. Create real products
        const createdProducts: string[] = [];
        for (const p of products) {
          try {
            const res = await strapiPost("/api/products", {
              title: p.title,
              description: p.description,
              price: p.price,
              count: p.count,
              productCategory: p.category,
              statusProduct: "active",
              dateProduct: now.toISOString(),
            });
            if (res?.data) createdProducts.push(p.title);
          } catch { /* skip failed products */ }
        }

        // 3. Create real coupons
        const createdCoupons: string[] = [];
        for (const c of coupons) {
          try {
            const res = await strapiPost("/api/coupons", {
              couponCode: c.code,
              discount: c.discount,
              discountType: "percentage",
              statusCoupon: true,
              dateStartCoupon: now.toISOString(),
              dateEndCoupon: couponEnd.toISOString(),
            });
            if (res?.data) createdCoupons.push(c.code);
          } catch { /* skip failed coupons */ }
        }

        await trackEarning("store_built", `Built complete "${args.theme}" store: ${args.store_name} (${createdProducts.length} products, ${createdCoupons.length} coupons)`, "positive", 20, { theme: args.theme, name: args.store_name });

        const FRONTEND_BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
        const storeUrl = `${FRONTEND_BASE}/store`;

        return {
          success: true,
          theme: args.theme,
          name: args.store_name,
          colors: theme,
          menu,
          storeUrl,
          productsCreated: createdProducts,
          couponsCreated: createdCoupons,
          message: `Store "${args.store_name}" built!\n\nTheme: ${args.theme}\nColors: ${theme.globalColor}\nProducts: ${createdProducts.length} created\nCoupons: ${createdCoupons.length} created (${createdCoupons.join(", ")})\nMenu: ${menu.length} items\nPayments: COD=${updateData.acceptCOD}, Card=${updateData.acceptCard}, PayPal=${updateData.acceptPaypal}\n\nView your store: ${storeUrl}`,
        };
      }
      default:
        return { error: `Unknown tool: ${name}` };
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { error: msg };
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    // Get session token from cookies for store-setting access
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("accessToken")?.value || "";

    // Fetch API key from Strapi store-settings (admin-controlled)
    let apiKey = "";
    let aiModel = model || "gpt-4o";
    let aiMaxTokens = 2000;
    let aiTemperature = 0.7;
    try {
      const settingsRes = await fetch(`${STRAPI_BASE}/api/store-setting/me`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      const settingsData = await settingsRes.json();
      const settings = settingsData?.data || settingsData;
      if (settings) {
        apiKey = settings.aiApiKey || "";
        if (settings.aiModel) aiModel = settings.aiModel;
        if (settings.aiMaxTokens) aiMaxTokens = settings.aiMaxTokens;
        if (settings.aiTemperature) aiTemperature = settings.aiTemperature;
      }
    } catch {
      // fallback to env
      apiKey = process.env.OPENAI_API_KEY || "";
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const useDemo = !apiKey;

    // If no API key, use demo mode (pattern matching + real tool execution)
    if (useDemo) {
      const lastUserMsg = messages[messages.length - 1]?.content?.toLowerCase() || "";
      const toolCalls: Array<{ id: string; function: { name: string; arguments: string } }> = [];
      let content = "";

      // Pattern match user intent → tool + response
      if (/^\d+\.?\s*(stat|overview|summary|dashboard)/.test(lastUserMsg) || /get.*(stat|overview|summary)/.test(lastUserMsg) || /show.*(stat|overview|summary)/.test(lastUserMsg) || /store.*(stat|overview)/.test(lastUserMsg) || /ع(رض|رضم)/.test(lastUserMsg)) {
        const result = await executeTool("get_store_stats", {}, sessionToken);
        content = `Here's your store overview:\n\n- **Products**: ${result.products}\n- **Orders**: ${result.orders}\n- **Revenue**: $${result.totalRevenue}\n- **Returns**: ${result.returns} (${result.pendingReturns} pending)\n- **Wallet Balance**: $${result.walletBalance}\n\n*Running in demo mode — no OpenAI key configured.*`;
      } else if (/product/.test(lastUserMsg) && /(list|show|all|get|view|عرض|المنتجات)/.test(lastUserMsg)) {
        const result = await executeTool("list_products", { limit: 10 }, sessionToken);
        const items = Array.isArray(result) ? result : [];
        const list = items.map((p: Record<string, unknown>, i: number) => `${i + 1}. ${p.title} — $${p.price} (${p.status})`).join("\n");
        content = `**Products** (${items.length}):\n\n${list || "No products found."}\n\n*Demo mode*`;
      } else if (/(create|add|جديد|اضف|انشئ).*(product|منتج)/.test(lastUserMsg)) {
        const result = await executeTool("create_product", {
          title: "Demo Product",
          description: "Created by AI in demo mode",
          price: 29.99,
          count: 50,
          productCategory: "general",
          statusProduct: "active",
        }, sessionToken);
        content = result.success
          ? `Created product "${result.product.title}" ($${result.product.price}) successfully!\n\n*Demo mode — product is real in your Strapi.*`
          : `Failed to create product: ${JSON.stringify(result)}`;
      } else if (/order/.test(lastUserMsg) && /(list|show|all|get|view|الطلبات|عرض)/.test(lastUserMsg)) {
        const result = await executeTool("list_orders", { limit: 10 }, sessionToken);
        const items = Array.isArray(result) ? result : [];
        const list = items.map((o: Record<string, unknown>, i: number) => `${i + 1}. #${o.id} — ${o.customer} — $${o.total} (${o.status})`).join("\n");
        content = `**Recent Orders** (${items.length}):\n\n${list || "No orders found."}\n\n*Demo mode*`;
      } else if (/message|رسال|محادث/.test(lastUserMsg) && /(list|show|all|get|view|عرض)/.test(lastUserMsg)) {
        const result = await executeTool("list_messages", { limit: 10 }, sessionToken);
        const items = Array.isArray(result) ? result : [];
        const list = items.map((m: Record<string, unknown>, i: number) => `${i + 1}. "${m.subject}" — ${String(m.lastMessage || "").substring(0, 50) || "No message"}...`).join("\n");
        content = `**Customer Messages** (${items.length}):\n\n${list || "No messages found."}\n\n*Demo mode*`;
      } else if (/return|مرتجع/.test(lastUserMsg) && /(list|show|all|get|view|عرض)/.test(lastUserMsg)) {
        const result = await executeTool("list_returns", { limit: 10 }, sessionToken);
        const items = Array.isArray(result) ? result : [];
        const list = items.map((r: Record<string, unknown>, i: number) => `${i + 1}. #${r.id} — ${r.reason || "N/A"} (${r.status})`).join("\n");
        content = `**Returns** (${items.length}):\n\n${list || "No returns found."}\n\n*Demo mode*`;
      } else if (/wallet|محفظ|balance|رصيد/.test(lastUserMsg)) {
        const result = await executeTool("get_wallet_info", {}, sessionToken);
        content = `**Wallet Info**:\n- Balance: $${result.balance}\n- Total Earnings: $${result.totalEarnings}\n- Pending: $${result.pendingClearance}\n- Withdrawn: $${result.totalWithdrawn}\n- Accounts: ${result.linkedAccounts}\n\n*Demo mode*`;
      } else if (/coupon|كوبون|discount|خصم/.test(lastUserMsg)) {
        const code = lastUserMsg.match(/[A-Z]{3,}/)?.[0] || "DEMO20";
        const discount = parseInt(lastUserMsg.match(/\d+/)?.[0] || "20");
        const result = await executeTool("create_coupon", { code, discount, description: `Demo coupon ${discount}% off` }, sessionToken);
        content = result.success
          ? `Created coupon "${result.coupon.code}" (${result.coupon.discount}% off)!\n\n*Demo mode — coupon is real in Strapi.*`
          : `Failed: ${JSON.stringify(result)}`;
      } else if (/setting|اعدادات|متجر|store/.test(lastUserMsg) && /(show|get|view|عرض|الإعدادات)/.test(lastUserMsg)) {
        const result = await executeTool("get_store_settings", {}, sessionToken);
        content = `**Store Settings**:\n- Name: ${result.nameStore || "N/A"}\n- Currency: ${result.currency || "N/A"}\n- Language: ${result.language || "N/A"}\n- Tax: ${result.taxPercentage}%\n- Shipping: $${result.shippingCost}\n\n*Demo mode*`;
      } else if (/color|لون/.test(lastUserMsg)) {
        const hexMatch = lastUserMsg.match(/#[0-9a-fA-F]{6}/);
        if (hexMatch) {
          const result = await executeTool("update_store_colors", { globalColor: hexMatch[0] }, sessionToken);
          content = result.success ? `Updated store color to ${hexMatch[0]}!\n\n*Demo mode*` : `Failed: ${JSON.stringify(result)}`;
        } else {
          content = "Please provide a hex color like `#6366F1` to change the store color.\n\n*Demo mode*";
        }
      } else if (/theme|ثيم|تصميم/.test(lastUserMsg)) {
        const themeMatch = lastUserMsg.match(/(aurora|noir|neonCyber|ocean|forest|rose|luxury|mint|sunset|stone|electric|blush|slate|volcanic|cream)/i);
        if (themeMatch) {
          const result = await executeTool("apply_theme", { theme_name: themeMatch[1].toLowerCase() }, sessionToken);
          content = result.success ? `Applied "${themeMatch[1]}" theme!\n\n*Demo mode*` : `Failed: ${JSON.stringify(result)}`;
        } else {
          content = "Available themes: aurora, noir, neonCyber, ocean, forest, rose, luxury, mint, sunset, stone, electric, blush, slate, volcanic, cream.\n\nSay \"apply aurora theme\" to try one!\n\n*Demo mode*";
        }
      } else if (/maintenance|صيانة/.test(lastUserMsg)) {
        const enabled = /on|enable|تشغيل| aktif/.test(lastUserMsg);
        const result = await executeTool("toggle_maintenance", { enabled }, sessionToken);
        content = result.success ? `Maintenance mode ${enabled ? "ON" : "OFF"}!\n\n*Demo mode*` : `Failed`;
      } else if (/build|ابنيلي|صمملي|_design/.test(lastUserMsg)) {
        const themeMatch = lastUserMsg.match(/(aurora|noir|neonCyber|ocean|forest|rose|luxury|mint|sunset|stone|electric|blush|slate|volcanic|cream)/i);
        const nameMatch = lastUserMsg.match(/(?:called|named|اسم|اسمها)\s+["']?([^"']+?)["']?\s*(?:,|$|\s+(?:fashion|electronics|food|beauty|general|theme|type))/i)
          || lastUserMsg.match(/(?:store|متجر)\s+["']?([^"']+?)["']?\s*(?:,|$|\s+(?:fashion|electronics|food|beauty|general|theme|type))/i);
        const typeMatch = lastUserMsg.match(/(fashion|electronics|food|beauty|general)/i);

        if (themeMatch && nameMatch) {
          const result = await executeTool("build_my_store", {
            theme: themeMatch[1].toLowerCase(),
            store_name: nameMatch[1].trim(),
            store_type: typeMatch?.[1]?.toLowerCase() || "general",
            currency: "USD",
            language: "en",
            enable_cod: true,
            enable_card: true,
            enable_paypal: false,
          }, sessionToken);
          if (result.success) {
            const FRONTEND_BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
            const storeUrl = `${FRONTEND_BASE}/store`;
            content = `Store built successfully!\n\n${result.message}\n\n**Products created:** ${result.productsCreated?.length || 0}\n**Coupons created:** ${result.couponsCreated?.join(", ") || "none"}\n\nView your live store: ${storeUrl}\n\n*All data is real in your Strapi database!*`;
          } else {
            content = `Build failed: ${JSON.stringify(result)}`;
          }
        } else {
          content = "To build your store, tell me:\n1. **Store name** (e.g., \"My Fashion Store\")\n2. **Theme**: aurora, noir, neonCyber, ocean, forest, rose, luxury, mint, sunset, stone, electric, blush, slate, volcanic, cream\n3. **Store type** (optional): fashion, electronics, food, beauty, general\n\nExample: \"Build my store called Trendy, luxury theme, fashion type\"\n\nI'll create real products, coupons, colors, menu, and settings!";
        }
      } else if (/hi|hello|hey|مرحبا|السلام|هلا/.test(lastUserMsg)) {
        content = "Hello! I'm **ShopShop AI** (demo mode). I can:\n\n- Show store stats, products, orders, messages, returns, wallet\n- Create products and coupons\n- Change store colors, themes, and settings\n- Toggle maintenance mode\n- Build your store in one click\n\nAsk me anything!\n\n*No OpenAI key needed in demo mode — all tools are real!*";
      } else if (/help|مساعدة|كيف|what can/.test(lastUserMsg)) {
        content = "**Demo Mode — Available commands:**\n\n1. \"Show store stats\" — overview dashboard\n2. \"List products\" — all products\n3. \"Create product\" — adds demo product\n4. \"List orders\" — recent orders\n5. \"List messages\" — customer conversations\n6. \"List returns\" — return requests\n7. \"Show wallet\" — balance & payouts\n8. \"Create coupon SUMMER20 20\" — new coupon\n9. \"Show store settings\" — all settings\n10. \"Change color #6366F1\" — update color\n11. \"Apply aurora theme\" — change theme\n12. \"Turn on maintenance\" — maintenance mode\n13. \"Build my store\" — one-click setup\n\nAll actions are **real** — they modify your Strapi store!";
      } else {
        content = `I received: \"${messages[messages.length - 1]?.content || ""}\"\n\nI'm in **demo mode** (no OpenAI key). Try:\n- \"Show store stats\"\n- \"List products\"\n- \"Apply aurora theme\"\n- \"Build my store\"\n- \"Help\" for full list\n\n*All tool actions are real even in demo mode!*`;
      }

      return NextResponse.json({ content, toolCalls, demo: true });
    }

    // === REAL OPENAI MODE ===
    const openaiMessages: Array<Record<string, unknown>> = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // First call to OpenAI
    let response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: aiModel,
        messages: openaiMessages,
        tools: TOOLS,
        tool_choice: "auto",
        max_tokens: aiMaxTokens,
        temperature: aiTemperature,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const errMsg = err?.error?.message || `OpenAI API error: ${response.status}`;
      // If OpenAI fails, fallback to demo mode for this request
      if (response.status === 429 || response.status === 401) {
        return NextResponse.json({
          content: `OpenAI error: ${errMsg}\n\nFalling back to **demo mode** for this response. Configure a valid API key in AI Settings for full AI responses.\n\nTry: \"Show store stats\" or \"List products\"`,
          toolCalls: [],
          demo: true,
        });
      }
      return NextResponse.json(
        { error: errMsg },
        { status: response.status }
      );
    }

    let data = await response.json();
    let assistantMessage = data.choices?.[0]?.message;

    // Handle tool calls in a loop
    while (assistantMessage?.tool_calls?.length > 0) {
      // Add assistant message to conversation
      openaiMessages.push({
        role: "assistant",
        content: assistantMessage.content || "",
        tool_calls: assistantMessage.tool_calls,
      });

      // Execute each tool call
      for (const toolCall of assistantMessage.tool_calls) {
        const fnName = toolCall.function.name;
        let fnArgs = {};
        try {
          fnArgs = JSON.parse(toolCall.function.arguments || "{}");
        } catch {
          fnArgs = {};
        }

        const toolResult = await executeTool(fnName, fnArgs, sessionToken);

        openaiMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }

      // Call OpenAI again with tool results
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: aiModel,
          messages: openaiMessages,
          tools: TOOLS,
          tool_choice: "auto",
          max_tokens: aiMaxTokens,
          temperature: aiTemperature,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return NextResponse.json(
          { error: err?.error?.message || `OpenAI API error: ${response.status}` },
          { status: response.status }
        );
      }

      data = await response.json();
      assistantMessage = data.choices?.[0]?.message;
    }

    return NextResponse.json({
      content: assistantMessage?.content || "I'm here to help! What would you like to do?",
      toolCalls: assistantMessage?.tool_calls || [],
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
