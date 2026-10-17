import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
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
  const { t, locale, getProductName, getProductSubtitle, getProductCategory, getProductFabric } = useLocale();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Detect touch devices on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(hover: none)').matches;
      setIsTouchDevice(isTouch);
    }
  }, []);

  // Motion values for smooth cursor tracking
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth spring physics for 3D rotation (constrained strictly to max 8-10deg)
  const springConfig = { damping: 22, stiffness: 320, mass: 0.18 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), springConfig);

  // Glare position calculation
  const glareX = useTransform(mouseX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(mouseY, [0, 1], ['0%', '100%']);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isTouchDevice || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    },
    [isTouchDevice, mouseX, mouseY]
  );

  const handleMouseEnter = () => {
    if (!isTouchDevice) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Secondary reveal image fallback to craft detail
  const secondaryImage = product.secondaryImage || '/ilayyal-craft-detail.png';

  // Strict localized display values (NO mixed bilingual strings)
  const displayName = getProductName(product);
  const displaySubtitle = getProductSubtitle(product);
  const displayCategory = getProductCategory(product);
  const displayFabric = getProductFabric(product);

  // Localized badge text
  const stockCountMatch = product.stock.match(/\d+/);
  const stockCount = stockCountMatch ? stockCountMatch[0] : '2';
  const lowStockLabel = locale === 'ta'
    ? t.cards.only_left.replace('{count}', stockCount)
    : product.stock.toUpperCase();

  return (
    <motion.div
      ref={cardRef}
      className={`card-3d-perspective-shell ${layoutVariant === 'compact' ? 'is-compact' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.45,
        delay: Math.min((index % 6) * 0.05, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.article
        className="card-3d-inner group"
        style={{
          rotateX: isTouchDevice ? 0 : rotateX,
          rotateY: isTouchDevice ? 0 : rotateY,
        }}
        whileTap={{ scale: 0.985 }}
      >
        {/* Dynamic Glare Overlay on Desktop Hover */}
        {!isTouchDevice && isHovered && (
          <motion.div
            className="card-glare-overlay pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glareX.get()} ${glareY.get()}, rgba(255, 255, 255, 0.28) 0%, rgba(212, 175, 55, 0.12) 35%, transparent 65%)`,
            }}
            aria-hidden="true"
          />
        )}

        {/* 
          Image Container: group relative overflow-hidden aspect-[4/5]
          Fixed aspect ratio eliminates Cumulative Layout Shift (CLS)
          Base image layer at translateZ(0px)
        */}
        <div
          className="card-image-wrapper group relative overflow-hidden aspect-[4/5] w-full"
          style={{ transform: 'translateZ(0px)' }}
          onClick={() => onQuickView?.(product)}
        >
          {/* Primary Product Image */}
          <img
            src={product.image}
            alt={`${displayName} - ${displaySubtitle}`}
            loading="lazy"
            className="card-img-primary object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Secondary Cross-fade Reveal on Desktop Hover */}
          {!isTouchDevice && (
            <img
              src={secondaryImage}
              alt={`${displayName} craft detail`}
              loading="lazy"
              className="card-img-secondary object-cover w-full h-full transition-opacity duration-500 ease-out"
            />
          )}

          {/* Floating 3D Badges (translateZ: 35px) */}
          <div
            className="card-floating-badges pointer-events-none"
            style={{ transform: 'translateZ(35px)' }}
          >
            {product.isNewArrival && (
              <span className="card-badge badge-new">
                <Sparkles size={10} />
                {t.cards.new_arrival.toUpperCase()}
              </span>
            )}
            {product.stockStatus === 'low-stock' && (
              <span className="card-badge badge-low-stock">
                {lowStockLabel}
              </span>
            )}
            {product.isBestSeller && !product.isNewArrival && (
              <span className="card-badge badge-bestseller">
                ★ {t.cards.bestseller.toUpperCase()}
              </span>
            )}
          </div>

          {/* Floating Wishlist Save Button (translateZ: 35px) */}
          <button
            type="button"
            className={`card-floating-save-btn ${isSaved ? 'is-saved' : ''}`}
            onClick={(e) => onToggleSave?.(product.name, e)}
            aria-label={`Save ${displayName} to wishlist`}
            style={{ transform: 'translateZ(35px)' }}
          >
            <Heart
              size={16}
              fill={isSaved ? '#800020' : 'none'}
              color={isSaved ? '#800020' : '#1A1A1A'}
            />
          </button>

          {/* 
            Persistent Quick Action Overlay: 
            Always visible by default across all devices ("yeppayumeh theriyanum")
            Continuous persistent hit-box spanning full bottom edge
          */}
          <div
            className="card-hover-actions-overlay pointer-events-auto opacity-100 translate-y-0"
            style={{ transform: 'translateZ(30px)' }}
          >
            <button
              type="button"
              className="card-quick-view-btn"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView?.(product);
              }}
            >
              <Eye size={14} />
              <span>{t.cards.quick_view}</span>
            </button>
            <button
              type="button"
              className="card-quick-bag-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(product, product.sizes[0] || 'Standard', e);
              }}
              title={t.cards.add_to_bag}
            >
              <ShoppingBag size={14} />
              <span>{t.cards.add_to_bag}</span>
            </button>
          </div>
        </div>

        {/* Card Metadata Container (translateZ: 25px) */}
        <div className="card-meta-container" style={{ transform: 'translateZ(25px)' }}>
          <div className="card-category-strip">
            <span className="card-collection-tag">{displayCategory}</span>
            <span className="card-fabric-tag">{displayFabric}</span>
          </div>

          {/* Strict Single Locale Title (no dual bilingual slash or dot) */}
          <h3
            className="card-tamil-title"
            onClick={() => onQuickView?.(product)}
          >
            {displayName}
          </h3>

          <p className="card-subtitle">{displaySubtitle}</p>

          {/* Price & Direct WhatsApp Concierge Trigger (translateZ: 30px) */}
          <div className="card-footer-row" style={{ transform: 'translateZ(30px)' }}>
            <div className="card-pricing-block">
              <span className="card-price-primary">{product.price}</span>
              {product.originalPrice && (
                <span className="card-price-strike">{product.originalPrice}</span>
              )}
            </div>

            <button
              type="button"
              className="card-wa-concierge-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpenWhatsAppInquiry?.(product);
              }}
              title="Order or enquire directly on WhatsApp"
              aria-label={`Enquire about ${displayName} on WhatsApp`}
            >
              <WhatsAppIcon size={14} />
              <span>{t.cards.enquire}</span>
            </button>
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
};
