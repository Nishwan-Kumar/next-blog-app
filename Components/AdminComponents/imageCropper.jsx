"use client";
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

export default function ImageCropper({ image, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);

  const onCropDone = async () => {
    try {
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = image;
      await new Promise((resolve) => (img.onload = resolve));

      const ctx = canvas.getContext('2d');
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        onCropComplete(blob);
      }, 'image/png');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-80 p-4">
      <div className="relative w-full max-w-lg h-96 bg-gray-900 rounded-lg overflow-hidden">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1} // Matches your pill-shaped layout (Width:Height)
          onCropChange={onCropChange}
          onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
          onZoomChange={onZoomChange}
          cropShape="round" // This helps visualize the pill shape
          showGrid={false}
        />
      </div>
      <div className="mt-4 flex gap-4">
        <button onClick={onCancel} className="px-6 py-2 bg-gray-500 text-white rounded">Cancel</button>
        <button onClick={onCropDone} className="px-6 py-2 bg-blue-600 text-white rounded">Crop & Save</button>
      </div>
    </div>
  );
}