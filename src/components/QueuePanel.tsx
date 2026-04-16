import React from 'react';
import { useStore } from '../store/useStore';
import { CheckCircle2, Clock, Loader2, AlertCircle, Trash2 } from 'lucide-react';

export function QueuePanel() {
  const { tasks, clearTasks } = useStore();

  return (
    <div className="w-80 bg-[#18181c] border-l border-[#2d2d35] flex flex-col h-full">
      <div className="p-4 border-b border-[#2d2d35] flex justify-between items-center">
        <h3 className="font-semibold text-white">Task Queue</h3>
        <button 
          onClick={clearTasks}
          className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-2">
            <Clock className="w-8 h-8 opacity-50" />
            <p className="text-sm">Queue is empty</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="bg-[#25252b] border border-[#363640] rounded-lg p-3 flex flex-col gap-2">
              <div className="flex justify-between items-start gap-2">
                <p className="text-xs text-gray-300 line-clamp-2 flex-1 font-medium" title={task.prompt}>
                  {task.isChain && <span className="text-blue-400 mr-1">[{task.chainIndex! + 1}]</span>}
                  {task.prompt}
                </p>
                <div className="shrink-0">
                  {task.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {task.status === 'queued' && <Clock className="w-4 h-4 text-gray-500" />}
                  {(task.status === 'generating' || task.status === 'uploading') && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                  {task.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                </div>
              </div>

              {task.status !== 'queued' && task.status !== 'completed' && task.status !== 'error' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span className="capitalize">{task.status}...</span>
                    <span>{task.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#18181c] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300 ease-out"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {task.status === 'completed' && task.resultUrl && (
                <div className="mt-1 rounded overflow-hidden border border-[#363640] bg-[#18181c]">
                  {task.type === 'image' ? (
                    <img src={task.resultUrl} alt="Result" className="w-full h-24 object-cover" />
                  ) : (
                    <video src={task.resultUrl} className="w-full h-24 object-cover" controls />
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
