import { useState,useEffect } from "react";
import { X, Upload, ImageIcon } from "lucide-react";
import Image from "next/image";
import{toast} from "react-hot-toast";
import { API_CONFIG, API_ENDPOINTS } from "@/lib/api-config";


interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  id:  any,
  onUpdate: () => Promise<void>;
}

const EditProduct = ({isOpen,onClose,id,onUpdate}:EditProductModalProps) => {
    
    const [name,setName] = useState("");
    const [price,setPrice] = useState(0);
    const [count,setCount] = useState(0);
    const [category,setCategory] = useState("");
    const [image,setImage] = useState<string | null>(null);
    const [statusProduct,setStatusProduct] = useState("active");
    const [description,setDescription] = useState("");
    
    const [imagePrev,setImagePrev] = useState<string>("");
    const [imageId,setImageId] = useState<number>(0);
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(()=>{
    if(isOpen&&id){
        setName(id.title);
        setPrice(id.price);
        setCount(id.count);
        setCategory(id.productCategory);
        setImage(id.image);
        setStatusProduct(id.statusProduct);
        setDescription(id.description);
    }
    if(id.image?.url){
        setImagePrev(`${API_CONFIG.STRAPI_BASE_URL}${id.image.url}`);
    }else {
        setImagePrev("");
    }

},[id,isOpen]);


    
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const toastLoading = toast.loading("Processing and uploading image... 🚀");
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImagePrev(URL.createObjectURL(file)as any);

   try{
    const mediaData = new FormData();
    mediaData.append("files", file as any);

   
    const uploadRes = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.UPLOAD}`, {
      method: "POST",
      body: mediaData,
    });
    setIsLoading(true);

    if (!uploadRes.ok) {
      console.error("Error uploading file");
      toast.error("Failed to upload image. Please try again! ❌", { id: toastLoading });
      return;
    }
    else{
        toast.success("Image uploaded successfully! 🎉", { id: toastLoading });
        
    }
    const uploadedFiles = await uploadRes.json();
    setImageId(uploadedFiles[0]?.id || uploadedFiles.id);
    console.log(imageId);
   }catch(err){
    toast.error("Failed to upload image. Please try again! ❌", { id: toastLoading });
    return;
   }finally{
    setIsLoading(false);
   }
  };

  const UpdateProduct = async(formData: any,id:any) => {
    const loadingToast = toast.loading("Processing and uploading product... 🚀");
    try{
        
      const res = await fetch(`${API_CONFIG.STRAPI_BASE_URL}${API_ENDPOINTS.PRODUCTS.BY_ID(id.documentId)}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: formData,

      
    }

  );
    if (res.ok) {
      window.dispatchEvent(new Event("products-updated"));
      onClose();
    }
    }catch(err){

    toast.error("Failed to publish product. Please try again! ❌", { id: loadingToast });
    
    }finally{
        toast.success("Product updated successfully! 🎉", { id: loadingToast });

    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !count || !description || !category || !image || !statusProduct) {
      toast.error("Please fill all required fields! ⚠️");
      return;}
    try {
    
  if(imageId!=0){
  const productData = {
    data: {
    title: name,
    price: Number(price),
    count: Number(count),
    description: description,
    productCategory: category,
    statusProduct: statusProduct,
    image: imageId,
    
  }}
await UpdateProduct(JSON.stringify(productData),id);
}
  else{
    const productData = {
      data: {
      title: name,
      price: Number(price),
      count: Number(count),
      description: description,
      productCategory: category,
      statusProduct: statusProduct,
      
    }}
    await UpdateProduct(JSON.stringify(productData),id);
  }

  
}catch(err){   
       toast.error("Failed to publish product. Please try again! ❌");
      return;
    }  
    onClose();
  }



if (!isOpen) {
    return null;
}
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-xs" onClick={onClose} />
      
      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl z-50 animate-scale-in text-left relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-5">Edit Product</h3>
        
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
                value={price}
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
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
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

          <button onClick={handleSubmit} type="submit" className={` w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold p-3 rounded-xl transition-all duration-200 shadow-sm mt-2 cursor-pointer active:scale-95`}>
            Publish Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;