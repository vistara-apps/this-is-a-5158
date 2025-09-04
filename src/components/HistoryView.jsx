import React, { useState } from 'react';
import { Calendar, Download, Eye, Trash2, Search } from 'lucide-react';

const HistoryView = ({ history }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredHistory = history
    .filter(item => 
      item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.stylePreset.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadImage = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename || 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Generation History
        </h1>
        <p className="text-textSecondary text-lg">
          Browse and manage your previous AI-generated images
        </p>
      </div>
      
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-textSecondary absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search prompts or styles..."
              className="w-full pl-10 pr-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
        
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-border rounded-full flex items-center justify-center">
              <Calendar className="w-8 h-8 text-textSecondary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No generations found</h3>
            <p className="text-textSecondary">
              {searchTerm ? 'Try adjusting your search terms' : 'Start generating images to see them here'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item) => (
              <div key={item.id} className="bg-bg rounded-lg border border-border overflow-hidden group">
                <div className="aspect-square relative">
                  {item.imageUrls.length > 0 ? (
                    <img
                      src={item.imageUrls[0]}
                      alt="Generated"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-border flex items-center justify-center">
                      <span className="text-textSecondary">No image</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          if (item.imageUrls[0]) {
                            window.open(item.imageUrls[0], '_blank');
                          }
                        }}
                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => downloadImage(item.imageUrls[0], `pixelflow_${item.id}.jpg`)}
                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                  
                  {item.imageUrls.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      +{item.imageUrls.length - 1} more
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <p className="text-sm font-medium mb-2 line-clamp-2">
                    {item.prompt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-textSecondary mb-2">
                    <span className="bg-border px-2 py-1 rounded">
                      {item.stylePreset}
                    </span>
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {item.status}
                    </span>
                    
                    <button className="p-1 text-textSecondary hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryView;