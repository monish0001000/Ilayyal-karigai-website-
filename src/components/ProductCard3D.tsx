import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';
import { useLocale } from '../context/LocaleContext';

interface ProductCard3DProps {
  product: Product;
  isSaved?: boolean;
  onToggleSave?: (productName: string, e: React.MouseEvent) => void;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (product: Product, size: string, e: React.MouseEvent) => void;
  onOpenWhatsAppInquiry?: (product: Product) => void;
  layoutVariant?: 'editorial' | 'compact';
  index?: number;
}

export const ProductCard3D: React.FC<ProductCard3DProps> = ({
  product,
  isSaved = false,
  onToggleSave,
  onQuickView,
  onAddToCart,
  onOpenWhatsAppInquiry,
  layoutVariant = 'editorial',
  index = 0,
}) => {
  const { locale, t, getProductName, getProductSubtitle } = useLocale();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Check if touch device on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      );
    }
  }, []);

  const isOutOfStock = product.stockStatus === 'out-of-stock';
  const secondaryImage = product.secondaryImage || '/ilayyal-craft-detail.png';
  const displayName = getProductName(product);
  const displaySubtitle = getProductSubtitle(product);

  const waInquiryUrl = `https://api.whatsapp.com/send?phone=919840182019&text=${encodeURIComponent(
    `Hello ELAIYAL KARIGAI, I am interested in ordering: ${product.name} (SKU: ${product.id}, Price: ${product.price})`
  )}`;

  return (
    <motion.div
      ref={cardRef}
      className={`card-3d-perspective-shell ${layoutVariant === 'compact' ? 'is-compact' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min((index % 6) * 0.04, 0.25), ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.article
        className="card-3d-inner"
        whileTap={{ scale: 0.985 }}
      >
        {/* 4:5 Portrait Image Wrapper with Smooth Zoom */}
        <div
          className="group relative overflow-hidden card-image-wrapper aspect-[4/5] bg-[#FAF7F2] cursor-pointer"
          onClick={() => onQuickView?.(product)}
        >
          <img
            src={product.image}
            alt={displayName}
            loading="lazy"
            className="card-img-primary w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />

          {/* Secondary Cross-fade Reveal on Hover (Desktop) */}
          {!isTouchDevice && (
            <img
              src={secondaryImage}
              alt={`${displayName} craft detail`}
              loading="lazy"
              className="card-img-secondary absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-400 ease-out group-hover:opacity-100 pointer-events-none"
            />
          )}

          {/* Floating Badges */}
          <div className="card-floating-badges">
            {product.isNewArrival && (
              <span className="card-badge badge-new">
                <Sparkles size={10} />
                {t.cards.new_arrival.toUpperCase()}
              </span>
            )}
            {product.stockStatus === 'low-stock' && (
              <span className="card-badge badge-low-stock">
                {product.stock.toUpperCase()}
              </span>
            )}
            {product.isBestSeller && !product.isNewArrival && (
              <span className="card-badge badge-bestseller">
                ★ {t.cards.bestseller.toUpperCase()}
              </span>
            )}
          </div>

          {/* Floating Save Button */}
          <button
            type="button"
            className={`card-floating-save-btn ${isSaved ? 'is-saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave?.(product.name, e);
            }}
            aria-label={`Save ${displayName} to wishlist`}
          >
            <Heart size={16} fill={isSaved ? '#800020' : 'none'} color={isSaved ? '#800020' : '#1A1A1A'} />
          </button>

          {/* Desktop Floating Action Dock (ONLY rendered and visible on screens >= 768px, slides up on hover) */}
          <div
            className="hidden md:flex card-hover-actions-overlay absolute bottom-3 left-3 right-3 gap-2 z-30 pointer-events-none group-hover:pointer-events-auto opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 ease-out"
          >
            <button
              type="button"
              className="card-quick-view-btn flex-1 py-2 px-3 rounded-lg bg-white/95 border border-[#D4AF37]/40 hover:bg-[#800020] hover:text-[#FAF7F2] text-[#26050C] text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer relative z-35"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView?.(product);
              }}
            >
              <Eye size={13} />
              <span>{t.cards.quick_view}</span>
            </button>
            <button
              type="button"
              disabled={isOutOfStock}
              className={`card-quick-bag-btn flex-1 py-2 px-3 rounded-lg ${
                isOutOfStock
                  ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                  : 'bg-[#800020] text-[#FAF7F2] hover:bg-[#5C0A15] cursor-pointer'
              } text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 shadow-md active:scale-95 relative z-35`}
              onClick={(e) => {
                e.stopPropagation();
                if (!isOutOfStock) {
                  onAddToCart?.(product, product.sizes[0] || 'Standard', e);
                }
              }}
              title={isOutOfStock ? 'Sold Out' : 'Add to shopping bag'}
            >
              <ShoppingBag size={13} />
              <span>{isOutOfStock ? 'Sold Out' : t.cards.add_to_bag}</span>
            </button>
          </div>
        </div>

        {/* Mobile Persistent Action Button Strip directly below image (ONLY for screens < 768px) */}
        <div className="flex md:hidden items-center gap-2 p-2.5 bg-[#FAF7F2] border-b border-[#D4AF37]/20 relative z-20">
          <button
            type="button"
            className="card-mobile-quick-btn flex-1 py-2 px-2.5 rounded-lg bg-white border border-[#D4AF37]/40 text-[#800020] text-xs font-semibold flex items-center justify-center gap-1.5 active:bg-[#800020] active:text-white transition-colors cursor-pointer shadow-xs"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView?.(product);
            }}
          >
            <Eye size={13} />
            <span>{t.cards.quick_view}</span>
          </button>
          <button
            type="button"
            disabled={isOutOfStock}
            className={`card-mobile-quick-btn flex-1 py-2 px-2.5 rounded-lg ${
              isOutOfStock
                ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                : 'bg-[#800020] text-[#FAF7F2] active:bg-[#5C0A15] cursor-pointer'
            } text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs`}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) {
                onAddToCart?.(product, product.sizes[0] || 'Standard', e);
              }
            }}
          >
            <ShoppingBag size={13} />
            <span>{isOutOfStock ? 'Sold Out' : t.cards.add_to_bag}</span>
          </button>
        </div>

        {/* Card Metadata Details */}
        <div className="card-meta-container p-4 relative z-10">
          <div className="card-category-strip flex items-center justify-between text-[11px] font-mono text-[#787269] mb-1.5">
            <span className="card-collection-tag font-semibold text-[#800020]">
              {product.collectionCategory}
            </span>
            <span className="card-fabric-tag">{product.fabric.split(' ')[0]}</span>
          </div>

          <h3
            className="card-title font-serif text-base font-bold text-[#26050C] tracking-wide cursor-pointer hover:text-[#800020] transition-colors leading-snug line-clamp-1"
            onClick={() => onQuickView?.(product)}
            title={displayName}
          >
            {displayName}
          </h3>

          <p className="card-subtitle text-xs text-[#787269] line-clamp-1 mt-0.5">
            {displaySubtitle}
          </p>

          {/* Price & Direct WhatsApp Concierge Trigger */}
          <div className="card-footer-row flex items-center justify-between mt-3 pt-2.5 border-t border-[#D4AF37]/20 relative z-20">
            <div className="card-pricing-block flex items-baseline gap-2">
              <span className="card-price-primary font-serif font-bold text-base text-[#800020]">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="card-price-strike text-xs line-through text-[#787269]">
                  {product.originalPrice}
                </span>
              )}
            </div>

            <button
              type="button"
              className="card-wa-concierge-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366] text-[#128C7E] hover:text-white border border-[#25D366]/30 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95 cursor-pointer relative z-30"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenWhatsAppInquiry) {
                  onOpenWhatsAppInquiry(product);
                } else {
                  window.open(waInquiryUrl, '_blank', 'noopener,noreferrer');
                }
              }}
              title="Order or enquire directly on WhatsApp"
              aria-label={`Enquire about ${product.name} on WhatsApp`}
            >
              <WhatsAppIcon size={13} />
              <span>{t.cards.enquire}</span>
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
};
