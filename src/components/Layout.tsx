import React from 'react';
import { LayoutDashboard, Image as ImageIcon, Video, Users, Settings, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { QueuePanel } from './QueuePanel';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Layout({ children, activeTab, setActiveTab }: LayoutProps) {
  const navItems = [
    { id: 'image', label: 'Image Generation', icon: ImageIcon },
    { id: 'video', label: 'Video Generation', icon: Video },
    { id: 'accounts', label: 'Account Manager', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen w-full bg-[#1e1e24] text-gray-300 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#18181c] border-r border-[#2d2d35] flex flex-col">
        <div className="p-4 border-b border-[#2d2d35] flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">VEO Studio</h1>
        </div>
        
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors",
                activeTab === item.id 
                  ? "bg-[#2d2d35] text-emerald-400 border-r-2 border-emerald-500" 
                  : "text-gray-400 hover:bg-[#25252b] hover:text-gray-200"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2d2d35] text-xs text-gray-500">
          <p>Your Plan: Pro</p>
          <p>Max Concurrent: 12</p>
          <p>Expires: 40 days</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e24]">
        <header className="h-14 border-b border-[#2d2d35] flex items-center px-6 bg-[#18181c]">
          <h2 className="text-lg font-semibold text-gray-200">
            {navItems.find(i => i.id === activeTab)?.label}
          </h2>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>

      {/* Right Queue Panel */}
      <QueuePanel />
    </div>
  );
}
