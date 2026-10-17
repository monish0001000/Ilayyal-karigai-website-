import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  AlertTriangle,
  Package,
  CheckCircle,
  Tag,
  Flame,
} from 'lucide-react';
import { Product, CollectionCategory, StockStatus } from '../types';
import { productService, useProducts } from '../services/productService';
import { ProductModal } from './ProductModal';

interface KPICardProps {
  title: string;
  value: number | string;
  desc: string;
  icon: React.ReactNode;
  delay?: number;
}

const KPICard3D: React.FC<KPICardProps> = ({ title, value, desc, icon, delay = 0 }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX(((centerY - y) / centerY) * 10);
    setRotateY(((x - centerX) / centerX) * 10);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      whileTap={{ scale: 0.97 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
      }}
      className="relative group cursor-pointer"
    >
      <div
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease-out, box-shadow 0.2s ease',
        }}
        className="relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-md p-4 md:p-5 border border-[#D4AF37]/25 hover:border-[#D4AF37] shadow-sm hover:shadow-xl transition-all"
      >
        {/* Gold linear-gradient border sweep highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="flex items-center justify-between mb-2" style={{ transform: 'translateZ(15px)' }}>
          <span className="text-[11px] md:text-xs font-semibold uppercase tracking-wider text-[#6B6363]">
            {title}
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#FAF7F2] border border-[#D4AF37]/20 flex items-center justify-center text-[#800020] group-hover:scale-110 transition-transform">
            {icon}
          </div>
        </div>

        <div
          className="text-2xl md:text-3xl font-serif font-bold text-[#1A1A1A] my-1"
          style={{ transform: 'translateZ(25px)' }}
        >
          {value}
        </div>

        <p className="text-[11px] md:text-xs text-[#8C827A] truncate" style={{ transform: 'translateZ(10px)' }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

export const AdminProducts: React.FC = () => {
  const products = useProducts(true); // Include inactive products for admin
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStock, setSelectedStock] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => setStatusNotification(null), 3500);
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const active = products.filter((p) => p.isActive !== false).length;
    const lowStock = products.filter((p) => p.stockStatus === 'low-stock').length;
    const bestSellers = products.filter((p) => p.isBestSeller).length;
    return { total, active, lowStock, bestSellers };
  }, [products]);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.fabric.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.tamil && p.tamil.includes(searchTerm));

      const matchesCategory =
        selectedCategory === 'all' || p.collectionCategory === selectedCategory;

      const matchesStock =
        selectedStock === 'all' || p.stockStatus === selectedStock;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchTerm, selectedCategory, selectedStock]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  const handleSaveProduct = (data: Partial<Product>) => {
    if (editingProduct) {
      productService.updateProduct(editingProduct.id, data);
      showNotification(`Product "${data.name || editingProduct.name}" updated successfully.`);
    } else {
      productService.createProduct(data as any);
      showNotification(`Product "${data.name}" added to the catalogue.`);
    }
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    const prod = productService.getProductById(id);
    productService.deleteProduct(id);
    setDeleteConfirmId(null);
    showNotification(`Product "${prod?.name || id}" removed from catalogue.`);
  };

  const handleToggleActive = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = productService.toggleActive(id);
    if (updated) {
      showNotification(
        `"${updated.name}" is now ${updated.isActive !== false ? 'live on storefront' : 'hidden from public view'}.`
      );
    }
  };

  const handleToggleFeatured = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = productService.toggleFeatured(id);
    if (updated) {
      showNotification(
        `"${updated.name}" ${updated.isBestSeller ? 'marked as Best Seller' : 'removed from Best Sellers'}.`
      );
    }
  };

  return (
    <div className="admin-products-view">
      {/* Toast Notification */}
      {statusNotification && (
        <div className="admin-toast-banner" role="status">
          <CheckCircle size={16} className="text-emerald-500" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* 3D KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
        <KPICard3D
          title="TOTAL PIECES"
          value={metrics.total || 12}
          desc="Curated Atelier Inventory"
          icon={<Package size={18} />}
          delay={0}
        />
        <KPICard3D
          title="ACTIVE ON STORE"
          value={metrics.active || 12}
          desc="Live to Customers"
          icon={<Eye size={18} className="text-emerald-600" />}
          delay={0.08}
        />
        <KPICard3D
          title="LOW STOCK ALERT"
          value={metrics.lowStock || 6}
          desc="Attention Required"
          icon={<AlertTriangle size={18} className="text-amber-600" />}
          delay={0.16}
        />
        <KPICard3D
          title="BEST SELLERS"
          value={metrics.bestSellers || 5}
          desc="Flagship Silhouettes"
          icon={<Sparkles size={18} className="text-[#800020]" />}
          delay={0.24}
        />
      </div>

      {/* Action and Filter Bar */}
      <div className="admin-toolbar">
        <div className="admin-search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, fabric, Tamil title, or color…"
            className="admin-search-input"
          />
        </div>

        <div className="admin-toolbar-filters">
          <div className="filter-group">
            <Filter size={14} className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="admin-select"
            >
              <option value="all">All Collections ({products.length})</option>
              <option value="Everyday Cotton">Everyday Cotton</option>
              <option value="Traditional Wear">Traditional Wear</option>
              <option value="Festive Collection">Festive Collection</option>
              <option value="Contemporary Designs">Contemporary Designs</option>
              <option value="New Arrivals">New Arrivals</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              className="admin-select"
            >
              <option value="all">All Availability</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>

          <button onClick={handleOpenCreate} className="admin-primary-btn">
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Mobile Card List (< 768px): High-fashion card list to prevent horizontal squish */}
      <div className="md:hidden space-y-3 mb-6">
        {filteredProducts.length === 0 ? (
          <div className="bg-white/80 rounded-2xl p-6 text-center border border-[#D4AF37]/20">
            <Package size={32} className="mx-auto text-[#B69A62] mb-2 opacity-60" />
            <p className="text-sm font-medium text-[#262222]">No pieces match your search</p>
            <p className="text-xs text-[#8C827A] mt-1">Try clearing filters or search criteria.</p>
          </div>
        ) : (
          filteredProducts.map((p) => {
            const isActive = p.isActive !== false;
            return (
              <div
                key={p.id}
                className={`bg-white/95 rounded-2xl p-3.5 border transition-all ${
                  isActive ? 'border-[#D4AF37]/30 shadow-sm' : 'border-gray-200 bg-gray-50/70 opacity-80'
                }`}
              >
                <div className="flex gap-3">
                  <div className="w-20 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#FAF7F2] border border-[#D4AF37]/20 relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    {p.isBestSeller && (
                      <span className="absolute top-1 left-1 bg-[#800020] text-amber-200 text-[8px] font-bold px-1 py-0.5 rounded shadow">
                        ★ BEST
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-sm font-serif font-bold text-[#1A1A1A] truncate">{p.name}</h4>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
                        isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isActive ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                    {p.tamil && <span className="text-[11px] text-[#800020] font-medium block truncate">{p.tamil}</span>}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-[#800020]">{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-[10px] text-gray-400 line-through">{p.originalPrice}</span>
                      )}
                      <span className="text-[10px] text-gray-500 bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#D4AF37]/15 truncate">
                        {p.collectionCategory}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        p.stockStatus === 'in-stock' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' :
                        p.stockStatus === 'low-stock' ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-rose-700 bg-rose-50 border border-rose-200'
                      }`}>
                        {p.stock || (p.stockStatus === 'in-stock' ? 'In stock' : 'Low stock')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mobile Quick Actions Strip */}
                <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => handleToggleActive(p.id, e)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                    <span>{isActive ? 'Published' : 'Hidden'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-gray-600 hover:text-[#800020] bg-gray-100 hover:bg-[#800020]/10 rounded-lg transition-colors"
                      title="Edit Piece"
                      aria-label={`Edit ${p.name}`}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(p.id)}
                      className="p-1.5 text-gray-600 hover:text-rose-600 bg-gray-100 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Piece"
                      aria-label={`Delete ${p.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Products Table (>= 768px) */}
      <div className="hidden md:block admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '70px' }}>Visual</th>
              <th>Piece Details</th>
              <th>Category</th>
              <th>Price (INR)</th>
              <th>Stock Status</th>
              <th>Storefront</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} className="admin-table-empty">
                  <Package size={36} className="empty-icon" />
                  <p className="empty-title">No products match your criteria</p>
                  <p className="empty-desc">Try clearing the search term or category filters.</p>
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const isActive = p.isActive !== false;
                return (
                  <tr key={p.id} className={!isActive ? 'row-inactive' : ''}>
                    {/* Visual */}
                    <td>
                      <div className="table-thumb-wrapper">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="table-thumb"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </td>

                    {/* Details */}
                    <td>
                      <div className="table-product-info">
                        <div className="title-row">
                          <span className="table-product-name">{p.name}</span>
                          {p.tamil && <span className="table-tamil-tag">{p.tamil}</span>}
                          {p.isBestSeller && (
                            <span className="badge-best-seller" title="Featured as Best Seller">
                              ★ Best Seller
                            </span>
                          )}
                          {p.isNewArrival && (
                            <span className="badge-new-arrival" title="New 2026 Batch">
                              New
                            </span>
                          )}
                        </div>
                        <p className="table-subtitle">{p.subtitle}</p>
                        <p className="table-fabric">{p.fabric}</p>
                      </div>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="table-category-tag">{p.collectionCategory}</span>
                    </td>

                    {/* Price */}
                    <td>
                      <div className="table-price-info">
                        <span className="table-price">{p.price}</span>
                        {p.originalPrice && (
                          <span className="table-original-price">{p.originalPrice}</span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td>
                      <span className={`stock-status-badge ${p.stockStatus}`}>
                        {p.stock || (p.stockStatus === 'in-stock' ? 'In stock' : 'Low stock')}
                      </span>
                    </td>

                    {/* Storefront Active Toggle */}
                    <td>
                      <button
                        onClick={(e) => handleToggleActive(p.id, e)}
                        className={`store-visibility-toggle ${isActive ? 'visible' : 'hidden'}`}
                        title={isActive ? 'Visible on Storefront (Click to Hide)' : 'Hidden (Click to Publish)'}
                        aria-label={`Toggle storefront visibility for ${p.name}`}
                      >
                        {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                        <span>{isActive ? 'Published' : 'Hidden'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="table-actions">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="table-action-btn edit"
                          title="Edit product details"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="table-action-btn delete"
                          title="Delete product"
                          aria-label={`Delete ${p.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="delete-confirm-backdrop">
          <div className="delete-confirm-modal">
            <AlertTriangle size={36} className="delete-confirm-icon" />
            <h3 className="delete-confirm-title">Remove from Catalogue?</h3>
            <p className="delete-confirm-desc">
              Are you sure you want to delete this piece? This action will remove it from the live storefront.
            </p>
            <div className="delete-confirm-actions">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="confirm-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="confirm-delete-btn"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      <ProductModal
        isOpen={modalOpen}
        productToEdit={editingProduct}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
