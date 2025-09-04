import React from 'react';

const GenerationSettings = ({ settings, setSettings }) => {
  const sizeOptions = [
    { value: '1024x1024', label: '1024×1024 (Square)' },
    { value: '1024x1792', label: '1024×1792 (Portrait)' },
    { value: '1792x1024', label: '1792×1024 (Landscape)' },
  ];

  const qualityOptions = [
    { value: 'standard', label: 'Standard' },
    { value: 'hd', label: 'HD' },
  ];

  const styleOptions = [
    { value: 'vivid', label: 'Vivid' },
    { value: 'natural', label: 'Natural' },
  ];

  return (
    <div className="bg-surface rounded-xl p-6 border border-border space-y-6">
      <h3 className="text-lg font-semibold">Generation Settings</h3>
      
      <div>
        <label className="block text-sm font-medium mb-3">Image Size</label>
        <div className="space-y-2">
          {sizeOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="size"
                value={option.value}
                checked={settings.size === option.value}
                onChange={(e) => setSettings(prev => ({ ...prev, size: e.target.value }))}
                className="w-4 h-4 text-primary bg-bg border-border focus:ring-primary focus:ring-2"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-3">Quality</label>
        <div className="space-y-2">
          {qualityOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="quality"
                value={option.value}
                checked={settings.quality === option.value}
                onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value }))}
                className="w-4 h-4 text-primary bg-bg border-border focus:ring-primary focus:ring-2"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-3">Style</label>
        <div className="space-y-2">
          {styleOptions.map((option) => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="style"
                value={option.value}
                checked={settings.style === option.value}
                onChange={(e) => setSettings(prev => ({ ...prev, style: e.target.value }))}
                className="w-4 h-4 text-primary bg-bg border-border focus:ring-primary focus:ring-2"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="pt-4 border-t border-border">
        <div className="flex justify-between text-sm mb-2">
          <span>Credit Cost</span>
          <span className="font-medium">1 credit</span>
        </div>
        <div className="flex justify-between text-sm text-textSecondary">
          <span>Estimated Time</span>
          <span>5-10 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default GenerationSettings;