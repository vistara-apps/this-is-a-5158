import React, { useState } from 'react';
import toast from 'react-hot-toast';
import PromptInput from './PromptInput';
import StylePresets from './StylePresets';
import ImageDisplay from './ImageDisplay';
import GenerationSettings from './GenerationSettings';
import { generateImage, generateImageWithDALLE } from '../services/stabilityApi';
import { saveGeneration } from '../services/supabase';

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
    if (!prompt.trim() || !user || user.credits < 1) {
      toast.error('Insufficient credits or invalid prompt');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Construct the full prompt with style preset
      let fullPrompt = prompt;
      if (selectedPreset) {
        fullPrompt = `${prompt}, ${selectedPreset.promptModifier}`;
      }

      // Use credits first
      const creditsUsed = await useCredits(1);
      if (!creditsUsed) {
        toast.error('Failed to use credits');
        return;
      }

      let images;
      
      // Try Stability AI first, fallback to DALL-E
      try {
        images = await generateImage(fullPrompt, {
          negativePrompt,
          width: parseInt(settings.size.split('x')[0]),
          height: parseInt(settings.size.split('x')[1]),
          style: selectedPreset?.id || 'enhance'
        });
      } catch (stabilityError) {
        console.warn('Stability AI failed, trying DALL-E:', stabilityError);
        images = await generateImageWithDALLE(fullPrompt, {
          size: settings.size,
          quality: settings.quality,
          style: settings.style
        });
      }
      
      setGeneratedImages(images);
      
      // Save to database
      const generation = {
        user_id: user.user_id,
        prompt: fullPrompt,
        negative_prompt: negativePrompt,
        style_preset: selectedPreset?.name || 'None',
        image_urls: images.map(img => img.url),
        settings: JSON.stringify(settings),
        created_at: new Date().toISOString(),
        status: 'completed'
      };

      const savedGeneration = await saveGeneration(generation);
      
      // Add to local history
      addToHistory(savedGeneration);
      
      toast.success('Image generated successfully!');
      
    } catch (error) {
      console.error('Generation failed:', error);
      toast.error(error.message || 'Failed to generate image');
      
      // Refund credits on failure
      try {
        await useCredits(-1); // Add credit back
      } catch (refundError) {
        console.error('Failed to refund credits:', refundError);
      }
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
