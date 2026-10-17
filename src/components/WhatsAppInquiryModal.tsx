import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { Product } from '../types';
import { WhatsAppIcon } from './WhatsAppIcon';

interface WhatsAppInquiryModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppInquiryModal: React.FC<WhatsAppInquiryModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [customNote, setCustomNote] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Initialize selected size when product changes
  React.useEffect(() => {
    if (product && product.sizes && product.sizes.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  if (!isOpen || !product) return null;

  const getWhatsAppMessage = () => {
    return (
      `Hello Ilayal Karigai (+91 98401 82019), I would like to enquire about purchasing this handcrafted piece:\n\n` +
      `✦ Product: ${product.name} (${product.tamil})\n` +
      `✦ SKU Reference: IK-${product.id.toUpperCase()}\n` +
      `✦ Price: ${product.price}\n` +
      `✦ Fabric: ${product.fabric}\n` +
      `✦ Palette: ${product.color}\n` +
      `✦ Selected Size: ${selectedSize || 'Standard'}\n` +
      (customNote.trim() ? `✦ Client Note: ${customNote.trim()}\n` : '') +
      `✦ Image Reference: ${window.location.origin}${product.image}\n\n` +
      `Kindly assist with availability, concierge ordering, and doorstep delivery.`
    );
  };

  const handleProceedWhatsApp = () => {
    const text = encodeURIComponent(getWhatsAppMessage());
    const url = `https://wa.me/919840182019?text=${text}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onClose();
  };

  const handleCopyInquiry = () => {
    navigator.clipboard.writeText(getWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="wa-modal-backdrop" onClick={onClose}>
        <motion.div
          className="wa-modal-dialog"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wa-modal-title"
        >
          {/* Header */}
          <div className="wa-modal-header">
            <div className="wa-header-branding">
              <span className="wa-brand-pill">
                <WhatsAppIcon size={14} />
                <span>ATELIER CONCIERGE</span>
              </span>
              <h3 id="wa-modal-title" className="wa-modal-title">
                Direct Artisan Inquiry
              </h3>
            </div>
            <button
              onClick={onClose}
              className="wa-close-btn"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Product Summary Row */}
          <div className="wa-product-row">
            <div className="wa-product-thumb">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="wa-product-details">
              <span className="wa-sku-badge">SKU: IK-{product.id.toUpperCase()}</span>
              <h4 className="wa-product-name">{product.name}</h4>
              <span className="wa-product-tamil">{product.tamil} · {product.subtitle}</span>
              <div className="wa-product-pricing">
                <span className="wa-price-bold">{product.price}</span>
                {product.originalPrice && (
                  <span className="wa-price-strike">{product.originalPrice}</span>
                )}
                <span className="wa-stock-status">{product.stock}</span>
              </div>
            </div>
          </div>

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="wa-form-section">
              <label className="wa-section-label">Select Your Size / Drape Length</label>
              <div className="wa-sizes-chips">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`wa-size-chip ${selectedSize === s ? 'is-selected' : ''}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Optional Message */}
          <div className="wa-form-section">
            <label className="wa-section-label" htmlFor="wa-custom-note">
              Styling Request or Question (Optional)
            </label>
            <textarea
              id="wa-custom-note"
              rows={2}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Can this be customized with a fall pico? Or needed by Friday for a wedding..."
              className="wa-textarea"
            />
          </div>

          {/* WhatsApp Action Controls */}
          <div className="wa-modal-actions">
            <button
              type="button"
              onClick={handleCopyInquiry}
              className="wa-btn-secondary"
              title="Copy inquiry text to clipboard"
            >
              {copied ? <Check size={15} /> : null}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Inquiry'}</span>
            </button>
            <button
              type="button"
              onClick={handleProceedWhatsApp}
              className="wa-btn-primary"
            >
              <WhatsAppIcon size={18} />
              <span>Continue to WhatsApp</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="wa-modal-footer">
            <ShieldCheck size={13} className="text-antique-gold" />
            <span>Dedicated concierge at <strong>+91 98401 82019</strong>. Free domestic delivery & safe packaging.</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
