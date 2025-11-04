import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import imageAPI from '../services/api';
import './ImageUpload.css';

function ImageUpload({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [options, setOptions] = useState({
    folder: '',
    tags: '',
    optimize: true,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setPreview(URL.createObjectURL(file));
      }
    },
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0];
      if (error?.code === 'file-too-large') {
        toast.error('File is too large. Maximum size is 10MB');
      } else if (error?.code === 'file-invalid-type') {
        toast.error('Invalid file type. Please upload an image');
      } else {
        toast.error('File rejected');
      }
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const uploadOptions = {
        folder: options.folder || undefined,
        tags: options.tags ? options.tags.split(',').map((t) => t.trim()) : undefined,
        optimize: options.optimize,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      };

      const result = await imageAPI.uploadImage(selectedFile, uploadOptions);

      if (result.success) {
        onUploadSuccess(result.data);
        handleClear();
      }
    } catch (error) {
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadProgress(0);
    setOptions({
      folder: '',
      tags: '',
      optimize: true,
    });
  };

  return (
    <div className="upload-container card">
      <h2 className="upload-title">Upload Image</h2>

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${
          preview ? 'has-preview' : ''
        }`}
      >
        <input {...getInputProps()} />

        {!preview ? (
          <div className="dropzone-content">
            <Upload size={48} />
            <p className="dropzone-text">
              {isDragActive
                ? 'Drop the image here'
                : 'Drag & drop an image here, or click to select'}
            </p>
            <p className="dropzone-hint">
              Supported formats: JPG, PNG, GIF, WebP, SVG (max 10MB)
            </p>
          </div>
        ) : (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            <button
              className="preview-remove"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              disabled={uploading}
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="upload-options">
          <div className="file-info">
            <CheckCircle size={20} className="check-icon" />
            <span className="file-name">{selectedFile.name}</span>
            <span className="file-size">
              ({(selectedFile.size / 1024).toFixed(2)} KB)
            </span>
          </div>

          <div className="options-form">
            <div className="form-group">
              <label htmlFor="folder">Folder (optional)</label>
              <input
                id="folder"
                type="text"
                className="input"
                placeholder="e.g., products, avatars"
                value={options.folder}
                onChange={(e) =>
                  setOptions({ ...options, folder: e.target.value })
                }
                disabled={uploading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags (optional, comma-separated)</label>
              <input
                id="tags"
                type="text"
                className="input"
                placeholder="e.g., product, featured, sale"
                value={options.tags}
                onChange={(e) => setOptions({ ...options, tags: e.target.value })}
                disabled={uploading}
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={options.optimize}
                  onChange={(e) =>
                    setOptions({ ...options, optimize: e.target.checked })
                  }
                  disabled={uploading}
                />
                <span>Optimize image before upload</span>
              </label>
            </div>
          </div>

          {uploading && (
            <div className="progress-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="progress-text">{uploadProgress}%</span>
            </div>
          )}

          <div className="upload-actions">
            <button
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={uploading}
            >
              <X size={18} />
              Clear
            </button>
            <button
              className="btn btn-primary"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader size={18} className="spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={18} />
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
