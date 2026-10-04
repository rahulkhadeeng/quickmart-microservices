import React, { useState, useEffect } from 'react';
import { X, Upload, Link2, Sparkles, Loader2 } from 'lucide-react';
import ProductImagesDropzone from './ProductImagesDropzone';
import { api } from '../services/api';

export default function ProductModal({ isOpen, onClose, onSave, editingProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Electronics',
    price: '',
    stockQuantity: 20,
    rating: 4.8,
    imageUrl: '',
    description: ''
  });

  const [imageMode, setImageMode] = useState('upload'); // 'upload' | 'url'
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        category: editingProduct.category || 'Electronics',
        price: editingProduct.price || '',
        stockQuantity: editingProduct.stockQuantity ?? 20,
        rating: editingProduct.rating || 4.8,
        imageUrl: editingProduct.imageUrl || '',
        description: editingProduct.description || ''
      });
      setSelectedFiles([]);
      if (editingProduct.imageUrl) {
        setImageMode('url');
      } else {
        setImageMode('upload');
      }
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
      setSelectedFiles([]);
      setImageMode('upload');
    }
    setUploadError('');
    setIsUploading(false);
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError('');

    let finalImageUrl = formData.imageUrl;

    // If local files are chosen in upload mode, upload them to UploadThing first
    if (imageMode === 'upload' && selectedFiles.length > 0) {
      try {
        setIsUploading(true);
        const uploadRes = await api.uploadProductImages(selectedFiles);
        if (uploadRes && uploadRes.urls && uploadRes.urls.length > 0) {
          finalImageUrl = uploadRes.urls[0];
        } else if (uploadRes && uploadRes.url) {
          finalImageUrl = uploadRes.url;
        }
      } catch (err) {
        setIsUploading(false);
        setUploadError(err.message || 'Image upload failed.');
        return;
      } finally {
        setIsUploading(false);
      }
    }

    if (!finalImageUrl) {
      finalImageUrl = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600';
    }

    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stockQuantity: parseInt(formData.stockQuantity),
      rating: parseFloat(formData.rating),
      imageUrl: finalImageUrl
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card--enhanced">
        <div className="modal-header">
          <div>
            <div className="modal-badge">ADMIN CATALOG</div>
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-modal-form">
          <div className="form-group">
            <label>Product Name *</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select 
                className="form-control" 
                required 
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Electronics">Electronics</option>
                <option value="Footwear">Footwear</option>
                <option value="Fashion">Fashion</option>
                <option value="Gaming">Gaming</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Sports & Fitness">Sports & Fitness</option>
                <option value="Accessories">Accessories</option>
              </select>
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

          {/* Product Image Section with UploadThing dropzone & URL mode toggle */}
          <div className="product-image-section">
            <div className="image-mode-tabs">
              <button 
                type="button" 
                className={`image-mode-tab ${imageMode === 'upload' ? 'active' : ''}`}
                onClick={() => setImageMode('upload')}
              >
                <Upload size={14} /> Upload Image (UploadThing)
              </button>
              <button 
                type="button" 
                className={`image-mode-tab ${imageMode === 'url' ? 'active' : ''}`}
                onClick={() => setImageMode('url')}
              >
                <Link2 size={14} /> Direct Image URL
              </button>
            </div>

            {imageMode === 'upload' ? (
              <div className="image-upload-wrap">
                <ProductImagesDropzone 
                  images={selectedFiles}
                  onChange={setSelectedFiles}
                  maxImages={3}
                  isUploading={isUploading}
                />
              </div>
            ) : (
              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label>Image URL</label>
                <input 
                  type="url" 
                  className="form-control" 
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                />
                {formData.imageUrl && (
                  <div className="url-preview-card">
                    <img 
                      src={formData.imageUrl} 
                      alt="URL Preview" 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'; }}
                    />
                    <span>Image Preview</span>
                  </div>
                )}
              </div>
            )}

            {uploadError && (
              <div className="form-error-banner">
                {uploadError}
              </div>
            )}
          </div>

          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label>Description</label>
            <textarea 
              className="form-control" 
              rows="3" 
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed specifications and key features..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isUploading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isUploading}>
              {isUploading ? (
                <>
                  <Loader2 size={16} className="spin-icon" /> Uploading & Saving...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Save to Database
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
