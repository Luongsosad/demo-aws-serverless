import React, { useState, useEffect, useCallback } from 'react';
import UploadForm from './components/UploadForm';
import ImageGallery from './components/ImageGallery';
import { getMessages } from './services/api';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setImages(data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            AWS S3 <span className="text-indigo-600">Upload Demo</span>
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Upload images securely to S3 and view them instantly via CloudFront.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upload Form */}
          <div className="lg:col-span-1">
            <UploadForm onUploadSuccess={fetchImages} />
          </div>

          {/* Right Column - Image Gallery */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Uploads</h2>
              <ImageGallery images={images} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
