import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Trash2, Check, AlertCircle } from 'lucide-react';
import { Product, CollectionCategory, StockStatus } from '../types';

import { useCategories } from '../services/categoryService';

interface ProductModalProps {
  isOpen: boolean;
  productToEdit?: Product | null;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void;
}

const DEFAULT_CATEGORIES: CollectionCategory[] = [
  'Everyday Cotton',
  'Traditional Wear',
  'Festive Collection',
  'Contemporary Designs',
  'New Arrivals',
];

const COMMON_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size (5.5m)', 'Free Size (6.3m)'];

const CURATED_DEFAULT_IMAGES = [
  { label: 'Yazhini Kurti', path: '/product-yazhini.png' },
  { label: 'Sempon Kanchipuram Silk', path: '/product-sempon-selai.png' },
  { label: 'Neelamani Handloom', path: '/product-ananya.png' },
  { label: 'Kurinji Mustard Kurti', path: '/product-kurinji.png' },
  { label: 'Senthamarai Anarkali', path: '/product-kavya.png' },
  { label: 'Poonthalir Salwar', path: '/product-poonthalir.png' },
  { label: 'Meera Silk Salwar', path: '/product-meera.png' },
  { label: 'Venmathi Ivory Kurti', path: '/product-nila.png' },
  { label: 'Ponmayil Lehenga', path: '/product-ponmayil.png' },
  { label: 'Vaanathi Draped Saree', path: '/product-vaanathi.png' },
  { label: 'Neelamukil Co-ord', path: '/product-neelam.png' },
  { label: 'Thamarai Tiered Dress', path: '/product-senthamarai.png' },
  { label: 'Ivory Saree Editorial', path: '/Elegant Ivory Saree Editorial.png' },
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  productToEdit,
  onClose,
  onSave,
}) => {
  const dynamicCategories = useCategories(true);
  const categoryOptions = dynamicCategories.length > 0
    ? dynamicCategories.map((c) => c.name as CollectionCategory)
    : DEFAULT_CATEGORIES;

  const isEditing = Boolean(productToEdit);

  const [name, setName] = useState('');
  const [tamil, setTamil] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('குர்த்தி / Kurti');
  const [collectionCategory, setCollectionCategory] = useState<CollectionCategory>('Everyday Cotton');
  const [priceNumber, setPriceNumber] = useState<number>(1450);
  const [originalPrice, setOriginalPrice] = useState('');
  const [color, setColor] = useState('');
  const [stockStatus, setStockStatus] = useState<StockStatus>('in-stock');
  const [stockLabel, setStockLabel] = useState('In stock');
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [fabric, setFabric] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('/product-yazhini.png');
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setTamil(productToEdit.tamil || '');
      setSubtitle(productToEdit.subtitle || '');
      setCategory(productToEdit.category || 'குர்த்தி / Kurti');
      setCollectionCategory(productToEdit.collectionCategory || 'Everyday Cotton');
      setPriceNumber(productToEdit.priceNumber || 1450);
      setOriginalPrice(productToEdit.originalPrice || '');
      setColor(productToEdit.color || '');
      setStockStatus(productToEdit.stockStatus || 'in-stock');
      setStockLabel(productToEdit.stock || 'In stock');
      setSizes(productToEdit.sizes || ['S', 'M', 'L']);
      setFabric(productToEdit.fabric || '');
      setDescription(productToEdit.description || '');
      setImage(productToEdit.image || '/product-yazhini.png');
      setIsBestSeller(Boolean(productToEdit.isBestSeller));
      setIsNewArrival(Boolean(productToEdit.isNewArrival));
      setIsActive(productToEdit.isActive !== false);
    } else {
      // Reset defaults for creation
      setName('');
      setTamil('');
      setSubtitle('');
      setCategory('குர்த்தி / Kurti');
      setCollectionCategory('Everyday Cotton');
      setPriceNumber(1450);
      setOriginalPrice('');
      setColor('Handloom organic cotton');
      setStockStatus('in-stock');
      setStockLabel('In stock');
      setSizes(['S', 'M', 'L', 'XL']);
      setFabric('100% Breathable Organic Handloom Cotton');
      setDescription('Thoughtfully designed with fine heritage detailing, crafted exclusively for modern grace.');
      setImage('/product-yazhini.png');
      setIsBestSeller(false);
      setIsNewArrival(true);
      setIsActive(true);
    }
    setUploadError(null);
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSizeToggle = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please choose a valid image file (PNG, JPEG, WebP).');
      return;
    }

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size exceeds 5MB limit. Please upload a compressed image.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImage(dataUrl);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try again.');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Product name is required.');
      return;
    }

    const payload: Partial<Product> = {
      name: name.trim(),
      tamil: tamil.trim(),
      subtitle: subtitle.trim(),
      category: category.trim(),
      collectionCategory,
      priceNumber: Number(priceNumber),
      price: `₹${Number(priceNumber).toLocaleString('en-IN')}`,
      originalPrice: originalPrice ? (originalPrice.startsWith('₹') ? originalPrice : `₹${originalPrice}`) : undefined,
      color: color.trim(),
      stockStatus,
      stock: stockLabel.trim() || (stockStatus === 'in-stock' ? 'In stock' : stockStatus === 'low-stock' ? 'Only 2 left' : 'Out of stock'),
      sizes: sizes.length ? sizes : ['Free Size'],
      fabric: fabric.trim(),
      description: description.trim(),
      image,
      isBestSeller,
      isNewArrival,
      isActive,
    };

    onSave(payload);
  };

  return (
    <div className="product-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="product-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="product-modal-header">
          <div>
            <span className="product-modal-eyebrow">CATALOGUE MANAGEMENT</span>
            <h2 className="product-modal-title">
              {isEditing ? `Edit “${productToEdit?.name}”` : 'Create New Collection Piece'}
            </h2>
          </div>
          <button onClick={onClose} className="product-modal-close-btn" aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-modal-form">
          <div className="product-modal-grid">
            {/* Left Column: Essential Details */}
            <div className="product-modal-col">
              <div className="modal-field-group">
                <label className="modal-label">Product Name (English) *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Yazhini"
                  className="modal-input"
                />
              </div>

              <div className="modal-field-row">
                <div className="modal-field-group">
                  <label className="modal-label">Tamil Title (Optional)</label>
                  <input
                    type="text"
                    value={tamil}
                    onChange={(e) => setTamil(e.target.value)}
                    placeholder="e.g. யாழினி"
                    className="modal-input"
                  />
                </div>
                <div className="modal-field-group">
                  <label className="modal-label">Category Descriptor</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. குர்த்தி / Kurti"
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Editorial Subtitle</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Handloom-Inspired Cotton Kurti"
                  className="modal-input"
                />
              </div>

              <div className="modal-field-row">
                <div className="modal-field-group">
                  <label className="modal-label">Collection Group *</label>
                  <select
                    value={collectionCategory}
                    onChange={(e) => setCollectionCategory(e.target.value as CollectionCategory)}
                    className="modal-select"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-field-group">
                  <label className="modal-label">Price in INR (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={priceNumber}
                    onChange={(e) => setPriceNumber(Number(e.target.value))}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="modal-field-row">
                <div className="modal-field-group">
                  <label className="modal-label">Original Price (Strike-through)</label>
                  <input
                    type="text"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="e.g. ₹1,299"
                    className="modal-input"
                  />
                </div>

                <div className="modal-field-group">
                  <label className="modal-label">Stock Status</label>
                  <select
                    value={stockStatus}
                    onChange={(e) => {
                      const status = e.target.value as StockStatus;
                      setStockStatus(status);
                      if (status === 'in-stock') setStockLabel('In stock');
                      else if (status === 'low-stock') setStockLabel('Only 2 left');
                      else setStockLabel('Out of stock');
                    }}
                    className="modal-select"
                  >
                    <option value="in-stock">In Stock (Available)</option>
                    <option value="low-stock">Low Stock (Limited)</option>
                    <option value="out-of-stock">Out of Stock (Archived)</option>
                  </select>
                </div>
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Stock Badge Text</label>
                <input
                  type="text"
                  value={stockLabel}
                  onChange={(e) => setStockLabel(e.target.value)}
                  placeholder="e.g. In stock, Only 3 left"
                  className="modal-input"
                />
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Available Sizes</label>
                <div className="modal-size-chips">
                  {COMMON_SIZES.map((size) => {
                    const isSelected = sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`modal-size-chip ${isSelected ? 'active' : ''}`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Imagery & Rich Editorial Details */}
            <div className="product-modal-col">
              <div className="modal-field-group">
                <label className="modal-label">Product Visual Asset</label>
                <div className="modal-image-preview-card">
                  {image ? (
                    <div className="modal-image-preview-wrapper">
                      <img src={image} alt="Product visual" className="modal-image-preview" />
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="modal-image-remove-btn"
                        title="Remove visual"
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  ) : (
                    <div className="modal-image-placeholder">
                      <ImageIcon size={36} className="text-muted" />
                      <p>No image chosen</p>
                    </div>
                  )}

                  <div className="modal-upload-controls">
                    <label className="modal-file-upload-btn">
                      <Upload size={14} />
                      <span>{isUploading ? 'Processing…' : 'Upload Image (PNG/JPEG)'}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleImageFileChange}
                        className="hidden-file-input"
                      />
                    </label>

                    <div className="modal-curated-images">
                      <span className="curated-label">Or select existing asset:</span>
                      <div className="curated-thumbnails">
                        {CURATED_DEFAULT_IMAGES.map((img) => (
                          <button
                            key={img.path}
                            type="button"
                            title={img.label}
                            onClick={() => setImage(img.path)}
                            className={`curated-thumb-btn ${image === img.path ? 'active' : ''}`}
                          >
                            <img src={img.path} alt={img.label} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="modal-error-message">
                      <AlertCircle size={14} />
                      <span>{uploadError}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Color &amp; Hue Description</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Ruby red silk with antique gold zari"
                  className="modal-input"
                />
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Fabric &amp; Loom Specification</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. 100% Breathable Organic Handloom Cotton"
                  className="modal-input"
                />
              </div>

              <div className="modal-field-group">
                <label className="modal-label">Editorial Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the silhouette, weaving heritage, and artisan intent…"
                  className="modal-textarea"
                />
              </div>

              <div className="modal-toggles-card">
                <label className="modal-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isBestSeller}
                    onChange={(e) => setIsBestSeller(e.target.checked)}
                  />
                  <span>Feature as Best Seller (★ High Demand)</span>
                </label>

                <label className="modal-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isNewArrival}
                    onChange={(e) => setIsNewArrival(e.target.checked)}
                  />
                  <span>Mark as New Arrival (2026 Batch)</span>
                </label>

                <label className="modal-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                  />
                  <span>Active &amp; Visible on Public Storefront</span>
                </label>
              </div>
            </div>
          </div>

          <div className="product-modal-footer">
            <button type="button" onClick={onClose} className="modal-cancel-btn">
              Cancel
            </button>
            <button type="submit" className="modal-save-btn">
              <Check size={16} />
              <span>{isEditing ? 'Save Product Changes' : 'Publish to Storefront'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
