import { useState } from 'react';
import { Layout } from './components/Layout';
import { AccountManager } from './components/AccountManager';
import { ImageGeneration } from './components/ImageGeneration';
import { VideoGeneration } from './components/VideoGeneration';

export default function App() {
  const [activeTab, setActiveTab] = useState('image');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'image' && <ImageGeneration />}
      {activeTab === 'video' && <VideoGeneration />}
      {activeTab === 'accounts' && <AccountManager />}
      {activeTab === 'settings' && (
        <div className="max-w-2xl mx-auto py-12 text-center text-gray-400">
          <h2 className="text-2xl font-semibold text-white mb-2">Settings</h2>
          <p>Configure API endpoints, default models, and UI preferences here.</p>
        </div>
      )}
    </Layout>
  );
}
