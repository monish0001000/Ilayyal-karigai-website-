import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle2,
  X,
  Layers,
  Sparkles,
  Package,
  RotateCcw,
} from 'lucide-react';
import { useProducts } from '../services/productService';
import { useCategories, categoryService } from '../services/categoryService';
import { CategoryItem } from '../types';

export const AdminCategories: React.FC = () => {
  const categories = useCategories(true);
  const products = useProducts(true);

  // Modal & Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    tamilName: '',
    description: '',
    signatureFabrics: '',
    isVisible: true,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete confirmation state
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const getProductCount = (categoryName: string) => {
    if (categoryName === 'New Arrivals') {
      return products.filter((p) => p.isNewArrival).length;
    }
    return products.filter((p) => p.collectionCategory === categoryName).length;
  };

  const getPreviewProducts = (categoryName: string) => {
    if (categoryName === 'New Arrivals') {
      return products.filter((p) => p.isNewArrival).slice(0, 4);
    }
    return products.filter((p) => p.collectionCategory === categoryName).slice(0, 4);
  };

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      tamilName: '',
      description: '',
      signatureFabrics: '',
      isVisible: true,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      tamilName: cat.tamilName || '',
      description: cat.description || '',
      signatureFabrics: cat.signatureFabrics?.join(', ') || '',
      isVisible: cat.isVisible !== false,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormError(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const name = formData.name.trim();
    if (!name) {
      setFormError('Category Name is required.');
      return;
    }

    if (!formData.description.trim()) {
      setFormError('Category Description is required.');
      return;
    }

    const fabrics = formData.signatureFabrics
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    setIsSaving(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, {
          name,
          tamilName: formData.tamilName.trim() || undefined,
          description: formData.description.trim(),
          signatureFabrics: fabrics,
          isVisible: formData.isVisible,
        });
        showToast(`Category "${name}" updated successfully.`);
      } else {
        await categoryService.addCategory({
          name,
          tamilName: formData.tamilName.trim() || undefined,
          slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          description: formData.description.trim(),
          signatureFabrics: fabrics,
          isVisible: formData.isVisible,
        });
        showToast(`New category "${name}" added to boutique catalog.`);
      }
      handleCloseModal();
    } catch (err: any) {
      setFormError(err.message || 'Unable to save category. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(deletingCategory.id);
      showToast(`Category "${deletingCategory.name}" was removed.`);
      setDeletingCategory(null);
    } catch (err: any) {
      alert(err.message || 'Could not delete category.');
    } finally {
      setIsDeleting(false);
    }
  };

  const totalLinkedProducts = useMemo(() => {
    return products.length;
  }, [products]);

  return (
    <div className="admin-categories-view">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="admin-toast success" role="status">
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="toast-close-btn"
            aria-label="Dismiss message"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Header and Action Bar */}
      <div className="categories-header-block">
        <div className="categories-header-text">
          <span className="categories-eyebrow">STORE TAXONOMY & CURATION</span>
          <h2 className="categories-title">Category Management</h2>
          <p className="categories-desc">
            Organize handcrafted garments into distinct collections. Changes directly update navigation and catalog filters across the storefront.
          </p>
        </div>
        <div className="categories-header-actions">
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all categories to original atelier defaults?')) {
                categoryService.resetToDefaults();
                showToast('Reset categories to boutique defaults.');
              }
            }}
            className="category-btn-secondary"
            title="Restore default categories"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="category-btn-primary"
            aria-label="Add new category"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="categories-summary-bar">
        <div className="summary-metric-pill">
          <Layers size={15} className="text-maroon" />
          <span><strong>{categories.length}</strong> Total Categories</span>
        </div>
        <div className="summary-metric-pill">
          <Eye size={15} className="text-maroon" />
          <span><strong>{categories.filter((c) => c.isVisible !== false).length}</strong> Visible on Storefront</span>
        </div>
        <div className="summary-metric-pill">
          <Package size={15} className="text-maroon" />
          <span><strong>{totalLinkedProducts}</strong> Active Pieces in Catalog</span>
        </div>
      </div>

      {/* Category Cards Grid */}
      {categories.length === 0 ? (
        <div className="categories-empty-state">
          <Layers size={48} className="empty-icon" />
          <h3>No Categories Found</h3>
          <p>You haven't defined any boutique categories yet. Create your first collection category to begin.</p>
          <button onClick={handleOpenAdd} className="category-btn-primary">
            <Plus size={16} />
            <span>Add First Category</span>
          </button>
        </div>
      ) : (
        <div className="categories-grid">
          {categories.map((cat) => {
            const count = getProductCount(cat.name);
            const previewItems = getPreviewProducts(cat.name);
            const isVisible = cat.isVisible !== false;

            return (
              <div key={cat.id} className={`category-card ${!isVisible ? 'is-hidden-card' : ''}`}>
                <div className="category-card-header">
                  <div className="category-card-titles">
                    <div className="cat-title-row">
                      <h3 className="category-name">{cat.name}</h3>
                      {isVisible ? (
                        <span className="cat-visibility-badge visible" title="Visible on Storefront">
                          <Eye size={12} />
                          <span>Visible</span>
                        </span>
                      ) : (
                        <span className="cat-visibility-badge hidden" title="Hidden from Public Storefront">
                          <EyeOff size={12} />
                          <span>Hidden</span>
                        </span>
                      )}
                    </div>
                    {cat.tamilName && (
                      <span className="category-tamil">{cat.tamilName}</span>
                    )}
                  </div>
                  <span className="category-count-badge">
                    {count} {count === 1 ? 'Piece' : 'Pieces'}
                  </span>
                </div>

                <p className="category-description">{cat.description}</p>

                {cat.signatureFabrics && cat.signatureFabrics.length > 0 && (
                  <div className="category-fabrics">
                    <span className="fabrics-label">Signature Weaves:</span>
                    <div className="fabrics-list">
                      {cat.signatureFabrics.map((f) => (
                        <span key={f} className="fabric-chip">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real product thumbnails */}
                <div className="category-preview-thumbs">
                  {previewItems.map((item) => (
                    <div key={item.id} className="cat-thumb-box" title={item.name}>
                      <img src={item.image} alt={item.name} />
                    </div>
                  ))}
                  {count > 4 && (
                    <div className="cat-thumb-more" title={`${count - 4} more products`}>
                      +{count - 4}
                    </div>
                  )}
                  {count === 0 && (
                    <span className="cat-no-thumbs">No products assigned yet</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="category-card-actions">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="cat-action-btn edit-btn"
                    aria-label={`Edit ${cat.name}`}
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingCategory(cat)}
                    className="cat-action-btn delete-btn"
                    aria-label={`Delete ${cat.name}`}
                  >
                    <Trash2 size={13} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="admin-modal-backdrop" onClick={handleCloseModal}>
          <div
            className="admin-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-modal-title"
          >
            <div className="admin-modal-header">
              <div>
                <span className="modal-eyebrow">
                  {editingCategory ? 'EDIT CLASSIFICATION' : 'NEW CLASSIFICATION'}
                </span>
                <h3 id="category-modal-title" className="modal-title">
                  {editingCategory ? `Edit "${editingCategory.name}"` : 'Add Collection Category'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="modal-close-btn"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="modal-error-alert" role="alert">
                <AlertTriangle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="admin-modal-form">
              <div className="modal-form-group">
                <label htmlFor="cat-name" className="modal-label">
                  Category Name <span className="required-star">*</span>
                </label>
                <input
                  id="cat-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Silk Cottons, Festive Collection"
                  required
                  className="modal-input"
                  autoFocus
                />
                <span className="field-hint">English display name visible in store navigation and filter tabs.</span>
              </div>

              <div className="modal-form-group">
                <label htmlFor="cat-tamil" className="modal-label">
                  Tamil Title (Optional)
                </label>
                <input
                  id="cat-tamil"
                  type="text"
                  value={formData.tamilName}
                  onChange={(e) => setFormData({ ...formData, tamilName: e.target.value })}
                  placeholder="e.g. பட்டு பருத்தி"
                  className="modal-input"
                />
                <span className="field-hint">Traditional Tamil script complement displayed alongside the English title.</span>
              </div>

              <div className="modal-form-group">
                <label htmlFor="cat-desc" className="modal-label">
                  Category Description <span className="required-star">*</span>
                </label>
                <textarea
                  id="cat-desc"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the fabric character, silhouette intent, and occasion for this collection..."
                  required
                  className="modal-textarea"
                />
              </div>

              <div className="modal-form-group">
                <label htmlFor="cat-fabrics" className="modal-label">
                  Signature Weaves & Fabrics (Optional)
                </label>
                <input
                  id="cat-fabrics"
                  type="text"
                  value={formData.signatureFabrics}
                  onChange={(e) => setFormData({ ...formData, signatureFabrics: e.target.value })}
                  placeholder="e.g. Mulberry Silk, Chettinad Slub, Pure Zari Korvai"
                  className="modal-input"
                />
                <span className="field-hint">Comma-separated list of signature craft weaves or materials.</span>
              </div>

              <div className="modal-form-checkbox-group">
                <label className="modal-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  />
                  <div>
                    <strong>Visible on Storefront</strong>
                    <p className="checkbox-sub">When unchecked, this category and its tab are hidden from customer view.</p>
                  </div>
                </label>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="modal-btn-cancel"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-btn-save"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving Changes…' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal with Product Warning */}
      {deletingCategory && (
        <div className="admin-modal-backdrop" onClick={() => setDeletingCategory(null)}>
          <div
            className="admin-modal-dialog delete-dialog"
            onClick={(e) => e.stopPropagation()}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <div className="delete-dialog-header">
              <div className="delete-icon-wrap">
                <AlertTriangle size={24} className="text-crimson" />
              </div>
              <div>
                <h3 id="delete-dialog-title" className="delete-title">
                  Delete Category: {deletingCategory.name}?
                </h3>
                <p className="delete-sub">
                  This action removes the collection classification from the boutique system.
                </p>
              </div>
            </div>

            {getProductCount(deletingCategory.name) > 0 ? (
              <div className="delete-product-warning">
                <AlertTriangle size={18} className="warning-icon" />
                <div className="warning-body">
                  <strong>
                    Warning: {getProductCount(deletingCategory.name)} Products Associated
                  </strong>
                  <p>
                    There are currently <strong>{getProductCount(deletingCategory.name)} live products</strong> categorized under "{deletingCategory.name}". Deleting this category will leave these pieces unassigned in collection filters.
                  </p>
                </div>
              </div>
            ) : (
              <p className="delete-safe-note">
                There are currently no products linked to this category. It is safe to remove.
              </p>
            )}

            <div className="delete-dialog-actions">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                className="modal-btn-cancel"
                disabled={isDeleting}
              >
                Keep Category
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="delete-confirm-btn"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting…' : 'Yes, Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
