import React, { useState } from 'react';
import PromptInput from './PromptInput';
import StylePresets from './StylePresets';
import ImageDisplay from './ImageDisplay';
import GenerationSettings from './GenerationSettings';

const GenerateView = ({ user, addToHistory, useCredits }) => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [settings, setSettings] = useState({
    size: '1024x1024',
    quality: 'standard',
    style: 'vivid'
  });

  const handleGenerate = async () => {
    if (!prompt.trim() || user.credits < 1) return;
    
    setIsGenerating(true);
    
    try {
      // Construct the full prompt with style preset
      let fullPrompt = prompt;
      if (selectedPreset) {
        fullPrompt = `${prompt}, ${selectedPreset.promptModifier}`;
      }
      if (negativePrompt) {
        fullPrompt += `. Avoid: ${negativePrompt}`;
      }

      // Simulate API call (replace with actual OpenAI API call)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock generated image (in real implementation, use OpenAI API)
      const mockImage = {
        id: Date.now(),
        url: `https://picsum.photos/1024/1024?random=${Date.now()}`,
        prompt: fullPrompt,
        settings,
        createdAt: new Date().toISOString(),
      };
      
      setGeneratedImages([mockImage]);
      useCredits(1);
      
      // Add to history
      addToHistory({
        id: Date.now(),
        prompt: fullPrompt,
        negativePrompt,
        stylePreset: selectedPreset?.name || 'None',
        imageUrls: [mockImage.url],
        createdAt: new Date().toISOString(),
        status: 'completed'
      });
      
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Enter your AI Image prompt...
        </h1>
        <p className="text-textSecondary text-lg">
          Craft detailed prompts and watch your ideas come to life
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PromptInput
            prompt={prompt}
            setPrompt={setPrompt}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            canGenerate={prompt.trim() && user.credits >= 1}
          />
          
          <StylePresets
            selectedPreset={selectedPreset}
            setSelectedPreset={setSelectedPreset}
          />
          
          <ImageDisplay
            images={generatedImages}
            isGenerating={isGenerating}
          />
        </div>
        
        <div className="space-y-6">
          <GenerationSettings
            settings={settings}
            setSettings={setSettings}
          />
        </div>
      </div>
    </div>
  );
};

export default GenerateView;