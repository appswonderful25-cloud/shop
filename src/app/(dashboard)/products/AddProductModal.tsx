"use client";

import { useState } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";
import{toast} from "react-hot-toast";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (formData: any,imageId:number) => void;
}

export default function AddProductModal({ isOpen, onClose, onAddProduct }: AddProductModalProps) {
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
      toast.error("Please fill all required fields! ⚠️");
      return;}

      
      const loadingToast = toast.loading("Processing and uploading product... 🚀");
    
    try {
    const mediaData = new FormData();
    mediaData.append("files", image as any);

   
    const uploadRes = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.UPLOAD}`, {
      method: "POST",
      body: mediaData,
    });

    if (!uploadRes.ok) {
      console.error("Error uploading file");
      toast.error("Failed to upload image. Please try again! ❌");
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
      toast.error("Failed to add product. Please try again! ❌", { id: loadingToast });
      
      return;
    }finally{
       toast.success("Product added successfully! 🎉", { id: loadingToast });
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
      
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl z-50 animate-scale-in text-left relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Add New Product</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Product Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Wireless Headphones"
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Product Description</label>
            <textarea 
              rows={4} 
              placeholder="Provide a detailed description of the product, including key features, specifications, and warranty info..."
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Price ($)</label>
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
              <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Stock Qty</label>
              <input 
                type="number" 
                
                onChange={(e) => setStock(Number(e.target.value))}
                placeholder="e.g., 50"
                className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="Electronics">Electronics</option>
              <option value="Clothing">Clothing & Apparel</option>
              <option value="Home & Kitchen">Home & Kitchen</option>
              <option value="Books">Books & Media</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Status</label>
            <select 
              value={statusProduct}
              onChange={(e) => setStatusProduct(e.target.value)}
              className="w-full bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800 text-sm p-3 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Product Image</label>
            
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
                      <ImageIcon size={14} /> Image Uploaded!
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload size={22} className="text-slate-400 dark:text-zinc-500 mb-2" />
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">Click to upload product photo</span>
                    <span className="text-[10px] text-slate-400 mt-1">PNG, JPG up to 5MB</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold p-3 rounded-xl transition-all duration-200 shadow-sm mt-2 cursor-pointer active:scale-95">
            Publish Product
          </button>
        </form>
      </div>
    </div>
  );
}
