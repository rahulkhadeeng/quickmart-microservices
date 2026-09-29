import React, { useState } from 'react';
import { X, AlertCircle, Loader2, UserCheck } from 'lucide-react';

export default function UserModal({ isOpen, onClose, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'ROLE_CUSTOMER',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      await onRegister(formData);
      setFormData({
        name: '',
        email: '',
        password: 'password123',
        role: 'ROLE_CUSTOMER',
        phone: '',
        address: ''
      });
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '480px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserCheck size={20} color="var(--primary)" />
            <h3 style={{ margin: 0 }}>Register New User</h3>
          </div>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#F87171',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              className="form-control"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rahul Khade"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              className="form-control"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="rahul@example.com"
              disabled={isSubmitting}
            />
            <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Must be unique.
            </small>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                className="form-control"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                className="form-control"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                disabled={isSubmitting}
              >
                <option value="ROLE_CUSTOMER">ROLE_CUSTOMER</option>
                <option value="ROLE_ADMIN">ROLE_ADMIN</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              className="form-control"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 9876543210"
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <label>Shipping Address</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Flat 402, Sunshine Heights, Mumbai"
              disabled={isSubmitting}
            />
          </div>
          <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Saving...
                </>
              ) : (
                'Register'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
