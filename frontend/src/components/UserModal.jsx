import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function UserModal({ isOpen, onClose, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'ROLE_CUSTOMER',
    phone: '',
    address: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(formData);
    setFormData({
      name: '',
      email: '',
      password: 'password123',
      role: 'ROLE_CUSTOMER',
      phone: '',
      address: ''
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Register User in user-service</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. David Miller"
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
              placeholder="david@example.com"
            />
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
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select 
                className="form-control"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
            />
          </div>
          <div className="form-group">
            <label>Shipping Address</label>
            <input 
              type="text" 
              className="form-control" 
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street, City, Zip"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Register in PostgreSQL</button>
          </div>
        </form>
      </div>
    </div>
  );
}
