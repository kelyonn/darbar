import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { getFirstImage } from '../../utils/images';
import { Plus, Edit2, Trash2, X, Upload, ImagePlus } from 'lucide-react';
import { Product } from '../../types';

const SellerProducts: React.FC = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImages, setUploadingImages] = useState<string[]>([]); // tracks uploading indices
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'mens',
    subcategory: '',
    stock: 0,
    fabric: '',
    artisanStory: '',
    images: [''],
    colors: [''],
    sizes: ['']
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/seller/products');
      setProducts(data.products);
    } catch (err) {
      toast('Failed to load your products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      const imgs = product.images.map((img: any) => typeof img === 'string' ? img : img?.url || '');
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        subcategory: product.subcategory || '',
        stock: product.stock,
        fabric: product.fabric || '',
        artisanStory: product.artisanStory || '',
        images: imgs.length > 0 ? imgs : [''],
        colors: product.colors?.length ? product.colors : [''],
        sizes: product.sizes?.length ? product.sizes : ['']
      });
      setImagePreviews(imgs);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', description: '', price: 0, category: 'mens', subcategory: '',
        stock: 0, fabric: '', artisanStory: '', images: [''], colors: [''], sizes: ['']
      });
      setImagePreviews([]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImagePreviews([]);
    setUploadingImages([]);
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files).slice(0, 5); // max 5 images
    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) { toast('Only image files are allowed', 'error'); continue; }
      const tmpId = URL.createObjectURL(file);
      setImagePreviews(prev => [...prev, tmpId]);
      setUploadingImages(prev => [...prev, tmpId]);
      try {
        const fd = new FormData();
        fd.append('image', file);
        const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        const url = data.url;
        setFormData(prev => ({ ...prev, images: [...prev.images.filter(i => i), url] }));
        setImagePreviews(prev => prev.map(p => p === tmpId ? url : p));
      } catch {
        toast(`Failed to upload ${file.name}`, 'error');
        setImagePreviews(prev => prev.filter(p => p !== tmpId));
      } finally {
        setUploadingImages(prev => prev.filter(p => p !== tmpId));
      }
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleArrayChange = (field: 'colors' | 'sizes', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'colors' | 'sizes') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'colors' | 'sizes', index: number) => {
    const newArray = [...formData[field]];
    newArray.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const uploadedUrls = formData.images.filter(i => i.trim());
    if (uploadedUrls.length === 0) { toast('Please upload at least one image', 'error'); return; }
    if (uploadingImages.length > 0) { toast('Please wait for images to finish uploading', 'error'); return; }
    try {
      const payload = {
        ...formData,
        images: uploadedUrls.map(url => ({ url, alt: formData.name, isPrimary: false })),
        colors: formData.colors.filter(i => i.trim()),
        sizes: formData.sizes.filter(i => i.trim()),
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id || editingProduct.id}`, payload);
        toast('Product updated successfully', 'success');
      } else {
        await api.post('/products', payload);
        toast('Product created successfully', 'success');
      }
      handleCloseModal();
      fetchProducts();
    } catch (err: any) {
      toast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      toast('Product deleted', 'success');
      fetchProducts();
    } catch (err) {
      toast('Failed to delete product', 'error');
    }
  };

  const inputClass = "w-full rounded border border-gray-300 px-3 py-2 text-sm font-montserrat focus:border-royal-gold focus:outline-none";
  const labelClass = "block text-xs font-montserrat font-medium text-gray-700 uppercase mb-1";

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-playfair text-2xl">My Products</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-royal-gold text-white px-4 py-2 rounded font-montserrat text-sm hover:bg-opacity-90 transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-2 border-royal-gold border-t-transparent rounded-full animate-spin" /></div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="font-montserrat text-gray-500">You haven't added any products yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 font-montserrat text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-4 font-montserrat text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-4 font-montserrat text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-4 font-montserrat text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-6 py-4 font-montserrat text-xs font-medium text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id || product.id} className={`border-b border-gray-100 last:border-0 ${!product.isActive ? 'opacity-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={getFirstImage(product.images)} alt={product.name} className="w-10 h-10 rounded object-cover" />
                      <div>
                        <p className="font-playfair text-sm">{product.name}</p>
                        {!product.isActive && <span className="text-[10px] bg-red-100 text-red-800 px-1 rounded font-montserrat">Inactive</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-montserrat text-sm capitalize">{product.category}</td>
                  <td className="px-6 py-4 font-montserrat text-sm text-royal-gold font-medium">₹{product.price.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 font-montserrat text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${product.stock > 10 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenModal(product)} className="text-gray-400 hover:text-royal-gold p-1 mr-2 transition-colors"><Edit2 size={16} /></button>
                    {product.isActive && (
                      <button onClick={() => handleDelete(product._id || product.id)} className="text-gray-400 hover:text-royal-red p-1 transition-colors"><Trash2 size={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="font-playfair text-xl">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className={labelClass}>Product Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Description</label>
                    <textarea required rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className={inputClass}></textarea>
                  </div>
                  <div>
                    <label className={labelClass}>Price (₹)</label>
                    <input type="number" required min="0" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: Number(e.target.value) }))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Stock</label>
                    <input type="number" required min="0" value={formData.stock} onChange={e => setFormData(p => ({ ...p, stock: Number(e.target.value) }))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Category</label>
                    <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className={inputClass}>
                      <option value="mens">Men's</option>
                      <option value="womens">Women's</option>
                      <option value="accessories">Accessories</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Fabric (Optional)</label>
                    <input type="text" value={formData.fabric} onChange={e => setFormData(p => ({ ...p, fabric: e.target.value }))} className={inputClass} />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Artisan Story (Optional)</label>
                    <textarea rows={2} value={formData.artisanStory} onChange={e => setFormData(p => ({ ...p, artisanStory: e.target.value }))} className={inputClass}></textarea>
                  </div>

                  {/* Images */}
                  <div className="col-span-2 border-t pt-4">
                    <label className={labelClass}>Product Images *</label>
                    <p className="font-montserrat text-xs text-gray-400 mb-3">Upload up to 5 images. The first image will be the primary photo.</p>

                    {/* Dropzone */}
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-royal-gold transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); handleFileSelect(e.dataTransfer.files); }}
                    >
                      <ImagePlus size={28} className="mx-auto text-gray-400 mb-2" />
                      <p className="font-montserrat text-sm text-gray-500">Click to upload or drag &amp; drop</p>
                      <p className="font-montserrat text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 8MB</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={e => handleFileSelect(e.target.files)}
                      />
                    </div>

                    {/* Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-3">
                        {imagePreviews.map((src, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                            <img src={src} alt="preview" className="w-full h-full object-cover" />
                            {uploadingImages.includes(src) ? (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => removeImage(idx)}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                              >
                                <X size={10} />
                              </button>
                            )}
                            {idx === 0 && <span className="absolute bottom-0 left-0 right-0 bg-royal-gold/80 text-white text-[9px] text-center font-montserrat py-0.5">Primary</span>}
                          </div>
                        ))}
                        {imagePreviews.length < 5 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-royal-gold hover:text-royal-gold transition-colors"
                          >
                            <Plus size={20} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Colors & Sizes */}
                  <div className="border-t pt-4">
                    <label className={labelClass}>Colors (Optional)</label>
                    {formData.colors.map((c, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input type="text" value={c} onChange={e => handleArrayChange('colors', i, e.target.value)} placeholder="E.g. Emerald Green" className={inputClass} />
                        {i > 0 && <button type="button" onClick={() => removeArrayItem('colors', i)} className="text-red-500 hover:text-red-700 px-2"><X size={16} /></button>}
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('colors')} className="text-xs font-montserrat text-royal-gold mt-1">+ Add color</button>
                  </div>

                  <div className="border-t pt-4">
                    <label className={labelClass}>Sizes (Optional)</label>
                    {formData.sizes.map((s, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <input type="text" value={s} onChange={e => handleArrayChange('sizes', i, e.target.value)} placeholder="E.g. M, L, XL" className={inputClass} />
                        {i > 0 && <button type="button" onClick={() => removeArrayItem('sizes', i)} className="text-red-500 hover:text-red-700 px-2"><X size={16} /></button>}
                      </div>
                    ))}
                    <button type="button" onClick={() => addArrayItem('sizes')} className="text-xs font-montserrat text-royal-gold mt-1">+ Add size</button>
                  </div>

                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={handleCloseModal} className="px-4 py-2 font-montserrat text-sm text-gray-600 hover:bg-gray-50 rounded">Cancel</button>
              <button type="submit" form="product-form" className="px-4 py-2 bg-royal-gold text-white font-montserrat text-sm rounded hover:bg-opacity-90">
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
