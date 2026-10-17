import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { authService } from '../services/authService';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onNavigateHome: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isSuccess) return;
    setErrorMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('Please provide both your email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.login(cleanEmail, password);
      // Brief, tasteful success transition state
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess();
      }, 550);
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify your credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Back to store shortcut */}
      <button
        onClick={onNavigateHome}
        className="admin-login-back-btn"
        aria-label="Return to live boutique"
      >
        <ArrowLeft size={16} />
        <span>Return to Boutique</span>
      </button>

      <div className={`admin-login-container ${isSuccess ? 'auth-success-exit' : ''}`}>
        {/* Left Editorial Branding Panel */}
        <div className="admin-login-brand-panel">
          <div className="admin-brand-content">
            <span className="admin-eyebrow">ILAYAL KARIGAI · BOUTIQUE SUITE</span>
            <h1 className="admin-brand-title">The Art of Modern Heritage.</h1>
            <p className="admin-brand-desc">
              A private administrative portal to curate collections, manage luxury handlooms, and orchestrate client orders with intent.
            </p>

            <div className="admin-brand-quote">
              <span className="quote-mark">“</span>
              <p>Crafted for timeless elegance, grounded in ancestral craft.</p>
              <cite>— Ilayal Karigai Atelier</cite>
            </div>
          </div>

          <div className="admin-brand-footer">
            <ShieldCheck size={16} className="text-antique-gold" />
            <span>Cryptographically Verified Admin Session</span>
          </div>
        </div>

        {/* Right Credentials Form Panel */}
        <div className="admin-login-form-panel">
          <div className="admin-form-header">
            <span className="admin-portal-badge">PORTAL ACCESS</span>
            <h2 className="admin-heading">Welcome back.</h2>
            <p className="admin-subheading">Sign in to manage your Ilayal Karigai store.</p>
          </div>

          {errorMessage && (
            <div className="admin-error-alert" role="alert">
              <AlertCircle size={18} className="flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess && (
            <div className="admin-success-state" role="status">
              <CheckCircle2 size={22} className="text-antique-gold flex-shrink-0" />
              <div>
                <strong>Access Verified</strong>
                <p>Loading your atelier dashboard…</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-form" noValidate>
            <div className="admin-form-group">
              <label htmlFor="admin-email" className="admin-label">
                Email Address
              </label>
              <div className="admin-input-wrapper">
                <Mail size={16} className="admin-input-icon" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ilayalkarigai.com"
                  required
                  autoComplete="email"
                  className="admin-input"
                  disabled={isLoading || isSuccess}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <div className="admin-label-row">
                <label htmlFor="admin-password" className="admin-label">
                  Security Password
                </label>
              </div>
              <div className="admin-input-wrapper">
                <Lock size={16} className="admin-input-icon" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  className="admin-input"
                  disabled={isLoading || isSuccess}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="admin-password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                  disabled={isLoading || isSuccess}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="admin-credentials-hint">
              <p>
                <strong>Admin Credentials:</strong> <code>admin@ilayalkarigai.com</code> / <code>Ilayal@Admin2026!</code>
              </p>
            </div>

            <button
              type="submit"
              className="admin-submit-btn"
              disabled={isLoading || isSuccess}
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Verified — Entering Dashboard</span>
                </>
              ) : isLoading ? (
                <span>Verifying Credentials…</span>
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="admin-form-footer">
            <span>Protected by Web Crypto SHA-256 with Unique Salt.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
