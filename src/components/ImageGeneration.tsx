import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Link, Play, Settings2 } from 'lucide-react';

export function ImageGeneration() {
  const [prompts, setPrompts] = useState('');
  const [isChain, setIsChain] = useState(true);
  const { addChainTasks, addTask, accounts } = useStore();

  const handleStart = () => {
    if (!prompts.trim()) return;
    
    const promptList = prompts.split('\\n\\n').filter(p => p.trim() !== '');
    
    if (promptList.length === 0) return;

    if (isChain) {
      addChainTasks(promptList, 'image');
    } else {
      promptList.forEach(prompt => {
        addTask({ type: 'image', prompt });
      });
    }
    
    setPrompts('');
  };

  const validAccounts = accounts.filter(a => a.status === 'valid').length;

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            Image Generation
            {isChain && <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded font-medium">Chain Mode</span>}
          </h3>
          <p className="text-sm text-gray-400 mt-1">Generate images from text prompts.</p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isChain}
                onChange={(e) => setIsChain(e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${isChain ? 'bg-emerald-600' : 'bg-[#363640]'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isChain ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="text-sm font-medium text-gray-300 flex items-center gap-1">
              <Link className="w-4 h-4" />
              Chain Generation
            </span>
          </label>
        </div>
      </div>

      <div className="bg-[#25252b] border border-[#363640] rounded-lg flex flex-col flex-1 min-h-[400px]">
        <div className="p-3 border-b border-[#363640] bg-[#18181c] rounded-t-lg flex items-center justify-between">
          <span className="text-sm text-gray-400 font-medium">
            Enter Prompts (separate with double blank line)
          </span>
          <button className="text-xs text-gray-400 hover:text-white flex items-center gap-1">
            <Settings2 className="w-3 h-3" />
            Settings
          </button>
        </div>
        
        <textarea
          value={prompts}
          onChange={(e) => setPrompts(e.target.value)}
          className="flex-1 w-full bg-transparent text-gray-200 p-4 resize-none focus:outline-none placeholder-gray-600 font-mono text-sm leading-relaxed"
          placeholder={`Prompt 1: A hyper-realistic wide-angle cinematic shot of a construction site...\n\nPrompt 2: The construction continues at a steady timelapse speed...\n\nPrompt 3: As the light shifts into the afternoon, the team moves to the second level...`}
        />

        <div className="p-4 border-t border-[#363640] bg-[#18181c] rounded-b-lg flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {validAccounts > 0 ? (
              <span className="text-emerald-400">{validAccounts} Accounts Ready</span>
            ) : (
              <span className="text-red-400">No valid accounts connected</span>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setPrompts('')}
              className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Clear All
            </button>
            <button 
              onClick={handleStart}
              disabled={validAccounts === 0 || !prompts.trim()}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-[#363640] disabled:text-gray-500 text-white px-6 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Generation
            </button>
          </div>
        </div>
      </div>
      
      {isChain && (
        <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-300">
          <strong>Chain Mode Active:</strong> The first prompt will generate an image. Subsequent prompts will use the previous image as a reference to maintain consistency across the story.
        </div>
      )}
    </div>
  );
}
