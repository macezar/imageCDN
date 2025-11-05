import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import ImageUpload from './components/ImageUpload';
import ImageGallery from './components/ImageGallery';
import Stats from './components/Stats';
import imageAPI from './services/api';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState('gallery');

  // Load initial images
  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async (cursor = null) => {
    try {
      setLoading(true);
      const result = await imageAPI.listImages({
        maxResults: 20,
        nextCursor: cursor,
      });

      if (cursor) {
        // Append to existing images (load more)
        setImages((prev) => [...prev, ...result.data.images]);
      } else {
        // Replace images (initial load or refresh)
        setImages(result.data.images);
      }

      setNextCursor(result.data.nextCursor);
      setHasMore(!!result.data.nextCursor);
    } catch (error) {
      toast.error(`Failed to load images: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (newImage) => {
    setImages((prev) => [newImage, ...prev]);
    toast.success('Image uploaded successfully!');
  };

  const handleDeleteImage = async (publicId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await imageAPI.deleteImage(publicId);
      setImages((prev) => prev.filter((img) => img.publicId !== publicId));
      toast.success('Image deleted successfully!');
    } catch (error) {
      toast.error(`Failed to delete image: ${error.message}`);
    }
  };

  const handleLoadMore = () => {
    if (nextCursor && !loading) {
      loadImages(nextCursor);
    }
  };

  const handleRefresh = () => {
    loadImages();
  };

  return (
    <div className="app">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Header />

      <main className="main-content container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </button>
          <button
            className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
          <button
            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>

        {activeTab === 'upload' && (
          <div className="tab-content fade-in">
            <ImageUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="tab-content fade-in">
            <ImageGallery
              images={images}
              loading={loading}
              hasMore={hasMore}
              onDelete={handleDeleteImage}
              onLoadMore={handleLoadMore}
              onRefresh={handleRefresh}
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="tab-content fade-in">
            <Stats />
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            Image CDN Microservice powered by{' '}
            <a
              href="https://cloudinary.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudinary
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
