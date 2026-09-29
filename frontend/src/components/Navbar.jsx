import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Store, 
  ShoppingBag, 
  PieChart, 
  Network, 
  ShoppingCart, 
  ChevronDown, 
  UserPlus 
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  cartCount, 
  onOpenCart, 
  currentUser, 
  users, 
  onSelectUser, 
  onOpenNewUserModal,
  isGatewayOnline,
  orderCount 
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.user-dropdown-container')) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'QM';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand */}
        <div className="brand" onClick={() => setActiveTab('storefront')}>
          <div className="logo-icon">
            <Zap size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">QuickMart</span>
            <span className="brand-sub">Microservices Platform</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-links">
          <button 
            className={`nav-tab ${activeTab === 'storefront' ? 'active' : ''}`}
            onClick={() => setActiveTab('storefront')}
          >
            <Store size={17} /> Storefront
          </button>
          <button 
            className={`nav-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={17} /> My Orders
            {orderCount > 0 && <span className="tab-badge">{orderCount}</span>}
          </button>
          <button 
            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            <PieChart size={17} /> Admin Studio
          </button>
          <button 
            className={`nav-tab ${activeTab === 'arch' ? 'active' : ''}`}
            onClick={() => setActiveTab('arch')}
          >
            <Network size={17} /> Architecture
          </button>
        </nav>

        {/* Live System Health Badge */}
        <div 
          className={`system-status ${isGatewayOnline ? '' : 'offline'}`}
          onClick={() => setActiveTab('arch')}
          title="Click to view distributed architecture & live ping tests"
        >
          <span className={`pulse-dot ${isGatewayOnline ? 'online' : 'offline'}`}></span>
          <span>{isGatewayOnline ? 'Gateway (Online)' : 'Gateway (Standby)'}</span>
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Quick Register Button */}
          <button 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
            onClick={onOpenNewUserModal}
            title="Register a new customer account in PostgreSQL"
          >
            <UserPlus size={14} color="var(--primary)" />
            <span>Register</span>
          </button>

          {/* User Switcher Dropdown */}
          <div className="user-dropdown-container">
            <div className="user-pill" onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}>
              <div className="user-avatar">{getInitials(currentUser?.name)}</div>
              <div className="user-meta">
                <span className="user-name">{currentUser?.name || 'Guest User'}</span>
                <span className="user-role">{(currentUser?.role || 'ROLE_CUSTOMER').replace('ROLE_', '')}</span>
              </div>
              <ChevronDown size={14} color="var(--text-muted)" />
            </div>

            {dropdownOpen && (
              <div className="user-dropdown-menu">
                <div className="dropdown-header">Switch Active User (user-service)</div>
                {users.map(u => (
                  <div 
                    key={u.id}
                    className={`dropdown-item ${u.id === currentUser?.id ? 'active' : ''}`}
                    onClick={() => { onSelectUser(u); setDropdownOpen(false); }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>{u.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{u.email}</div>
                    </div>
                    <span className="code-pill">{(u.role || '').replace('ROLE_', '')}</span>
                  </div>
                ))}
                <div className="dropdown-divider"></div>
                <button 
                  className="dropdown-action-btn"
                  onClick={() => { setDropdownOpen(false); onOpenNewUserModal(); }}
                >
                  <UserPlus size={15} /> + Register New Customer
                </button>
              </div>
            )}
          </div>

          {/* Cart Trigger */}
          <button className="cart-btn" onClick={onOpenCart}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
