import React, { useState } from 'react';
import {
  Package,
  Layers,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { AdminUser } from '../types';
import { authService } from '../services/authService';
import { AdminProducts } from './AdminProducts';
import { AdminCategories } from './AdminCategories';
import { AdminSettings } from './AdminSettings';

interface AdminLayoutProps {
  user: AdminUser;
  onLogout: () => void;
  onNavigateHome: () => void;
  initialTab?: 'products' | 'categories' | 'settings';
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  user,
  onLogout,
  onNavigateHome,
  initialTab = 'products',
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'settings'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#categories') return 'categories';
      if (window.location.hash === '#settings') return 'settings';
    }
    return initialTab;
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close drawer on Escape key and manage body scroll lock
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleSignOut = async () => {
    await authService.logout();
    onLogout();
  };

  return (
    <div className="admin-portal-shell">
      {/* Top Header - Mobile First Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 py-3 flex items-center justify-between admin-portal-header">
        <div className="admin-header-left flex items-center gap-2 md:gap-3">
          <button
            type="button"
            className="admin-mobile-toggle p-2 rounded-lg hover:bg-[#800020]/10 text-[#800020] transition-colors cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div
            className="admin-brand-mark flex items-center gap-2 cursor-pointer select-none"
            onClick={onNavigateHome}
            title="View store"
          >
            <span className="brand-name text-base md:text-lg font-serif font-bold tracking-widest text-[#26050C]">
              ELAIYAL KARIGAI
            </span>
            <span className="bg-[#800020] text-[#D4AF37] uppercase tracking-wider text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              ADMIN
            </span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="admin-nav-tabs hidden md:flex items-center gap-2">
          <button
            onClick={() => setActiveTab('products')}
            className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          >
            <Package size={15} />
            <span>Products</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`admin-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          >
            <Layers size={15} />
            <span>Categories</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings size={15} />
            <span>Settings</span>
          </button>
        </nav>

        {/* User actions: Compact on mobile (< 768px), full on desktop */}
        <div className="admin-header-right flex items-center gap-2 md:gap-3">
          {/* Mobile Live Store Icon Button */}
          <button
            onClick={onNavigateHome}
            className="admin-mobile-icon-btn md:hidden p-2 rounded-xl border border-[#D4AF37]/30 bg-white/80 text-[#800020] hover:bg-[#800020] hover:text-white transition-all shadow-sm"
            title="View Live Storefront"
            aria-label="View Live Storefront"
          >
            <ExternalLink size={16} />
          </button>

          {/* Desktop Live Store Button */}
          <button
            onClick={onNavigateHome}
            className="admin-view-store-btn hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D4AF37]/30 bg-white/80 text-xs font-semibold text-[#800020] hover:bg-[#800020] hover:text-white transition-all shadow-sm"
            title="Return to boutique storefront"
          >
            <span>Live Store</span>
            <ExternalLink size={14} />
          </button>

          {/* Desktop User Badge */}
          <div
            className="admin-user-badge hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/60 border border-[#D4AF37]/20 text-xs text-[#26050C]"
            title={`Signed in as ${user.email.replace('ilayal', 'elaiyal')}`}
          >
            <Shield size={14} className="text-[#D4AF37]" />
            <span className="user-email font-mono truncate max-w-[180px]">
              {user.email.replace('ilayal', 'elaiyal')}
            </span>
          </div>

          {/* Mobile Compact Logout Button */}
          <button
            onClick={handleSignOut}
            className="admin-mobile-icon-btn md:hidden p-2 rounded-xl bg-[#800020]/10 text-[#800020] hover:bg-[#800020] hover:text-white transition-all"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut size={16} />
          </button>

          {/* Desktop Full Logout Button */}
          <button
            onClick={handleSignOut}
            className="admin-logout-btn hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#800020]/10 hover:bg-[#800020] text-[#800020] hover:text-white text-xs font-semibold transition-all"
            title="Sign out of Admin Portal"
            aria-label="Sign out"
          >
            <LogOut size={15} />
            <span className="logout-text">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Mobile & Tablet Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="admin-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Styled Slide-out Navigation Drawer Menu */}
      <aside
        className={`admin-mobile-drawer ${mobileMenuOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Admin Navigation Menu"
      >
        <div className="admin-drawer-header">
          <div className="admin-drawer-brand">
            <span className="admin-drawer-title">ELAIYAL KARIGAI</span>
            <span className="admin-drawer-badge">ADMIN MENU</span>
          </div>
          <button
            type="button"
            className="admin-drawer-close-btn"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-drawer-nav">
          <button
            type="button"
            onClick={() => {
              setActiveTab('products');
              setMobileMenuOpen(false);
            }}
            className={`drawer-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          >
            <Package size={18} />
            <span>Products Catalogue</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('categories');
              setMobileMenuOpen(false);
            }}
            className={`drawer-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          >
            <Layers size={18} />
            <span>Categories</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('settings');
              setMobileMenuOpen(false);
            }}
            className={`drawer-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings size={18} />
            <span>Store Settings</span>
          </button>

          <hr className="drawer-divider" />

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onNavigateHome();
            }}
            className="drawer-tab-btn boutique"
          >
            <ExternalLink size={18} />
            <span>View Live Boutique</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              handleSignOut();
            }}
            className="drawer-tab-btn logout"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-portal-content">
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'categories' && <AdminCategories />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};
