import React, { useState, useMemo } from 'react';
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

      {/* Metrics Row */}
      <div className="admin-metrics-row">
        <div className="admin-metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Pieces</span>
            <Package size={18} className="metric-icon" />
          </div>
          <div className="metric-value">{metrics.total}</div>
          <span className="metric-sub">Curated Atelier Inventory</span>
        </div>

        <div className="admin-metric-card">
          <div className="metric-header">
            <span className="metric-label">Active on Store</span>
            <Eye size={18} className="metric-icon text-emerald-600" />
          </div>
          <div className="metric-value">{metrics.active}</div>
          <span className="metric-sub">Live to Boutique Customers</span>
        </div>

        <div className="admin-metric-card">
          <div className="metric-header">
            <span className="metric-label">Low Stock Alert</span>
            <AlertTriangle size={18} className="metric-icon text-amber-600" />
          </div>
          <div className="metric-value">{metrics.lowStock}</div>
          <span className="metric-sub">Under 3 pieces remaining</span>
        </div>

        <div className="admin-metric-card">
          <div className="metric-header">
            <span className="metric-label">Best Sellers</span>
            <Flame size={18} className="metric-icon text-maroon" />
          </div>
          <div className="metric-value">{metrics.bestSellers}</div>
          <span className="metric-sub">High demand handloom pieces</span>
        </div>
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

      {/* Products Table */}
      <div className="admin-table-container">
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
