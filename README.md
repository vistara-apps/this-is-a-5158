# PixelFlow - AI-Powered Image Generation Studio

PixelFlow is a modern web application that enables users to generate high-quality, stylized images using advanced AI models. Built with React, Tailwind CSS, and integrated with Stability.ai and OpenAI APIs.

## 🚀 Features

### Core Features
- **Advanced Prompt Input**: Craft detailed prompts with guidance and examples for effective prompt engineering
- **Style & Aesthetic Presets**: Curated library of visual style presets (Photorealistic, Cyberpunk, Watercolor, Vintage)
- **Batch Image Generation**: Generate multiple images simultaneously with batch processing
- **Template-Based Generation**: Pre-defined templates for common use cases (social media posts, blog headers, product mockups)

### Additional Features
- **User Authentication**: Secure sign-up/sign-in with Supabase Auth
- **Credit System**: Subscription-based credit system with Stripe integration
- **Generation History**: Save and view all your generated images
- **Real-time Generation**: Live progress tracking and error handling
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **AI APIs**: Stability.ai (Primary), OpenAI DALL-E (Fallback)
- **Payments**: Stripe
- **UI Components**: Lucide React Icons
- **Notifications**: React Hot Toast

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- A Supabase account and project
- Stability.ai API key
- OpenAI API key (optional, for fallback)
- Stripe account for payments

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-5158.git
   cd this-is-a-5158
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your API keys and configuration:
   ```env
   # API Keys
   VITE_STABILITY_API_KEY=your_stability_api_key_here
   VITE_OPENAI_API_KEY=your_openai_api_key_here

   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

   # Stripe Configuration
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

   # App Configuration
   VITE_APP_URL=http://localhost:5173
   VITE_API_BASE_URL=http://localhost:5173/api
   ```

4. **Set up Supabase Database**
   
   Run these SQL commands in your Supabase SQL editor:

   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
     email TEXT,
     credits INTEGER DEFAULT 10,
     subscription_tier TEXT DEFAULT 'free',
     stripe_customer_id TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Generations table
   CREATE TABLE generations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
     prompt TEXT NOT NULL,
     negative_prompt TEXT,
     style_preset TEXT,
     image_urls TEXT[],
     settings JSONB,
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Presets table
   CREATE TABLE presets (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
     name TEXT NOT NULL,
     prompt_modifier TEXT,
     style_tags TEXT[],
     is_public BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   ALTER TABLE generations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE presets ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = user_id);
   CREATE POLICY "Users can view own generations" ON generations FOR SELECT USING (auth.uid() = user_id);
   CREATE POLICY "Users can create generations" ON generations FOR INSERT WITH CHECK (auth.uid() = user_id);
   CREATE POLICY "Users can view own presets" ON presets FOR SELECT USING (auth.uid() = user_id OR is_public = true);
   CREATE POLICY "Users can manage own presets" ON presets FOR ALL USING (auth.uid() = user_id);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🔑 API Setup

### Stability.ai Setup
1. Sign up at [Stability.ai](https://platform.stability.ai/)
2. Generate an API key from your dashboard
3. Add the key to your `.env` file as `VITE_STABILITY_API_KEY`

### OpenAI Setup (Optional)
1. Sign up at [OpenAI](https://platform.openai.com/)
2. Generate an API key from your dashboard
3. Add the key to your `.env` file as `VITE_OPENAI_API_KEY`

### Supabase Setup
1. Create a new project at [Supabase](https://supabase.com/)
2. Get your project URL and anon key from Settings > API
3. Add them to your `.env` file
4. Run the SQL commands provided above to set up the database schema

### Stripe Setup
1. Create a Stripe account at [Stripe](https://stripe.com/)
2. Get your publishable key from the dashboard
3. Add it to your `.env` file as `VITE_STRIPE_PUBLISHABLE_KEY`
4. Set up webhook endpoints for subscription management

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── Auth/            # Authentication components
│   ├── GenerateView.jsx # Main image generation interface
│   ├── BatchView.jsx    # Batch generation interface
│   ├── TemplatesView.jsx# Template-based generation
│   ├── HistoryView.jsx  # Generation history
│   └── AccountView.jsx  # User account management
├── contexts/            # React contexts
│   └── AuthContext.jsx  # Authentication context
├── services/            # API services
│   ├── stabilityApi.js  # Stability.ai integration
│   ├── supabase.js      # Supabase client and helpers
│   └── stripe.js        # Stripe payment integration
├── App.jsx              # Main application component
└── main.jsx             # Application entry point
```

## 🎨 Design System

The application uses a comprehensive design system with:

- **Colors**: Dark theme with purple/blue accents
- **Typography**: Responsive text scales
- **Spacing**: Consistent spacing tokens
- **Components**: Reusable UI components
- **Animations**: Smooth transitions and loading states

## 📱 Usage

1. **Sign Up/Sign In**: Create an account or sign in to access features
2. **Generate Images**: Enter prompts and select style presets to generate images
3. **Batch Generation**: Upload multiple prompts for batch processing
4. **Use Templates**: Select from pre-made templates for specific use cases
5. **View History**: Access all your previously generated images
6. **Manage Account**: View credits, upgrade subscription, and manage settings

## 🔒 Security

- Row Level Security (RLS) enabled on all database tables
- API keys stored securely in environment variables
- User authentication handled by Supabase Auth
- Payment processing secured by Stripe

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Ensure environment variables are set in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, please contact [support@pixelflow.com](mailto:support@pixelflow.com) or create an issue in this repository.

## 🔮 Roadmap

- [ ] Advanced editing tools
- [ ] Image upscaling
- [ ] Custom model training
- [ ] API access for developers
- [ ] Mobile app
- [ ] Collaborative workspaces

---

Built with ❤️ by the PixelFlow team
