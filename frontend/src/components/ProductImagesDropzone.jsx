import React, { useState, useId } from 'react';
import { UploadCloud, ImagePlus, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function ProductImagesDropzone({ 
  images = [], 
  onChange, 
  maxImages = 3,
  isUploading = false 
}) {
  const inputId = useId();
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileError, setFileError] = useState('');

  const addFiles = (incomingFiles) => {
    setFileError('');
    const filesArray = Array.from(incomingFiles);
    
    // Validate image types
    const validImages = filesArray.filter(file => {
      const isImg = file.type.startsWith('image/');
      if (!isImg) {
        setFileError('Only image files (JPEG, PNG, WebP) are allowed.');
      }
      return isImg;
    });

    if (validImages.length === 0) return;

    // Check size limit (8MB)
    const oversized = validImages.some(f => f.size > 8 * 1024 * 1024);
    if (oversized) {
      setFileError('Each image must be smaller than 8 MB.');
      return;
    }

    const combined = [...images, ...validImages].slice(0, maxImages);
    onChange(combined);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleRemove = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="product-image-dropzone-container">
      <div className="dropzone-header">
        <label className="dropzone-label">
          Product Images 
          <span className="dropzone-count">({images.length}/{maxImages})</span>
        </label>
        {images.length > 0 && (
          <span className="dropzone-badge-ready">
            <CheckCircle size={13} /> {images.length} {images.length === 1 ? 'image' : 'images'} selected
          </span>
        )}
      </div>

      <label 
        htmlFor={inputId}
        className={`image-dropzone ${isDragOver ? 'image-dropzone--active' : ''} ${images.length >= maxImages ? 'image-dropzone--disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="dropzone-icon-wrap">
          {isUploading ? (
            <Loader2 size={32} className="spin-icon text-primary" />
          ) : (
            <UploadCloud size={32} />
          )}
        </div>

        <div className="dropzone-text-group">
          <strong>
            {isUploading 
              ? 'Uploading to UploadThing CDN...' 
              : images.length >= maxImages 
                ? 'Maximum images reached' 
                : 'Drag & drop product images here, or browse'}
          </strong>
          <span>Supports JPEG, PNG, WebP up to 8MB • Powered by UploadThing</span>
        </div>

        {images.length < maxImages && !isUploading && (
          <span className="image-dropzone__browse">
            <ImagePlus size={15} /> Browse Files
          </span>
        )}

        <input 
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          disabled={images.length >= maxImages || isUploading}
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
      </label>

      {fileError && (
        <div className="dropzone-error-msg">
          <AlertCircle size={14} /> {fileError}
        </div>
      )}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="image-upload-previews">
          {images.map((item, index) => {
            const previewUrl = typeof item === 'string' 
              ? item 
              : item instanceof File 
                ? URL.createObjectURL(item) 
                : '';

            const fileName = item instanceof File ? item.name : `Image #${index + 1}`;

            return (
              <div className="image-upload-preview" key={`${fileName}-${index}`}>
                <img 
                  src={previewUrl} 
                  alt={`Product Preview ${index + 1}`} 
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'; }}
                />
                <div className="preview-overlay-info">
                  <span className="preview-chip">{index === 0 ? 'Primary' : `#${index + 1}`}</span>
                  <button 
                    type="button" 
                    className="preview-remove-btn" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(index);
                    }}
                    title="Remove image"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
