import React from 'react';
import { Download, Share, Heart, MoreHorizontal } from 'lucide-react';

const ImageDisplay = ({ images, isGenerating }) => {
  const handleDownload = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'generated-image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isGenerating) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="aspect-square bg-bg rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-textSecondary">Generating your image...</p>
          </div>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="aspect-square bg-bg rounded-lg flex items-center justify-center border-2 border-dashed border-border">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-border rounded-full flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <p className="text-textSecondary">Your generated images will appear here</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl p-6 border border-border">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((image) => (
          <div key={image.id} className="group relative">
            <div className="aspect-square bg-bg rounded-lg overflow-hidden">
              <img
                src={image.url}
                alt="Generated"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="flex space-x-3">
                <button
                  onClick={() => handleDownload(image.url, `pixelflow-${image.id}.jpg`)}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <Download className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <Share className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <Heart className="w-5 h-5 text-white" />
                </button>
                <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageDisplay;