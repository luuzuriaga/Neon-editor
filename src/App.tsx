import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Eraser, 
  Image as ImageIcon, 
  Shirt, 
  Moon, 
  Sun, 
  Download, 
  Loader2, 
  AlertCircle,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { editImage, EDIT_PROMPTS, MODEL_NAME } from './services/gemini';

// Extend window for AI Studio API key selection
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export default function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    } else {
      // Fallback for local development or if API is not present
      setHasApiKey(true);
    }
  };

  const handleOpenSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true); // Assume success as per guidelines
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
        setEditedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async (prompt: string) => {
    if (!originalImage) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      const mimeType = originalImage.split(';')[0].split(':')[1];
      const result = await editImage(originalImage, prompt, mimeType);
      setEditedImage(result);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setHasApiKey(false);
        setError("API Key error. Please re-select your API key.");
      } else {
        setError(err.message || "An error occurred while editing the image.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!editedImage) return;
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = 'neon-edited-image.png';
    link.click();
  };

  if (hasApiKey === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-2xl max-w-md w-full neon-border"
        >
          <Key className="w-16 h-16 mx-auto mb-6 text-neon-blue" />
          <h1 className="text-3xl font-bold mb-4 neon-text-blue font-display">API KEY REQUIRED</h1>
          <p className="text-gray-400 mb-8">
            This application uses Gemini 3.1 Flash Image Preview, which requires a paid API key. 
            Please select your key to continue.
          </p>
          <button 
            onClick={handleOpenSelectKey}
            className="w-full py-4 rounded-xl neon-button font-bold text-lg"
          >
            SELECT API KEY
          </button>
          <p className="mt-4 text-xs text-gray-500 italic">
            Note: You must have billing enabled on your Google Cloud project.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 min-h-screen flex flex-col">
      <header className="text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-5xl md:text-7xl font-bold mb-4 neon-text-pink font-display tracking-tighter"
        >
          NEON EDITOR
        </motion.h1>
        <p className="text-neon-blue opacity-80 font-mono text-sm tracking-widest uppercase">
          Powered by Gemini 3.1 Flash Image Preview
        </p>
      </header>

      <main className="grid lg:grid-cols-2 gap-12 flex-grow">
        {/* Left Column: Image Display */}
        <section className="flex flex-col gap-6">
          <div className="relative aspect-square glass-panel rounded-3xl overflow-hidden neon-border flex items-center justify-center group">
            <AnimatePresence mode="wait">
              {editedImage ? (
                <motion.img 
                  key="edited"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={editedImage} 
                  alt="Edited" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : originalImage ? (
                <motion.img 
                  key="original"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  src={originalImage} 
                  alt="Original" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <motion.div 
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 text-gray-500"
                >
                  <ImageIcon size={64} className="opacity-20" />
                  <p className="font-mono text-xs uppercase tracking-widest">No image uploaded</p>
                </motion.div>
              )}
            </AnimatePresence>

            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10">
                <Loader2 className="w-12 h-12 text-neon-pink animate-spin" />
                <p className="neon-text-pink font-mono text-sm animate-pulse">PROCESSING TRANSFORMATION...</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-grow py-4 rounded-xl glass-panel border border-white/10 hover:border-neon-blue transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-sm"
              disabled={isProcessing}
            >
              <Upload size={18} />
              {originalImage ? 'Change Image' : 'Upload Image'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="hidden" 
              accept="image/*"
            />
            {editedImage && (
              <button 
                onClick={downloadImage}
                className="px-6 py-4 rounded-xl neon-button flex items-center justify-center"
              >
                <Download size={20} />
              </button>
            )}
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 flex items-start gap-3 text-red-400 text-sm"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </motion.div>
          )}
        </section>

        {/* Right Column: Controls */}
        <section className="flex flex-col gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-white/5">
            <h2 className="text-xl font-bold mb-6 neon-text-blue font-display uppercase tracking-wider">Neural Filters</h2>
            <div className="grid gap-4">
              <FilterButton 
                icon={<Eraser size={20} />} 
                label="Quitar Fondo" 
                onClick={() => handleEdit(EDIT_PROMPTS.REMOVE_BG)}
                disabled={!originalImage || isProcessing}
                color="neon-blue"
              />
              <FilterButton 
                icon={<ImageIcon size={20} />} 
                label="Fondo Aleatorio" 
                onClick={() => handleEdit(EDIT_PROMPTS.RANDOM_BG)}
                disabled={!originalImage || isProcessing}
                color="neon-pink"
              />
              <FilterButton 
                icon={<Shirt size={20} />} 
                label="Cambia Ropa" 
                onClick={() => handleEdit(EDIT_PROMPTS.CHANGE_CLOTHES)}
                disabled={!originalImage || isProcessing}
                color="neon-purple"
              />
              <FilterButton 
                icon={<Moon size={20} />} 
                label="Hacer de Noche" 
                onClick={() => handleEdit(EDIT_PROMPTS.MAKE_NIGHT)}
                disabled={!originalImage || isProcessing}
                color="neon-blue"
              />
              <FilterButton 
                icon={<Sun size={20} />} 
                label="Hacer de Día" 
                onClick={() => handleEdit(EDIT_PROMPTS.MAKE_DAY)}
                disabled={!originalImage || isProcessing}
                color="neon-green"
              />
            </div>
          </div>

          <div className="mt-auto glass-panel p-6 rounded-2xl border border-white/5 opacity-50">
            <p className="text-xs font-mono leading-relaxed text-gray-400">
              SYSTEM STATUS: ONLINE<br/>
              MODEL: {MODEL_NAME}<br/>
              LATENCY: OPTIMAL<br/>
              ENCRYPTION: ACTIVE
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-12 text-center text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
        &copy; 2026 NEON IMAGE LABS // ALL RIGHTS RESERVED
      </footer>
    </div>
  );
}

function FilterButton({ icon, label, onClick, disabled, color }: { 
  icon: React.ReactNode, 
  label: string, 
  onClick: () => void, 
  disabled: boolean,
  color: string
}) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 text-left
        ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:bg-white/5 hover:translate-x-2'}
        border border-white/5 group
      `}
    >
      <div className={`p-3 rounded-xl bg-black/50 border border-white/10 group-hover:border-white/30 transition-colors`}>
        {icon}
      </div>
      <span className="font-bold uppercase tracking-widest text-sm">{label}</span>
    </button>
  );
}
