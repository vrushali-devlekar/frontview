import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, Key, Lock, Trash2, RefreshCw } from 'lucide-react';
import CyberButton from '../ui/CyberButton';
import InputField from '../ui/InputField';

export default function EnvTable() {
  const [envs, setEnvs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Initial Fetch
  const fetchEnvs = async () => {
    setIsLoading(true);
    try {
      // SDE Mechanism: Fetch environments from backend
      // const response = await fetch('/api/environments');
      // const data = await response.json();
      // setEnvs(data.map(env => ({ ...env, isRevealed: false })));

      // MOCK IMPLEMENTATION
      setTimeout(() => {
        setEnvs([
          { id: 1, key: 'DATABASE_URL', value: 'postgresql://user:pass@db.velora.internal:5432/main', isRevealed: false },
          { id: 2, key: 'JWT_SECRET', value: 'velora_super_secret_key_2026', isRevealed: false },
          { id: 3, key: 'STRIPE_API_KEY', value: 'sk_test_51Nx...velora', isRevealed: false },
        ]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch envs:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvs();
  }, []);

  // Reveal Logic
  const toggleReveal = (id) => {
    setEnvs(prev => prev.map(env => 
      env.id === id ? { ...env, isRevealed: !env.isRevealed } : env
    ));
    
    // SDE Mechanism: If we wanted to fetch the decrypted value from the backend upon clicking "Reveal":
    // if (!isCurrentlyRevealed) {
    //   fetch(`/api/environments/${id}/decrypt`).then(res => res.json()).then(data => {
    //      // Update state with decrypted value
    //   })
    // }
  };

  // Add New Key
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newKey || !newValue) return;

    setIsAdding(true);
    try {
      // SDE Mechanism: POST to backend for AES-256 Encryption
      // await fetch('/api/environments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ key: newKey, value: newValue })
      // });
      
      // MOCK IMPLEMENTATION
      setTimeout(() => {
        const newEnv = {
          id: Date.now(),
          key: newKey.toUpperCase().replace(/\s+/g, '_'),
          value: newValue,
          isRevealed: false
        };
        setEnvs(prev => [...prev, newEnv]);
        setNewKey('');
        setNewValue('');
        setIsAdding(false);
      }, 800);
    } catch (error) {
      console.error('Failed to add env:', error);
      setIsAdding(false);
    }
  };

  const handleDelete = (id) => {
    // SDE Mechanism: DELETE request
    setEnvs(prev => prev.filter(env => env.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-valora-card border-2 border-valora-border relative">
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-valora-yellow"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#555]"></div>

      {/* Header */}
      <div className="p-4 border-b-2 border-[#222] bg-[#0a0a0a] flex items-center justify-between shrink-0">
        <div>
          <h3 className="text-[14px] font-pixel text-valora-yellow tracking-widest uppercase flex items-center gap-2">
            <Lock size={16} /> SECRETS_VAULT
          </h3>
          <p className="text-[9px] text-[#666] tracking-widest uppercase mt-2">
            AES-256 ENCRYPTED ENVIRONMENT VARIABLES.
          </p>
        </div>
        <button onClick={fetchEnvs} className="p-2 border border-[#333] hover:border-valora-cyan text-[#555] hover:text-valora-cyan transition-colors">
          <RefreshCw size={14} className={isLoading ? "animate-spin text-valora-cyan" : ""} />
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <table className="w-full text-left font-mono">
          <thead className="sticky top-0 bg-[#050505] z-10 border-b-2 border-[#222]">
            <tr>
              <th className="px-6 py-4 text-[10px] text-[#666] tracking-widest uppercase">KEY</th>
              <th className="px-6 py-4 text-[10px] text-[#666] tracking-widest uppercase">VALUE</th>
              <th className="px-6 py-4 text-[10px] text-[#666] tracking-widest uppercase text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && envs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-[#555] text-[10px] tracking-widest uppercase">
                  DECRYPTING_VAULT...
                </td>
              </tr>
            ) : envs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-[#555] text-[10px] tracking-widest uppercase">
                  VAULT_IS_EMPTY
                </td>
              </tr>
            ) : (
              envs.map((env) => (
                <tr key={env.id} className="border-b-2 border-[#111] hover:bg-[#0a0a0a] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-valora-cyan text-[11px] font-bold tracking-widest flex items-center gap-2">
                      <Key size={10} className="text-[#555]" />
                      {env.key}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[11px] tracking-wider ${env.isRevealed ? 'text-white' : 'text-[#555]'}`}>
                      {env.isRevealed ? env.value : '************************'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleReveal(env.id)}
                        className="text-[#666] hover:text-valora-cyan transition-colors"
                        title={env.isRevealed ? "Hide Value" : "Reveal Value"}
                      >
                        {env.isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button 
                        onClick={() => handleDelete(env.id)}
                        className="text-[#666] hover:text-red-500 transition-colors"
                        title="Delete Secret"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Form */}
      <div className="p-4 border-t-2 border-[#222] bg-[#050505] shrink-0">
        <form onSubmit={handleAdd} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <InputField 
              label="NEW_KEY" 
              placeholder="e.g. DATABASE_URL" 
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="w-full uppercase"
            />
          </div>
          <div className="flex-1 w-full">
            <InputField 
              label="SECRET_VALUE" 
              placeholder="e.g. your_secret_string" 
              type="password"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full"
            />
          </div>
          <CyberButton 
            variant="primary" 
            type="submit" 
            disabled={isAdding || !newKey || !newValue}
            className="w-full md:w-auto min-w-[120px]"
          >
            {isAdding ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <><Plus size={14} className="mr-2" /> ENCRYPT_&_ADD</>
            )}
          </CyberButton>
        </form>
      </div>

    </div>
  );
}
