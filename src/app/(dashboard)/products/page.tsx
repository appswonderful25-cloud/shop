"use client";

import { useState,useEffect, useRef, useCallback } from "react";
import { Package, Plus, Search, MoreHorizontal, Trash2, Layers } from "lucide-react";
import AddProductModal from "./AddProductModal";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import EditProduct from "./EditProduct";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";
import { useLanguage } from "@/app/store/LanguageContext";
import { useDBTranslation } from "@/lib/translate-db";

export default function Products() {
  const { t, dir } = useLanguage();
  const { translateCategory } = useDBTranslation();
  const [products,setProducts] = useState<any[]>([]);
  const [loading,setLoading] = useState<boolean>(true);
  const [imageId,setImageId] = useState<number>(0);
  const isLoadingRef = useRef(false);

  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter((product) =>
    product.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const fetchData = useCallback(async () => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.PRODUCTS.LIST}?populate=*&sort=createdAt:desc`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();

      setProducts(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products data:", err);
      setLoading(false);
      toast.error(t("products.deleteFailed"));
    } finally {
      isLoadingRef.current = false;
    }
  }, [t]);
  
useEffect(() => {
  fetchData();

  const handleLiveRefresh = () => {
    setTimeout(() => {
      if (!isLoadingRef.current) {
        fetchData();
      }
    }, 100);
  };

  window.addEventListener("products-updated", handleLiveRefresh);
  
  return () => {
    window.removeEventListener("products-updated", handleLiveRefresh);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

      if(loading){
    return <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-4">
      <div className="w-12 h-12 border-4 border-[#4f46e5] border-t-transparent rounded-full animate-spin"></div>
      <h2 className="text-xl font-semibold text-[#4f46e5] animate-pulse">
        {t("products.loading")}
      </h2>
    </div>
    }

  async function addProduct(formData: any,imageId:number) {
    try{
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.PRODUCTS.LIST}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setProducts([...products, data.data]);
      setImageId(imageId);
      await fetchData();
    }
    }catch(err){
    }
  }
  const imageurl = typeof window !== 'undefined' ? localStorage.getItem(`image${imageId}`) as string : '';

  const handleDeleteProduct = async (id:string) => {
    const loadingToast = toast.loading(t("products.deleting"));
    
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1] || '';
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.PRODUCTS.BY_ID(id)}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      
      if (!res.ok) {
        throw new Error("Failed to delete product");
      }
      
      setProducts(products.filter(p => p.documentId !== id));
      await fetchData();
      toast.success(t("products.deletedSuccess"), { id: loadingToast });
    } catch (err) {
      console.error("Failed to delete product:", err);
      toast.error(t("products.deleteFailed"), { id: loadingToast });
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-start relative" dir={dir}>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Package className="text-indigo-600 dark:text-indigo-400" size={26} />
            {t("products.inventory")}
          </h1>
          <p className="text-sm text-slate-400 dark:text-zinc-500 mt-1">
            {t("products.inventoryDesc")}
          </p>
        </div>
        
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98] shrink-0 cursor-pointer">
          <Plus size={16} />
          {t("products.addProduct")}
        </button>
      </div>

      <div className="relative max-w-md w-full">
        <span className={`absolute inset-y-0 ${dir === "rtl" ? "right-0 pr-4" : "left-0 pl-4"} flex items-center pointer-events-none`}>
          <Search size={16} className="text-slate-400 dark:text-zinc-500" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("products.searchPlaceholder")}
          className={`w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs ${dir === "rtl" ? "pr-10 pl-4" : "pl-10 pr-4"} py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 transition-colors shadow-sm`}
        />
      </div>

      <div className="w-full bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-start border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/50 text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                <th className="p-4">{t("products.productInfo")}</th>
                <th className="p-4">{t("products.category")}</th>
                <th className="p-4">{t("products.price")}</th>
                <th className="p-4">{t("products.stockStatus")}</th>
                <th className="p-4 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
              {[...filteredProducts].map((product) => {
                
                const isDropdownOpen = activeDropdownId === product.id;
                const imageUrl = product.image?.formats?.small?.url || product.image?.formats?.thumbnail?.url ;

                const fullImageUrl = imageUrl ? `${API_CONFIG.STRAPI_BASE_URL}${imageUrl}` : imageurl;

                return (
                  <tr key={product.id} className="hover:bg-slate-50/40 dark:hover:bg-zinc-800/20 transition-colors text-sm text-slate-700 dark:text-zinc-300">
                    
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={fullImageUrl} alt={product.title} className="w-10 h-10 rounded-xl object-cover border border-slate-100 dark:border-zinc-800 shrink-0" />
                        <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[180px] block">{product.title}</span>
                      </div>
                    </td>

                    <td className="p-4 font-medium text-slate-500 dark:text-zinc-400">
                      <span className="inline-flex items-center gap-1 bg-slate-50 dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-zinc-700/30 text-xs font-semibold">
                        <Layers size={12} className="text-slate-400" />
                        {translateCategory(product.productCategory)}
                      </span>
                    </td>

                    <td className="p-4 font-bold text-slate-900 dark:text-white">
                      ${product.price}
                    </td>

                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                        ${product.count>0 
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.count > 0 && product.statusProduct === "active" ? "bg-emerald-500" : product.statusProduct === "draft" ? "bg-amber-500" : "bg-rose-500"}`} />
                        {product.count>0  ? t("products.inStock", { count: product.count }) : t("products.outOfStockEmoji")}
                      </span>
                    </td>

                    <td className="p-4 relative">
                      <button onClick={() => setActiveDropdownId(activeDropdownId === product.id ? null : product.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer">
                        <MoreHorizontal size={18} />
                      </button>
                      {isDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setActiveDropdownId(null)} />
                          <div className={`absolute ${dir === "rtl" ? "left-4" : "right-4"} mt-1 w-36 bg-white dark:bg-zinc-800 rounded-xl shadow-lg border border-slate-100 dark:border-zinc-700/50 py-1.5 z-50 animate-scale-in text-start`}>
                            <button onClick={() => { setIsEditModalOpen(true); setEditProductId(product); setActiveDropdownId(product.Id); }} className="w-full text-start px-3.5 py-2 text-xs font-bold text-black dark:text-white hover:bg-sky-50 dark:hover:bg-rose-950/20 transition-colors flex items-center gap-2 cursor-pointer">
                              <Pencil size={14} />
                              {t("products.editProduct")}
                            </button>
                            <button onClick={() => { handleDeleteProduct(product.documentId); setActiveDropdownId(null); }} className="w-full text-start px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors flex items-center gap-2 cursor-pointer">
                              <Trash2 size={14} />
                              {t("products.deleteProduct")}
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddProduct={addProduct} />
      {editProductId && <EditProduct isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} id={editProductId} onUpdate={fetchData} />}
    </div>
  );
}
