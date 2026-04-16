import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { RefreshCw, Trash2, Plus, LogIn } from 'lucide-react';

export function AccountManager() {
  const { accounts, addAccount, removeAccount, refreshAccount } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [email, setEmail] = useState('');
  const [cookie, setCookie] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && cookie) {
      addAccount(email, cookie);
      setEmail('');
      setCookie('');
      setShowAdd(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white">Connected Accounts</h3>
          <p className="text-sm text-gray-400 mt-1">Manage multiple Google Labs cookies to use concurrent generation.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Account Cookie
        </button>
      </div>

      {showAdd && (
        <div className="bg-[#25252b] border border-[#363640] rounded-lg p-6 mb-6">
          <h4 className="text-lg font-medium text-white mb-4">Add New Account</h4>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#18181c] border border-[#363640] rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="user@gmail.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Session Cookie / API Key</label>
              <input 
                type="text" 
                value={cookie}
                onChange={(e) => setCookie(e.target.value)}
                className="w-full bg-[#18181c] border border-[#363640] rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                placeholder="Paste cookie string here..."
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium">
                Save Account
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="bg-[#363640] hover:bg-[#454550] text-white px-4 py-2 rounded text-sm font-medium">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {accounts.map((account, index) => (
          <div key={account.id} className="bg-[#25252b] border border-[#363640] rounded-lg p-4 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#363640] rounded-full flex items-center justify-center text-emerald-400 font-bold">
                  #{index + 1}
                </div>
                <div>
                  <h5 className="text-white font-medium">{account.email}</h5>
                  <p className="text-xs text-gray-400 mt-0.5">Added: {format(account.addedAt, 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                account.status === 'valid' ? 'bg-emerald-500/20 text-emerald-400' :
                account.status === 'checking' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {account.status.toUpperCase()}
              </span>
            </div>
            
            <div className="mt-auto flex gap-2">
              <button 
                onClick={() => refreshAccount(account.id)}
                disabled={account.status === 'checking'}
                className="flex-1 bg-[#363640] hover:bg-[#454550] text-gray-200 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${account.status === 'checking' ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button 
                onClick={() => removeAccount(account.id)}
                className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2 rounded text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {accounts.length === 0 && !showAdd && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-[#363640] rounded-lg">
            <LogIn className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-300">No accounts connected</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">Add a Google Labs cookie to start generating.</p>
            <button 
              onClick={() => setShowAdd(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm font-medium inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
