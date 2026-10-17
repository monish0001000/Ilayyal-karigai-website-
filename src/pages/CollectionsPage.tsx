import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  LayoutGrid,
  Columns,
  Search,
  X,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Product } from '../types';
import { useProducts } from '../services/productService';
import { useCategories } from '../services/categoryService';
import { CategoryFilterBar, CategoryFilterItem } from '../components/CategoryFilterBar';
import { ProductCard3D } from '../components/ProductCard3D';
import { WhatsAppInquiryModal } from '../components/WhatsAppInquiryModal';
import { useLocale } from '../context/LocaleContext';

interface CollectionsPageProps {
  onNavigateHome: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, e: React.MouseEvent) => void;
  savedProducts: string[];
  onToggleSaveProduct: (name: string, e: React.MouseEvent) => void;
  initialCategory?: string;
}

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'bestsellers' | 'newest';

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  onNavigateHome,
  onSelectProduct,
  onAddToCart,
  savedProducts,
  onToggleSaveProduct,
  initialCategory = 'all',
}) => {
  const { locale, setLocale, t, getProductName, getProductSubtitle } = useLocale();
  const products = useProducts();
  const dbCategories = useCategories(false);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [selectedFabric, setSelectedFabric] = useState<string>('all');
  const [gridMode, setGridMode] = useState<'editorial' | 'compact'>('editorial');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  // WhatsApp Inquiry Modal state
  const [inquiryProduct, setInquiryProduct] = useState<Product | null>(null);

  // Build dynamic categories list for the filter bar
  const filterCategories = useMemo<CategoryFilterItem[]>(() => {
    const list: CategoryFilterItem[] = [
      {
        key: 'all',
        english: 'All Collections',
        tamil: 'அனைத்தும்',
        count: products.length,
      },
    ];

    dbCategories.forEach((cat) => {
      const count =
        cat.name === 'New Arrivals'
          ? products.filter((p) => p.isNewArrival).length
          : products.filter((p) => p.collectionCategory === cat.name).length;

      list.push({
        key: cat.name,
        english: cat.name,
        tamil: cat.tamilName || cat.name,
        count,
      });
    });

    // Add Best Sellers
    list.push({
      key: 'Best Sellers',
      english: 'Verified Best Sellers',
      tamil: 'சிறந்த தேர்வு',
      count: products.filter((p) => p.isBestSeller).length,
    });

    return list;
  }, [products, dbCategories]);

  // Extract all unique fabric types for filter drawer
  const allFabrics = useMemo(() => {
    const fabrics = new Set<string>();
    products.forEach((p) => {
      if (p.fabric) {
        const primary = p.fabric.split(' ')[0];
        if (primary) fabrics.add(primary);
      }
    });
    return Array.from(fabrics);
  }, [products]);

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'New Arrivals') {
        result = result.filter((p) => p.isNewArrival);
      } else if (selectedCategory === 'Best Sellers') {
        result = result.filter((p) => p.isBestSeller);
      } else {
        result = result.filter((p) => p.collectionCategory === selectedCategory);
      }
    }

    // Fabric filter
    if (selectedFabric !== 'all') {
      result = result.filter((p) =>
        p.fabric.toLowerCase().includes(selectedFabric.toLowerCase())
      );
    }

    // In-stock only filter
    if (inStockOnly) {
      result = result.filter((p) => p.stockStatus !== 'out-of-stock');
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tamil.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q)
      );
    }

    // Sort options
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.priceNumber - b.priceNumber);
        break;
      case 'price-desc':
        result.sort((a, b) => b.priceNumber - a.priceNumber);
        break;
      case 'bestsellers':
        result.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
      case 'newest':
        result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case 'featured':
      default:
        // Keep curated order
        break;
    }

    return result;
  }, [products, selectedCategory, selectedFabric, inStockOnly, searchQuery, sortOption]);

  const activeCategoryMeta = useMemo(() => {
    const item = filterCategories.find((c) => c.key === selectedCategory);
    return item || filterCategories[0];
  }, [filterCategories, selectedCategory]);

  return (
    <main className="collections-archive-page">
      {/* Editorial Header Bar */}
      <header className="archive-top-nav">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateHome();
          }}
          className="archive-back-link"
        >
          <ArrowLeft size={16} />
          <span>{locale === 'ta' ? 'முகப்புக்கு திரும்புக' : 'Return Home'}</span>
        </a>

        <div className="archive-brand-center">
          <h1 className="brand-wordmark-title" onClick={onNavigateHome}>
            {locale === 'ta' ? 'இளையள் காரிகை' : 'ELAIYAL KARIGAI'}
          </h1>
        </div>

        <div className="archive-top-actions flex items-center gap-3">
          {/* Minimal Pill Toggle in Header (EN | தமிழ்) with subtle active gold glow */}
          <div
            className="flex items-center bg-[#f2ede4] border border-[#D4AF37]/40 rounded-full p-0.5 text-[11px] font-medium tracking-wide shadow-2xs"
            role="radiogroup"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`px-2.5 py-0.5 rounded-full transition-all duration-200 cursor-pointer ${
                locale === 'en'
                  ? 'bg-white text-[#800020] font-semibold shadow-[0_0_10px_rgba(212,175,55,0.45)] border border-[#D4AF37]/40'
                  : 'text-[#1A1A1A]/70 hover:text-[#800020]'
              }`}
              aria-checked={locale === 'en'}
              role="radio"
            >
              EN
            </button>
            <span className="text-[#D4AF37]/60 text-[10px] px-0.5 select-none font-light">|</span>
            <button
              type="button"
              onClick={() => setLocale('ta')}
              className={`px-2.5 py-0.5 rounded-full transition-all duration-200 cursor-pointer ${
                locale === 'ta'
                  ? 'bg-white text-[#800020] font-semibold shadow-[0_0_10px_rgba(212,175,55,0.45)] border border-[#D4AF37]/40'
                  : 'text-[#1A1A1A]/70 hover:text-[#800020]'
              }`}
              aria-checked={locale === 'ta'}
              role="radio"
            >
              தமிழ்
            </button>
          </div>

          <span className="archive-count-pill">
            <strong>{processedProducts.length}</strong> {locale === 'ta' ? 'ஆடைகள்' : 'Pieces'}
          </span>
        </div>
      </header>

      {/* Hero Section: Single-locale display & poetic narrative */}
      <section className="archive-hero-banner">
        <div className="archive-hero-content">
          <span className="archive-eyebrow">
            {t.archive.editorial_badge}
          </span>
          <h2 className="archive-hero-headline">
            {selectedCategory === 'all'
              ? t.archive.headline
              : (locale === 'ta' ? (activeCategoryMeta.tamil || activeCategoryMeta.english) : `${activeCategoryMeta.english} Collection.`)}
          </h2>
          <p className="archive-hero-subtext">
            {t.archive.subtext}
          </p>

          <div className="archive-hero-metrics">
            <span className="hero-metric-badge">
              <Sparkles size={12} className="text-antique-gold" />
              <span>{locale === 'ta' ? 'அங்கீகரிக்கப்பட்ட கைத்தறி & பட்டுத் தரம்' : 'Certified Handloom & Silk Authenticity'}</span>
            </span>
            <span className="hero-metric-badge">
              <span>{t.archive.pieces_available.replace('{count}', processedProducts.length.toString())}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Sticky Glassmorphic Category Filter Bar */}
      <div className="sticky-filter-boundary">
        <CategoryFilterBar
          categories={filterCategories}
          activeCategory={selectedCategory}
          onSelectCategory={(key) => setSelectedCategory(key)}
          className="archive-sticky-filter-bar"
        />
      </div>

      {/* Controls Toolbar: Search, Sort Dropdown, Filter Toggle & Grid Switch */}
      <div className="archive-toolbar">
        {/* Search input */}
        <div className="archive-search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.archive.search_placeholder}
            className="archive-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="search-clear-btn"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="archive-toolbar-right">
          {/* Real-time Sort Dropdown */}
          <div className="archive-sort-wrapper">
            <label htmlFor="archive-sort-select" className="sort-label">
              {t.archive.sort_by}
            </label>
            <select
              id="archive-sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="archive-sort-select"
            >
              <option value="featured">{t.archive.sort_featured}</option>
              <option value="price-asc">{t.archive.sort_price_asc}</option>
              <option value="price-desc">{t.archive.sort_price_desc}</option>
              <option value="bestsellers">{t.archive.sort_bestsellers}</option>
              <option value="newest">{t.archive.sort_newest}</option>
            </select>
          </div>

          {/* Filter Drawer Toggle */}
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className={`archive-filter-btn ${filterDrawerOpen ? 'is-active' : ''}`}
            aria-expanded={filterDrawerOpen}
          >
            <SlidersHorizontal size={14} />
            <span>{t.archive.filters_btn}</span>
            {(selectedFabric !== 'all' || inStockOnly) && (
              <span className="filter-active-dot" />
            )}
          </button>

          {/* Dynamic Grid Layout Switch (Desktop only) */}
          <div className="archive-grid-switch" role="group" aria-label="Grid density">
            <button
              type="button"
              className={`grid-btn ${gridMode === 'editorial' ? 'is-active' : ''}`}
              onClick={() => setGridMode('editorial')}
              title="Editorial 3-Column View"
              aria-label="Editorial View"
            >
              <Columns size={16} />
            </button>
            <button
              type="button"
              className={`grid-btn ${gridMode === 'compact' ? 'is-active' : ''}`}
              onClick={() => setGridMode('compact')}
              title="Compact 4-Column View"
              aria-label="Compact View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Filter Drawer */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <motion.div
            className="archive-drawer-container"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="archive-drawer-inner">
              {/* Fabric Type Pills */}
              <div className="drawer-filter-group">
                <span className="drawer-group-title">{t.archive.fabric_heading}:</span>
                <div className="drawer-chips-row">
                  <button
                    type="button"
                    onClick={() => setSelectedFabric('all')}
                    className={`drawer-chip ${selectedFabric === 'all' ? 'is-active' : ''}`}
                  >
                    {locale === 'ta' ? 'அனைத்து இழைகள்' : 'All Weaves'}
                  </button>
                  {allFabrics.map((fab) => (
                    <button
                      key={fab}
                      type="button"
                      onClick={() => setSelectedFabric(fab)}
                      className={`drawer-chip ${selectedFabric === fab ? 'is-active' : ''}`}
                    >
                      {fab}
                    </button>
                  ))}
                </div>
              </div>

              {/* In-Stock Toggle */}
              <div className="drawer-filter-group">
                <span className="drawer-group-title">
                  {locale === 'ta' ? 'இருப்பு நிலை:' : 'Availability:'}
                </span>
                <label className="drawer-checkbox-label">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span>{t.archive.in_stock_only}</span>
                </label>
              </div>

              {/* Reset Filters */}
              {(selectedFabric !== 'all' || inStockOnly || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFabric('all');
                    setInStockOnly(false);
                    setSearchQuery('');
                  }}
                  className="drawer-reset-btn"
                >
                  <RotateCcw size={13} />
                  <span>{t.archive.reset_filters}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Grid Section with 3D Card Architecture */}
      <section className="archive-grid-section">
        {processedProducts.length === 0 ? (
          <div className="archive-empty-state">
            <Sparkles size={40} className="empty-icon text-antique-gold" />
            <h3>{t.archive.no_results}</h3>
            <p>
              {locale === 'ta'
                ? 'உங்கள் வடிகட்டல்களுக்கு பொருந்தக்கூடிய தயாரிப்புகள் எதுவும் இல்லை.'
                : `No items match your active filters (${selectedCategory !== 'all' ? selectedCategory : ''}${selectedFabric !== 'all' ? ` · ${selectedFabric}` : ''}).`}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedFabric('all');
                setInStockOnly(false);
                setSearchQuery('');
              }}
              className="archive-empty-reset-btn"
            >
              {locale === 'ta' ? 'முழு தொகுப்பையும் காண்க' : 'View Full Atelier Catalogue'}
            </button>
          </div>
        ) : (
          <div className={`archive-products-grid ${gridMode === 'compact' ? 'grid-compact-mode' : 'grid-editorial-mode'}`}>
            {processedProducts.map((product, idx) => (
              <ProductCard3D
                key={product.id}
                product={product}
                index={idx}
                layoutVariant={gridMode}
                isSaved={savedProducts.includes(product.name)}
                onToggleSave={onToggleSaveProduct}
                onQuickView={onSelectProduct}
                onAddToCart={onAddToCart}
                onOpenWhatsAppInquiry={(prod) => setInquiryProduct(prod)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="archive-page-footer">
        <p className="footer-tagline">
          Crafted with intent.
          <br />
          Designed for today.
        </p>
        <button onClick={onNavigateHome} className="footer-return-btn">
          <span>{locale === 'ta' ? 'முகப்புக்கு திரும்புக' : 'Return to Homepage'}</span>
          <ArrowRight size={15} />
        </button>
      </footer>

      {/* WhatsApp Quick Inquiry Modal */}
      <WhatsAppInquiryModal
        product={inquiryProduct}
        isOpen={Boolean(inquiryProduct)}
        onClose={() => setInquiryProduct(null)}
      />
    </main>
  );
};
