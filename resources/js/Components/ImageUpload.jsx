import React, { useState } from 'react';

export default function ImageUpload({ value, onChange, placeholder = "Tap to Upload" }) {
    const [preview, setPreview] = useState(value || null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file)); 
            onChange(file); 
        }
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <label htmlFor="image-upload" className="cursor-pointer">
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-32 h-32 rounded-full object-cover border"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border">
                        <span className="text-gray-500">{placeholder}</span>
                    </div>
                )}
            </label>
            <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
            />
        </div>
    );
}
