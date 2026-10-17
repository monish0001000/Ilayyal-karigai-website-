import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  Download,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Database,
} from 'lucide-react';
import { productService } from '../services/productService';
import { authService } from '../services/authService';

export const AdminSettings: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    try {
      await authService.changePassword(currentPassword, newPassword);
      setPasswordSuccess('Admin security password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    }
  };

  const handleExportData = () => {
    const products = productService.getProducts(true);
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ilayal-karigai-inventory-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        'Are you sure you want to restore the catalogue to the original 12 curated handloom pieces? Any custom pieces created will be reset.'
      )
    ) {
      productService.resetToDefaults();
      setResetSuccess('Catalogue successfully restored to original 12 handloom pieces.');
      setTimeout(() => setResetSuccess(null), 4000);
    }
  };

  return (
    <div className="admin-settings-view">
      <div className="settings-header-block">
        <span className="settings-eyebrow">BOUTIQUE CONFIGURATION</span>
        <h2 className="settings-title">Store &amp; Security Settings</h2>
        <p className="settings-desc">
          Manage boutique communication endpoints, administrative security credentials, and data persistence.
        </p>
      </div>

      <div className="settings-grid">
        {/* Boutique Configuration */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Phone size={18} className="text-antique-gold" />
            <h3 className="settings-card-title">Concierge &amp; WhatsApp Helpline</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-field">
              <label className="settings-label">Brand Name</label>
              <input
                type="text"
                disabled
                value="Ilayal Karigai (இளையள் காரிகை)"
                className="settings-input disabled"
              />
            </div>

            <div className="settings-field">
              <label className="settings-label">Official WhatsApp Helpline</label>
              <input
                type="text"
                disabled
                value="+91 98401 82019"
                className="settings-input disabled"
              />
              <span className="settings-hint">Configured in production configuration.</span>
            </div>

            <div className="settings-field">
              <label className="settings-label">Default WhatsApp Enquiry Message</label>
              <input
                type="text"
                disabled
                value="Hello Ilayal Karigai, I would like to enquire about your collection."
                className="settings-input disabled"
              />
            </div>
          </div>
        </div>

        {/* Admin Password & Security */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Key size={18} className="text-antique-gold" />
            <h3 className="settings-card-title">Change Admin Security Password</h3>
          </div>
          <form onSubmit={handlePasswordChange} className="settings-card-body">
            {passwordSuccess && (
              <div className="settings-alert-success">
                <CheckCircle2 size={16} />
                <span>{passwordSuccess}</span>
              </div>
            )}
            {passwordError && (
              <div className="settings-alert-error">
                <AlertCircle size={16} />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="settings-field">
              <label className="settings-label">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current security password"
                className="settings-input"
              />
            </div>

            <div className="settings-field">
              <label className="settings-label">New Password (min 8 chars)</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New security password"
                className="settings-input"
              />
            </div>

            <div className="settings-field">
              <label className="settings-label">Confirm New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="settings-input"
              />
            </div>

            <button type="submit" className="settings-action-btn">
              <ShieldCheck size={16} />
              <span>Update Security Password</span>
            </button>
          </form>
        </div>

        {/* Data Persistence & Cloud Architecture */}
        <div className="settings-card span-full">
          <div className="settings-card-header">
            <Database size={18} className="text-antique-gold" />
            <h3 className="settings-card-title">Data Storage &amp; Cloud Migration</h3>
          </div>
          <div className="settings-card-body">
            <div className="database-status-box">
              <div className="status-row">
                <span className="status-dot online" />
                <span className="status-text">
                  <strong>Local Repository:</strong> Persisted in Local Storage with instant reactivity across all storefront views.
                </span>
              </div>
              <p className="status-note">
                SQL migrations with Row Level Security (RLS) are prepared in <code>supabase/migrations/001_initial_schema.sql</code> for instant deployment to cloud PostgreSQL.
              </p>
            </div>

            {resetSuccess && (
              <div className="settings-alert-success">
                <CheckCircle2 size={16} />
                <span>{resetSuccess}</span>
              </div>
            )}

            <div className="database-actions-row">
              <button
                type="button"
                onClick={handleExportData}
                className="settings-secondary-btn"
              >
                <Download size={16} />
                <span>Export Inventory (JSON)</span>
              </button>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="settings-danger-btn"
              >
                <RotateCcw size={16} />
                <span>Restore 12 Original Pieces</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
