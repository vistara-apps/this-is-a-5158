import React, { useState } from 'react';
import { Upload, Download, Trash2, Plus } from 'lucide-react';
import JSZip from 'jszip';

const BatchView = ({ user, addToHistory, useCredits }) => {
  const [prompts, setPrompts] = useState(['']);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBatch, setGeneratedBatch] = useState([]);
  const [progress, setProgress] = useState(0);

  const stylePresets = [
    { id: 'photorealistic', name: 'Photorealistic', promptModifier: 'photorealistic, high detail, professional photography' },
    { id: 'cyberpunk', name: 'Cyberpunk', promptModifier: 'cyberpunk style, neon lights, futuristic' },
    { id: 'watercolor', name: 'Watercolor', promptModifier: 'watercolor painting, soft brushstrokes' },
    { id: 'vintage', name: 'Vintage', promptModifier: 'vintage style, retro, aged' },
  ];

  const addPrompt = () => {
    setPrompts([...prompts, '']);
  };

  const updatePrompt = (index, value) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const removePrompt = (index) => {
    if (prompts.length > 1) {
      setPrompts(prompts.filter((_, i) => i !== index));
    }
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        setPrompts(lines);
      };
      reader.readAsText(file);
    }
  };

  const generateBatch = async () => {
    const validPrompts = prompts.filter(p => p.trim());
    if (validPrompts.length === 0 || user.credits < validPrompts.length) return;

    setIsGenerating(true);
    setProgress(0);
    setGeneratedBatch([]);

    try {
      const results = [];
      
      for (let i = 0; i < validPrompts.length; i++) {
        let fullPrompt = validPrompts[i];
        if (selectedPreset) {
          fullPrompt = `${validPrompts[i]}, ${selectedPreset.promptModifier}`;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockImage = {
          id: Date.now() + i,
          url: `https://picsum.photos/512/512?random=${Date.now() + i}`,
          prompt: fullPrompt,
          originalPrompt: validPrompts[i],
        };
        
        results.push(mockImage);
        setProgress(((i + 1) / validPrompts.length) * 100);
        setGeneratedBatch([...results]);
      }

      useCredits(validPrompts.length);
      
      // Add to history
      addToHistory({
        id: Date.now(),
        prompt: `Batch generation: ${validPrompts.length} images`,
        stylePreset: selectedPreset?.name || 'None',
        imageUrls: results.map(r => r.url),
        createdAt: new Date().toISOString(),
        status: 'completed'
      });
      
    } catch (error) {
      console.error('Batch generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadBatch = async () => {
    if (generatedBatch.length === 0) return;

    const zip = new JSZip();
    
    for (let i = 0; i < generatedBatch.length; i++) {
      const image = generatedBatch[i];
      try {
        const response = await fetch(image.url);
        const blob = await response.blob();
        zip.file(`image_${i + 1}.jpg`, blob);
      } catch (error) {
        console.error('Failed to download image:', error);
      }
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `pixelflow_batch_${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Batch Generation
        </h1>
        <p className="text-textSecondary text-lg">
          Generate multiple images at once from a list of prompts
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-surface rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Prompt List</h3>
              <div className="flex space-x-2">
                <label className="px-3 py-2 bg-bg border border-border rounded-lg hover:bg-border/50 transition-colors cursor-pointer text-sm">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Upload CSV
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleCSVUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={addPrompt}
                  className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add
                </button>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {prompts.map((prompt, index) => (
                <div key={index} className="flex space-x-2">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => updatePrompt(index, e.target.value)}
                    placeholder={`Prompt ${index + 1}...`}
                    className="flex-1 px-3 py-2 bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                  />
                  {prompts.length > 1 && (
                    <button
                      onClick={() => removePrompt(index)}
                      className="p-2 text-textSecondary hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Style Preset</h3>
            <div className="grid grid-cols-2 gap-3">
              {stylePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedPreset(selectedPreset?.id === preset.id ? null : preset)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedPreset?.id === preset.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-bg hover:border-primary/50'
                  }`}
                >
                  <div className="font-medium text-sm">{preset.name}</div>
                </button>
              ))}
            </div>
          </div>
          
          <div className="bg-surface rounded-xl p-6 border border-border">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold">Generation Summary</h3>
                <p className="text-sm text-textSecondary">
                  {prompts.filter(p => p.trim()).length} prompts • {prompts.filter(p => p.trim()).length} credits required
                </p>
              </div>
              <button
                onClick={generateBatch}
                disabled={prompts.filter(p => p.trim()).length === 0 || user.credits < prompts.filter(p => p.trim()).length || isGenerating}
                className="px-6 py-3 gradient-accent text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-hover transition-all"
              >
                {isGenerating ? 'Generating...' : 'Generate Batch'}
              </button>
            </div>
            
            {isGenerating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-bg rounded-full h-2">
                  <div 
                    className="gradient-accent h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-surface rounded-xl p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generated Images</h3>
              {generatedBatch.length > 0 && (
                <button
                  onClick={downloadBatch}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download ZIP
                </button>
              )}
            </div>
            
            {generatedBatch.length === 0 ? (
              <div className="aspect-square bg-bg rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-border rounded-full flex items-center justify-center">
                    <span className="text-2xl">📦</span>
                  </div>
                  <p className="text-textSecondary">Generated images will appear here</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {generatedBatch.map((image) => (
                  <div key={image.id} className="group relative">
                    <div className="aspect-square bg-bg rounded-lg overflow-hidden">
                      <img
                        src={image.url}
                        alt="Generated"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = image.url;
                          link.download = `batch_image_${image.id}.jpg`;
                          link.click();
                        }}
                        className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchView;