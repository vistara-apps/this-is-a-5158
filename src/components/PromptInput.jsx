import React from 'react';
import { Sparkles, Wand2 } from 'lucide-react';

const PromptInput = ({ 
  prompt, 
  setPrompt, 
  negativePrompt, 
  setNegativePrompt, 
  onGenerate, 
  isGenerating, 
  canGenerate 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (canGenerate && !isGenerating) {
      onGenerate();
    }
  };

  const examplePrompts = [
    "A serene mountain landscape at golden hour",
    "A futuristic cityscape with neon lights",
    "A cozy coffee shop in autumn",
    "An underwater coral reef scene"
  ];

  return (
    <div className="bg-surface rounded-xl p-6 border border-border">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Main Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full h-32 px-4 py-3 bg-bg border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={4}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Negative Prompt (Optional)
          </label>
          <input
            type="text"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="What to avoid in the image..."
            className="w-full px-4 py-3 bg-bg border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={!canGenerate || isGenerating}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 gradient-accent text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-hover transition-all"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Image</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            className="px-4 py-3 bg-surface border border-border rounded-lg hover:bg-bg transition-colors"
          >
            <Wand2 className="w-5 h-5" />
          </button>
        </div>
      </form>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium mb-3 text-textSecondary">Example Prompts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {examplePrompts.map((example, index) => (
            <button
              key={index}
              onClick={() => setPrompt(example)}
              className="text-left p-3 bg-bg rounded-lg hover:bg-border/50 transition-colors text-sm"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromptInput;