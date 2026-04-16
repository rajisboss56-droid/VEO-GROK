import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Play, FolderUp, Settings2, Link } from 'lucide-react';

export function VideoGeneration() {
  const [prompts, setPrompts] = useState('');
  const [isChain, setIsChain] = useState(true);
  const { addChainTasks, addTask, accounts } = useStore();

  const handleStart = () => {
    if (!prompts.trim()) return;
    
    const promptList = prompts.split('\\n\\n').filter(p => p.trim() !== '');
    if (promptList.length === 0) return;

    if (isChain) {
      // In a real app, we would read the images from the selected folder.
      // For mock, we just pass the prompts and simulate video generation.
      addChainTasks(promptList, 'video');
    } else {
      promptList.forEach(prompt => {
        addTask({ type: 'video', prompt });
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
            Video Generation
            {isChain && <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded font-medium">Consistent Story</span>}
          </h3>
          <p className="text-sm text-gray-400 mt-1">Animate images into consistent video stories.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="bg-[#363640] hover:bg-[#454550] text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors">
            <FolderUp className="w-4 h-4" />
            Import Chain Folder
          </button>
        </div>
      </div>

      <div className="bg-[#25252b] border border-[#363640] rounded-lg flex flex-col flex-1 min-h-[400px]">
        <div className="p-3 border-b border-[#363640] bg-[#18181c] rounded-t-lg flex items-center justify-between">
          <span className="text-sm text-gray-400 font-medium">
            Enter Video Prompts (must match image prompts order)
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
          placeholder={`Prompt 1: The camera pans across the hyper-realistic construction site...\n\nPrompt 2: A steady timelapse of the workers assembling the frame...\n\nPrompt 3: The sun sets as the roof is completed, warm lighting...`}
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
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-[#363640] disabled:text-gray-500 text-white px-6 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Video Generation
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-[#25252b] border border-[#363640] rounded-lg text-sm text-gray-300">
        <h4 className="font-medium text-white mb-2">Workflow Instructions:</h4>
        <ol className="list-decimal list-inside space-y-1 text-gray-400">
          <li>Click <strong className="text-gray-300">Import Chain Folder</strong> to load the images generated in Image Generation.</li>
          <li>Paste the exact same prompts used for the images into the text area above.</li>
          <li>Click <strong className="text-gray-300">Start Video Generation</strong>. The system will pair Image 1 with Prompt 1, Image 2 with Prompt 2, etc.</li>
          <li>Once all videos are generated, they can be merged into a single continuous video.</li>
        </ol>
      </div>
    </div>
  );
}
