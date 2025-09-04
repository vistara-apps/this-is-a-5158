import React from 'react';
import { User, CreditCard, Zap, Crown, Star, Settings } from 'lucide-react';

const AccountView = ({ user, setUser }) => {
  const subscriptionTiers = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$10',
      period: '/month',
      credits: 100,
      features: [
        '100 image generations per month',
        'Standard quality images',
        'Basic style presets',
        'Download images',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$25',
      period: '/month',
      credits: 300,
      features: [
        '300 image generations per month',
        'HD quality images',
        'All style presets',
        'Batch generation',
        'Template access',
        'Priority support',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$75',
      period: '/month',
      credits: 1000,
      features: [
        '1000 image generations per month',
        'Highest quality images',
        'Custom style presets',
        'API access',
        'Advanced batch tools',
        'Dedicated support',
      ],
    },
  ];

  const usageData = [
    { label: 'Images Generated', value: '127', period: 'this month' },
    { label: 'Credits Used', value: '127', period: 'this month' },
    { label: 'Downloads', value: '89', period: 'total' },
    { label: 'Batch Jobs', value: '12', period: 'this month' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">
          Account Settings
        </h1>
        <p className="text-textSecondary text-lg">
          Manage your subscription, usage, and preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Profile Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full px-4 py-3 bg-bg border border-border rounded-lg"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subscription</label>
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-accent" />
                    <span className="font-medium">{user.subscriptionTier} Plan</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Credits Remaining</label>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="font-medium">{user.credits} credits</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {usageData.map((stat, index) => (
                <div key={index} className="bg-bg p-4 rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-textSecondary">
                    {stat.period}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Monthly Credit Usage</span>
                <span>127 / 300</span>
              </div>
              <div className="w-full bg-bg rounded-full h-2">
                <div 
                  className="gradient-accent h-2 rounded-full"
                  style={{ width: '42%' }}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Subscription Plans
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscriptionTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`relative p-4 rounded-lg border-2 ${
                    tier.popular
                      ? 'border-primary bg-primary/5'
                      : user.subscriptionTier.toLowerCase() === tier.id
                      ? 'border-accent bg-accent/5'
                      : 'border-border bg-bg'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-white text-xs px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h4 className="font-semibold text-lg">{tier.name}</h4>
                    <div className="text-2xl font-bold">
                      {tier.price}
                      <span className="text-sm font-normal text-textSecondary">{tier.period}</span>
                    </div>
                    <p className="text-sm text-textSecondary">{tier.credits} credits</p>
                  </div>
                  
                  <ul className="space-y-2 mb-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <Star className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      user.subscriptionTier.toLowerCase() === tier.id
                        ? 'bg-accent text-white cursor-default'
                        : tier.popular
                        ? 'gradient-accent text-white hover:shadow-hover'
                        : 'bg-bg border border-border hover:bg-border/50'
                    }`}
                    disabled={user.subscriptionTier.toLowerCase() === tier.id}
                  >
                    {user.subscriptionTier.toLowerCase() === tier.id ? 'Current Plan' : 'Upgrade'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Preferences
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary bg-bg border-border rounded focus:ring-primary"
                    defaultChecked
                  />
                  <span className="text-sm">Email notifications</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary bg-bg border-border rounded focus:ring-primary"
                    defaultChecked
                  />
                  <span className="text-sm">Auto-download generated images</span>
                </label>
              </div>
              
              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary bg-bg border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm">Save prompts automatically</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Default image quality</label>
                <select className="w-full px-3 py-2 bg-bg border border-border rounded-lg text-sm">
                  <option>Standard</option>
                  <option>HD</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-surface rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-bg rounded-lg hover:bg-border/50 transition-colors">
                Download all images
              </button>
              <button className="w-full text-left px-4 py-3 bg-bg rounded-lg hover:bg-border/50 transition-colors">
                Export generation history
              </button>
              <button className="w-full text-left px-4 py-3 bg-bg rounded-lg hover:bg-border/50 transition-colors">
                Manage billing
              </button>
              <button className="w-full text-left px-4 py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
                Delete account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountView;