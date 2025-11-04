import { useState } from 'react';
import { Trash2, ExternalLink, Download, RefreshCw, Loader } from 'lucide-react';
import './ImageGallery.css';

function ImageGallery({ images, loading, hasMore, onDelete, onLoadMore, onRefresh }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDownload = async (url, publicId) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = publicId.split('/').pop() || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading && images.length === 0) {
    return (
      <div className="gallery-loading">
        <div className="spinner" />
        <p>Loading images...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="gallery-empty card">
        <p>No images found. Upload your first image!</p>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>Gallery ({images.length} images)</h2>
        <button className="btn btn-secondary" onClick={onRefresh} disabled={loading}>
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
          Refresh
        </button>
      </div>

      <div className="gallery-grid">
        {images.map((image) => (
          <div key={image.publicId} className="gallery-item card fade-in">
            <div className="image-wrapper">
              <img
                src={image.thumbnail}
                alt={image.publicId}
                loading="lazy"
                onClick={() => setSelectedImage(image)}
              />
              <div className="image-overlay">
                <button
                  className="overlay-btn"
                  onClick={() => setSelectedImage(image)}
                  title="View full size"
                >
                  <ExternalLink size={20} />
                </button>
                <button
                  className="overlay-btn"
                  onClick={() => handleDownload(image.url, image.publicId)}
                  title="Download"
                >
                  <Download size={20} />
                </button>
                <button
                  className="overlay-btn danger"
                  onClick={() => onDelete(image.publicId)}
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="image-info">
              <p className="image-id" title={image.publicId}>
                {image.publicId.split('/').pop()}
              </p>
              <div className="image-meta">
                <span>{image.width} × {image.height}</span>
                <span>{formatBytes(image.bytes)}</span>
                <span>{image.format.toUpperCase()}</span>
              </div>
              <p className="image-date">{formatDate(image.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="gallery-load-more">
          <button
            className="btn btn-primary"
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={18} className="spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
            <img src={selectedImage.url} alt={selectedImage.publicId} />
            <div className="modal-info">
              <h3>{selectedImage.publicId}</h3>
              <div className="modal-details">
                <div className="detail-item">
                  <span className="detail-label">Dimensions:</span>
                  <span>{selectedImage.width} × {selectedImage.height}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Size:</span>
                  <span>{formatBytes(selectedImage.bytes)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Format:</span>
                  <span>{selectedImage.format.toUpperCase()}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Created:</span>
                  <span>{formatDate(selectedImage.createdAt)}</span>
                </div>
              </div>
              <div className="modal-actions">
                <a
                  href={selectedImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <ExternalLink size={18} />
                  Open Original
                </a>
                <button
                  className="btn btn-primary"
                  onClick={() => handleDownload(selectedImage.url, selectedImage.publicId)}
                >
                  <Download size={18} />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
