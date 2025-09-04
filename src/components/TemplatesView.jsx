import React, { useState } from 'react';
import { Grid, Instagram, Facebook, Twitter, Monitor, Smartphone } from 'lucide-react';

const TemplatesView = ({ user, addToHistory, useCredits }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const templates = [
    {
      id: 'instagram-post',
      name: 'Instagram Post',
      description: 'Square format perfect for Instagram feeds',
      size: '1080x1080',
      icon: Instagram,
      promptTemplate: 'Create a vibrant, engaging Instagram post image featuring: [PROMPT]. High quality, social media optimized, eye-catching design.',
      category: 'Social Media'
    },
    {
      id: 'instagram-story',
      name: 'Instagram Story',
      description: 'Vertical format for Instagram stories',
      size: '1080x1920',
      icon: Smartphone,
      promptTemplate: 'Design a captivating Instagram story image about: [PROMPT]. Vertical format, modern aesthetic, mobile-friendly.',
      category: 'Social Media'
    },
    {
      id: 'facebook-cover',
      name: 'Facebook Cover',
      description: 'Wide banner for Facebook cover photos',
      size: '1200x630',
      icon: Facebook,
      promptTemplate: 'Create a professional Facebook cover photo featuring: [PROMPT]. Wide banner format, brand-friendly, high impact.',
      category: 'Social Media'
    },
    {
      id: 'twitter-header',
      name: 'Twitter Header',
      description: 'Header banner for Twitter profiles',
      size: '1500x500',
      icon: Twitter,
      promptTemplate: 'Design a striking Twitter header image about: [PROMPT]. Wide banner, professional look, Twitter brand guidelines.',
      category: 'Social Media'
    },
    {
      id: 'blog-header',
      name: 'Blog Header',
      description: 'Wide header image for blog posts',
      size: '1200x600',
      icon: Monitor,
      promptTemplate: 'Create an engaging blog header image for an article about: [PROMPT]. Professional, informative, web-optimized.',
      category: 'Content'
    },
    {
      id: 'product-mockup',
      name: 'Product Mockup',
      description: 'Clean product presentation',
      size: '1200x1200',
      icon: Grid,
      promptTemplate: 'Create a clean, professional product mockup showcasing: [PROMPT]. Minimalist background, commercial photography style.',
      category: 'E-commerce'
    }
  ];

  const categories = [...new Set(templates.map(t => t.category))];

  const handleGenerate = async () => {
    if (!selectedTemplate || !prompt.trim() || user.credits < 1) return;
    
    setIsGenerating(true);
    
    try {
      // Construct the full prompt using template
      const fullPrompt = selectedTemplate.promptTemplate.replace('[PROMPT]', prompt);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockImage = {
        id: Date.now(),
        url: `https://picsum.photos/${selectedTemplate.size.replace('x', '/')}?random=${Date.now()}`,
        prompt: fullPrompt,
        template: selectedTemplate.name,
        size: selectedTemplate.size,
        createdAt: new Date().toISOString(),
      };
      
      setGeneratedImage(mockImage);
      useCredits(1);
      
      // Add to history
      addToHistory({
        id: Date.now(),
        prompt: fullPrompt,
        stylePreset: `Template: ${selectedTemplate.name}`,
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
          Template Generation
        </h1>
        <p className="text-textSecondary text-lg">
          Use pre-designed templates for specific platforms and use cases
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Choose a Template</h3>
            
            {categories.map(category => (
              <div key={category} className="mb-6">
                <h4 className="text-sm font-medium text-textSecondary mb-3 uppercase tracking-wider">
                  {category}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {templates.filter(t => t.category === category).map((template) => {
                    const IconComponent = template.icon;
                    return (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedTemplate?.id === template.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border bg-bg hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <IconComponent className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <h5 className="font-medium text-sm mb-1">{template.name}</h5>
                            <p className="text-xs text-textSecondary mb-2">{template.description}</p>
                            <span className="text-xs bg-border px-2 py-1 rounded">
                              {template.size}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          
          {selectedTemplate && (
            <div className="bg-surface rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4">Customize Your {selectedTemplate.name}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Describe your content
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`What should your ${selectedTemplate.name.toLowerCase()} feature?`}
                    className="w-full h-24 px-4 py-3 bg-bg border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                
                <div className="bg-bg p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Template Preview</h4>
                  <p className="text-sm text-textSecondary">
                    {selectedTemplate.promptTemplate.replace('[PROMPT]', prompt || 'your content')}
                  </p>
                </div>
                
                <button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || user.credits < 1 || isGenerating}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-3 gradient-accent text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-hover transition-all"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <span>Generate {selectedTemplate.name}</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {selectedTemplate && (
            <div className="bg-surface rounded-xl p-6 border border-border">
              <h3 className="text-lg font-semibold mb-4">Template Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-textSecondary">Format</span>
                  <span>{selectedTemplate.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Dimensions</span>
                  <span>{selectedTemplate.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Category</span>
                  <span>{selectedTemplate.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-textSecondary">Cost</span>
                  <span>1 credit</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Generated Image</h3>
            
            {isGenerating ? (
              <div className="aspect-square bg-bg rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-textSecondary">Generating...</p>
                </div>
              </div>
            ) : generatedImage ? (
              <div className="space-y-4">
                <div className="bg-bg rounded-lg overflow-hidden">
                  <img
                    src={generatedImage.url}
                    alt="Generated template"
                    className="w-full h-auto"
                  />
                </div>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generatedImage.url;
                    link.download = `${selectedTemplate.id}_${Date.now()}.jpg`;
                    link.click();
                  }}
                  className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Download Image
                </button>
              </div>
            ) : (
              <div className="aspect-square bg-bg rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-border rounded-full flex items-center justify-center">
                    <span className="text-xl">🎨</span>
                  </div>
                  <p className="text-sm text-textSecondary">Choose a template and generate</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatesView;