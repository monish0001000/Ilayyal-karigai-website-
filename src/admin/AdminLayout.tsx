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

  const handleSignOut = async () => {
    await authService.logout();
    onLogout();
  };

  return (
    <div className="admin-portal-shell">
      {/* Top Header */}
      <header className="admin-portal-header">
        <div className="admin-header-left">
          <button
            className="admin-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="admin-brand-mark" onClick={onNavigateHome} title="View store">
            <span className="brand-name">ILAYAL KARIGAI</span>
            <span className="brand-portal-pill">ADMIN</span>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="admin-nav-tabs">
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

        {/* User actions */}
        <div className="admin-header-right">
          <button
            onClick={onNavigateHome}
            className="admin-view-store-btn"
            title="Return to boutique storefront"
          >
            <span>Live Store</span>
            <ExternalLink size={14} />
          </button>

          <div className="admin-user-badge" title={`Signed in as ${user.email}`}>
            <Shield size={14} className="text-antique-gold" />
            <span className="user-email">{user.email}</span>
          </div>

          <button
            onClick={handleSignOut}
            className="admin-logout-btn"
            title="Sign out of Admin Portal"
            aria-label="Sign out"
          >
            <LogOut size={16} />
            <span className="logout-text">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="admin-mobile-drawer">
          <button
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
          <button onClick={onNavigateHome} className="drawer-tab-btn">
            <ExternalLink size={18} />
            <span>View Live Boutique</span>
          </button>
          <button onClick={handleSignOut} className="drawer-tab-btn logout">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="admin-portal-content">
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'categories' && <AdminCategories />}
        {activeTab === 'settings' && <AdminSettings />}
      </main>
    </div>
  );
};
