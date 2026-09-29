import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, onSave, editingProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stockQuantity: '',
    rating: 4.8,
    imageUrl: '',
    description: ''
  });

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || '',
        price: editingProduct.price || '',
        stockQuantity: editingProduct.stockQuantity || '',
        rating: editingProduct.rating || 4.8,
        imageUrl: editingProduct.imageUrl || '',
        description: editingProduct.description || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Electronics',
        price: '',
        stockQuantity: 20,
        rating: 4.8,
        imageUrl: '',
        description: ''
      });
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      rating: parseFloat(formData.rating),
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-header">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <button className="modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Wireless Gaming Mouse"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <input 
                type="text" 
                className="form-control" 
                required 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Electronics, Fashion, etc."
              />
            </div>
            <div className="form-group">
              <label>Price ($) *</label>
              <input 
                type="number" 
                step="0.01" 
                className="form-control" 
                required 
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="99.99"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Stock Quantity *</label>
              <input 
                type="number" 
                className="form-control" 
                required 
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Rating (1-5)</label>
              <input 
                type="number" 
                step="0.1" 
                min="1" 
                max="5" 
                className="form-control" 
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input 
              type="url" 
              className="form-control" 
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-control" 
              rows="3" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed specifications..."
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save to Database</button>
          </div>
        </form>
      </div>
    </div>
  );
}
