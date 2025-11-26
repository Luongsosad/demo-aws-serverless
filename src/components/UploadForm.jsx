import React, { useState } from 'react';
import { getUploadUrl, uploadFileToS3, saveMessage } from '../services/api';

const UploadForm = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            // 1. Get Presigned URL
            const { uploadUrl, fileUrl } = await getUploadUrl();

            // 2. Upload to S3
            await uploadFileToS3(uploadUrl, file);

            // 3. Save metadata (and get CloudFront URL)
            await saveMessage(fileUrl);

            // Reset form
            setFile(null);
            setPreview(null);
            if (onUploadSuccess) onUploadSuccess();
        } catch (err) {
            console.error(err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Upload Image</h2>

            <div className="mb-6">
                <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${preview ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:bg-gray-50'
                        }`}
                >
                    {preview ? (
                        <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-lg" />
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                        </div>
                    )}
                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </label>
            </div>

            {error && (
                <div className="mb-4 text-red-500 text-sm text-center bg-red-50 p-2 rounded">
                    {error}
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-200 ${!file || uploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
            >
                {uploading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                    </span>
                ) : (
                    'Upload to S3'
                )}
            </button>
        </div>
    );
};

export default UploadForm;
