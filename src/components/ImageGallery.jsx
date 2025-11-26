import React from 'react';

const ImageGallery = ({ images, loading }) => {
    // Debug: log images to console
    console.log('ImageGallery received images:', images);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p>No images uploaded yet.</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {images.map((img, index) => (
                <div key={img.id || index} style={{ border: '1px solid #ccc', padding: '10px', width: '300px' }}>
                    <img
                        src={img.imageUrl}
                        alt={img.message || 'Uploaded image'}
                        style={{ width: '100%', height: 'auto', display: 'block' }}
                        onLoad={(e) => console.log('✅ Image loaded:', img.imageUrl)}
                        onError={(e) => console.error('❌ Image failed:', img.imageUrl)}
                    />
                    <div style={{ marginTop: '10px' }}>
                        <p style={{ fontSize: '12px', color: '#666' }}>
                            {img.createdAt ? new Date(img.createdAt).toLocaleString() : 'Unknown date'}
                        </p>
                        <p style={{ fontSize: '14px', fontWeight: 'bold' }}>
                            {img.message || 'Image'}
                        </p>
                        <p style={{ fontSize: '10px', color: '#999', wordBreak: 'break-all' }}>
                            {img.imageUrl}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ImageGallery;
