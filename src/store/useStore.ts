import { create } from 'zustand';

export type Account = {
  id: string;
  email: string;
  cookie: string;
  status: 'valid' | 'expired' | 'checking';
  addedAt: number;
};

export type TaskStatus = 'queued' | 'generating' | 'uploading' | 'completed' | 'error';

export type Task = {
  id: string;
  type: 'image' | 'video';
  prompt: string;
  status: TaskStatus;
  progress: number;
  resultUrl?: string;
  accountId?: string;
  createdAt: number;
  isChain?: boolean;
  chainId?: string;
  chainIndex?: number;
  referenceImage?: string;
};

interface AppState {
  accounts: Account[];
  tasks: Task[];
  addAccount: (email: string, cookie: string) => void;
  removeAccount: (id: string) => void;
  refreshAccount: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'status' | 'progress' | 'createdAt'>) => void;
  addChainTasks: (prompts: string[], type: 'image' | 'video', referenceImages?: string[]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  clearTasks: () => void;
  processQueue: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  accounts: [
    // Mock initial account for testing
    { id: '1', email: 'test@gmail.com', cookie: 'mock_cookie', status: 'valid', addedAt: Date.now() }
  ],
  tasks: [],

  addAccount: (email, cookie) => set((state) => ({
    accounts: [...state.accounts, { id: Date.now().toString(), email, cookie, status: 'valid', addedAt: Date.now() }]
  })),

  removeAccount: (id) => set((state) => ({
    accounts: state.accounts.filter(a => a.id !== id)
  })),

  refreshAccount: async (id) => {
    set((state) => ({
      accounts: state.accounts.map(a => a.id === id ? { ...a, status: 'checking' } : a)
    }));
    
    try {
      const account = get().accounts.find(a => a.id === id);
      if (!account) return;

      const response = await fetch('/api/auth/verify-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cookie: account.cookie })
      });
      const data = await response.json();

      set((state) => ({
        accounts: state.accounts.map(a => a.id === id ? { ...a, status: data.valid ? 'valid' : 'expired' } : a)
      }));
    } catch (e) {
      set((state) => ({
        accounts: state.accounts.map(a => a.id === id ? { ...a, status: 'expired' } : a)
      }));
    }
  },

  addTask: (task) => {
    set((state) => ({
      tasks: [...state.tasks, { ...task, id: Date.now().toString() + Math.random(), status: 'queued', progress: 0, createdAt: Date.now() }]
    }));
    get().processQueue();
  },

  addChainTasks: (prompts, type, referenceImages) => {
    const chainId = Date.now().toString();
    const newTasks = prompts.map((prompt, index) => ({
      id: chainId + '-' + index,
      type,
      prompt,
      status: 'queued' as TaskStatus,
      progress: 0,
      createdAt: Date.now() + index,
      isChain: true,
      chainId,
      chainIndex: index,
      referenceImage: referenceImages ? referenceImages[index] : undefined,
    }));
    
    set((state) => ({ tasks: [...state.tasks, ...newTasks] }));
    get().processQueue();
  },

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
  })),

  clearTasks: () => set({ tasks: [] }),

  // Mock processing engine
  processQueue: () => {
    const state = get();
    const availableAccounts = state.accounts.filter(a => a.status === 'valid');
    if (availableAccounts.length === 0) return;

    // Find tasks that are currently generating
    const generatingTasks = state.tasks.filter(t => t.status === 'generating' || t.status === 'uploading');
    
    // Simple concurrency limit based on accounts
    if (generatingTasks.length >= availableAccounts.length) return;

    // Find next queued task
    // If it's a chain task > index 0, ensure previous task is completed
    const nextTask = state.tasks.find(t => {
      if (t.status !== 'queued') return false;
      if (t.isChain && t.chainIndex! > 0) {
        const prevTask = state.tasks.find(pt => pt.chainId === t.chainId && pt.chainIndex === t.chainIndex! - 1);
        return prevTask?.status === 'completed';
      }
      return true;
    });

    if (!nextTask) return;

    // Assign account (round robin or random for mock)
    const account = availableAccounts[generatingTasks.length % availableAccounts.length];

    // Start task
    get().updateTask(nextTask.id, { status: 'generating', accountId: account.id, progress: 10 });

    // Handle HTTP request asynchronously without blocking the queue check
    (async () => {
      try {
        // Start simulated progress bar for UI feel
        let progress = 10;
        const progressInterval = setInterval(() => {
           progress = Math.min(progress + Math.floor(Math.random() * 15), 90);
           get().updateTask(nextTask.id, { progress });
        }, 800);

        // Call the backend proxy
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: nextTask.type,
            prompt: nextTask.prompt,
            referenceImage: nextTask.referenceImage,
            cookie: account.cookie
          })
        });

        clearInterval(progressInterval);
        const data = await response.json();
        
        if (data.success) {
           get().updateTask(nextTask.id, { status: 'uploading', progress: 95 });
           // Local simulate download step
           setTimeout(() => {
             get().updateTask(nextTask.id, { status: 'completed', progress: 100, resultUrl: data.url });
             get().processQueue(); // trigger next
           }, 500);
        } else {
           get().updateTask(nextTask.id, { status: 'error', progress: 0 });
           get().processQueue();
        }

      } catch (err) {
        get().updateTask(nextTask.id, { status: 'error', progress: 0 });
        get().processQueue();
      }
    })();
  }
}));
