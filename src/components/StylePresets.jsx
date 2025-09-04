import React from 'react';

const StylePresets = ({ selectedPreset, setSelectedPreset }) => {
  const presets = [
    {
      id: 'photorealistic',
      name: 'Photorealistic',
      promptModifier: 'photorealistic, high detail, professional photography, 8k resolution',
      preview: 'https://picsum.photos/120/80?random=1'
    },
    {
      id: 'cyberpunk',
      name: 'Cyberpunk',
      promptModifier: 'cyberpunk style, neon lights, futuristic, digital art, vibrant colors',
      preview: 'https://picsum.photos/120/80?random=2'
    },
    {
      id: 'watercolor',
      name: 'Watercolor',
      promptModifier: 'watercolor painting, soft brushstrokes, artistic, flowing colors',
      preview: 'https://picsum.photos/120/80?random=3'
    },
    {
      id: 'vintage',
      name: 'Vintage',
      promptModifier: 'vintage style, retro, aged, classic aesthetic, warm tones',
      preview: 'https://picsum.photos/120/80?random=4'
    },
    {
      id: 'minimalist',
      name: 'Minimalist',
      promptModifier: 'minimalist, clean, simple, geometric, modern design',
      preview: 'https://picsum.photos/120/80?random=5'
    },
    {
      id: 'fantasy',
      name: 'Fantasy',
      promptModifier: 'fantasy art, magical, ethereal, mystical, enchanted',
      preview: 'https://picsum.photos/120/80?random=6'
    },
    {
      id: 'cartoon',
      name: 'Cartoon',
      promptModifier: 'cartoon style, animated, colorful, playful, illustrated',
      preview: 'https://picsum.photos/120/80?random=7'
    },
    {
      id: 'abstract',
      name: 'Abstract',
      promptModifier: 'abstract art, non-representational, artistic, creative, unique patterns',
      preview: 'https://picsum.photos/120/80?random=8'
    }
  ];

  return (
    <div className="bg-surface rounded-xl p-6 border border-border">
      <h3 className="text-lg font-semibold mb-4">Style Presets</h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => setSelectedPreset(selectedPreset?.id === preset.id ? null : preset)}
            className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
              selectedPreset?.id === preset.id
                ? 'border-primary shadow-lg scale-105'
                : 'border-border hover:border-primary/50 hover:scale-102'
            }`}
          >
            <div className="aspect-video bg-bg">
              <img
                src={preset.preview}
                alt={preset.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-2">
              <p className="text-white text-xs font-medium truncate">
                {preset.name}
              </p>
            </div>
            {selectedPreset?.id === preset.id && (
              <div className="absolute top-2 right-2">
                <div className="w-4 h-4 bg-primary rounded-full border-2 border-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      
      {selectedPreset && (
        <div className="mt-4 p-4 bg-bg rounded-lg border border-border">
          <h4 className="font-medium mb-2">{selectedPreset.name} Style</h4>
          <p className="text-sm text-textSecondary">
            {selectedPreset.promptModifier}
          </p>
        </div>
      )}
    </div>
  );
};

export default StylePresets;