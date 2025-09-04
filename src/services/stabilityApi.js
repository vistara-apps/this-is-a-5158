import axios from 'axios';

const STABILITY_API_KEY = import.meta.env.VITE_STABILITY_API_KEY;
const STABILITY_BASE_URL = 'https://api.stability.ai/v1';

const stabilityApi = axios.create({
  baseURL: STABILITY_BASE_URL,
  headers: {
    'Authorization': `Bearer ${STABILITY_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const generateImage = async (prompt, options = {}) => {
  try {
    const {
      negativePrompt = '',
      width = 1024,
      height = 1024,
      steps = 30,
      seed = Math.floor(Math.random() * 1000000),
      cfgScale = 7,
      samples = 1,
      style = 'enhance'
    } = options;

    const response = await stabilityApi.post('/generation/stable-diffusion-v1-6/text-to-image', {
      text_prompts: [
        {
          text: prompt,
          weight: 1
        },
        ...(negativePrompt ? [{
          text: negativePrompt,
          weight: -1
        }] : [])
      ],
      cfg_scale: cfgScale,
      height,
      width,
      samples,
      steps,
      seed,
      style_preset: style
    });

    // Convert base64 images to blob URLs
    const images = response.data.artifacts.map((artifact, index) => ({
      id: `${Date.now()}-${index}`,
      url: `data:image/png;base64,${artifact.base64}`,
      seed: artifact.seed,
      finishReason: artifact.finishReason
    }));

    return images;
  } catch (error) {
    console.error('Stability API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to generate image');
  }
};

export const generateImageBatch = async (prompts, options = {}) => {
  const results = [];
  const errors = [];

  for (let i = 0; i < prompts.length; i++) {
    try {
      const images = await generateImage(prompts[i], options);
      results.push({
        prompt: prompts[i],
        images,
        index: i
      });
      
      // Add delay to respect rate limits
      if (i < prompts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      errors.push({
        prompt: prompts[i],
        error: error.message,
        index: i
      });
    }
  }

  return { results, errors };
};

// Alternative: OpenAI DALL-E integration
export const generateImageWithDALLE = async (prompt, options = {}) => {
  try {
    const { size = '1024x1024', quality = 'standard', style = 'vivid' } = options;
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        quality,
        style
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.data.map((image, index) => ({
      id: `${Date.now()}-${index}`,
      url: image.url,
      revisedPrompt: image.revised_prompt
    }));
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate image with DALL-E');
  }
};

export const getEngineList = async () => {
  try {
    const response = await stabilityApi.get('/engines/list');
    return response.data;
  } catch (error) {
    console.error('Failed to get engine list:', error);
    return [];
  }
};

export const getAccountBalance = async () => {
  try {
    const response = await stabilityApi.get('/user/balance');
    return response.data;
  } catch (error) {
    console.error('Failed to get account balance:', error);
    return null;
  }
};
