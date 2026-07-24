"use client";

import { useState } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";
import { useLanguage } from "@/app/store/LanguageContext";
import { useDBTranslation } from "@/lib/translate-db";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (formData: any,imageId:number) => void;
}

export default function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
  const { t, dir } = useLanguage();
  const { translateCategory, translateProductStatus } = useDBTranslation();
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("Electronics");
  const [image, setImage] = useState<File | null>(null);
  const [imagePrev, setImagePrev] = useState<string>("");
  const [statusProduct, setStatusProduct] = useState("active");
  const [description, setDescription] = useState("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file as any);
    setImagePrev(URL.createObjectURL(file)as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || !description || !category || !image || !statusProduct) {
      toast.error(t("products.fillAll"));
      return;
    }

    const loadingToast = toast.loading(t("products.processing"));
    
    try {
    const mediaData = new FormData();
    mediaData.append("files", image as any);

    const uploadRes = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.UPLOAD}`, {
      method: "POST",
      body: mediaData,
    });

    if (!uploadRes.ok) {
      console.error("Error uploading file");
      toast.error(t("products.imageFailed"));
      return;
    }
  const uploadedFiles = await uploadRes.json();
  const imageId = uploadedFiles[0]?.id || uploadedFiles.id;
  
  const productData = {
    data: {
    title: name,
    price: Number(price),
    count: Number(stock),
    description: description,
    productCategory: category,
    statusProduct: statusProduct,
    dateProduct: new Date().toISOString(),
    image: imageId
  }}
  await onAddProduct(JSON.stringify(productData),imageId);

  localStorage.setItem(`image${imageId}`, imagePrev);

}catch(err){
      toast.error(t("products.addFailed"), { id: loadingToast });
      return;
    }finally{
       toast.success(t("products.addedSuccess"), { id: loadingToast });
    }

    setName("");
    setPrice(0);
    setStock(0);
    setImage(null);
    setStatusProduct("");
    setDescription("");
    setCategory("");
    onClose();
  }
if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs" onClick={onClose} />
      
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl z-50 animate-scale-in text-start relative" dir={dir}>
        <button onClick={onClose} className={`absolute top-4 ${dir === "rtl" ? "left-4" : "right-4"} text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer`}>
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">{t("products.addNewTitle")}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t("products.productName")}</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("products.productNamePlaceholder")}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t("products.productDesc")}</label>
            <textarea 
              rows={4} 
              placeholder={t("products.productDescPlaceholder")}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t("products.priceLabel")}</label>
              <input 
                type="number" 
                step="0.01"
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0.00"
                className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t("products.stockQty")}</label>
              <input 
                type="number" 
                onChange={(e) => setStock(Number(e.target.value))}
                placeholder={t("products.stockPlaceholder")}
                className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t("products.categoryLabel")}</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="Electronics">{translateCategory("Electronics")}</option>
              <option value="Clothing">{translateCategory("Clothing & Apparel")}</option>
              <option value="Home & Kitchen">{translateCategory("Home & Kitchen")}</option>
              <option value="Books">{translateCategory("Books & Media")}</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t("products.status")}</label>
            <select 
              value={statusProduct}
              onChange={(e) => setStatusProduct(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="active">{t("products.statusActive")}</option>
              <option value="draft">{t("products.statusDraft")}</option>
              <option value="out_of_stock">{t("products.statusOutOfStock")}</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t("products.productImage")}</label>
            
            <div className="relative w-full">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                id="file-upload"
                className="hidden"
              />
              <label 
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl bg-slate-50/50 dark:bg-zinc-800/30 cursor-pointer transition-colors p-4 text-center"
              >
                {image ? (
                  <div className="relative w-full h-full flex items-center justify-center gap-3">
                    <img src={imagePrev} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-slate-100 dark:border-zinc-700" />
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ImageIcon size={14} /> {t("products.imageUploaded")}
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload size={22} className="text-slate-400 dark:text-zinc-500 mb-2" />
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">{t("products.uploadPhoto")}</span>
                    <span className="text-[10px] text-slate-400 mt-1">{t("products.uploadHint")}</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold p-3 rounded-xl transition-all duration-200 shadow-sm mt-2 cursor-pointer active:scale-95">
            {t("products.publish")}
          </button>
        </form>
      </div>
    </div>
  );
}
