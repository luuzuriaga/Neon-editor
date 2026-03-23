import React, { useState, useRef } from 'react';
import { 
  Upload, Eraser, Image as ImageIcon, Shirt, Moon, Sun, 
  Download, Loader2, Sparkles, Zap, Palmtree 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { editImage, EDIT_PROMPTS, MODEL_NAME } from './services/gemini';

export default function App() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filterModules = [
    { id: '1', label: 'QUITAR FONDO', prompt: EDIT_PROMPTS.REMOVE_BG, icon: <Eraser size={18} />, color: 'milk-blue' },
    { id: '2', label: 'FONDO RANDOM', prompt: EDIT_PROMPTS.RANDOM_BG, icon: <ImageIcon size={18} />, color: 'milk-pink' },
    { id: '3', label: 'CAMBIA ROPA', prompt: EDIT_PROMPTS.CHANGE_CLOTHES, icon: <Shirt size={18} />, color: 'milk-purple' },
    { id: '4', label: 'MODO NOCHE', prompt: EDIT_PROMPTS.MAKE_NIGHT, icon: <Moon size={18} />, color: 'milk-indigo' },
    { id: '5', label: 'MODO DÍA', prompt: EDIT_PROMPTS.MAKE_DAY, icon: <Sun size={18} />, color: 'milk-teal' },
  ];

  const handleEdit = async (prompt: string) => {
    if (!originalImage) return;
    setIsProcessing(true);
    setError(null);
    try {
      const mimeType = originalImage.split(';')[0].split(':')[1];
      const result = await editImage(originalImage, prompt, mimeType);
      setEditedImage(result);
    } catch (err: any) {
      setError("Error en la señal neural.");
    } finally { setIsProcessing(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen flex flex-col relative overflow-hidden font-retro-sans text-pastel-white">
      
      {/* BACKGROUND ELEMENTS (Fondo animado y textura) */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-deep-blue">
        <div className="absolute inset-0 bg-retro-grid opacity-10 animate-grid-drift" />
        
        {/* TEXTURA DE GRANO/RUIDO GLOBAL */}
        <div className="absolute inset-0 bg-noise opacity-[0.03]" />
        
        {/* React Bits Animation */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i} className="absolute w-1.5 h-1.5 bg-pastel-blue opacity-20 rounded-full shadow-[0_0_8px_rgba(112,214,255,0.5)]"
            animate={{ y: [0, -1000], x: [0, Math.random() * 40 - 20], opacity: [0, 0.6, 0] }}
            transition={{ duration: Math.random() * 8 + 6, repeat: Infinity, delay: i * 0.5 }}
            style={{ left: `${Math.random() * 100}%`, top: '100%' }}
          />
        ))}
      </div>

      <header className="text-center mb-12 relative">
        {/* Aberración cromática sutil en hover al título */}
        <motion.h1 
          whileHover={{ x: -2, y: 1, textShadow: "-2px 0 #ff00ff, 2px 0 #00ffff" }}
          transition={{ type: "spring", stiffness: 500 }}
          className="text-4xl md:text-6xl font-bold font-retro-play tracking-tighter title-gradient cursor-default"
        >
          NEON EDITOR
        </motion.h1>
        <p className="text-pastel-blue font-retro-play text-[8px] tracking-[0.4em] uppercase opacity-60 mt-4">
          Neural Interface // v2.6.0
        </p>
      </header>

      <main className="flex flex-col lg:flex-row gap-12 items-start justify-center z-10 relative">
        
        {/* COLUMNA IZQUIERDA: VISOR (CRT Style) */}
        <section className="w-full lg:w-[500px] flex flex-col gap-6 sticky top-10">
          <div className="relative aspect-square glass-panel rounded-2xl overflow-hidden retro-border-futuristic flex flex-col shadow-2xl">
             
             {/* Barra de Título (Window Bar) */}
             <div className="w-full bg-black/40 border-b border-white/10 px-4 py-2 flex items-center gap-2 z-30">
               <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-[0_0_5px_rgba(251,113,133,0.5)]" />
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
               <div className="w-2.5 h-2.5 rounded-full bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.5)]" />
               <span className="ml-4 font-mono text-[9px] text-pastel-white/40 tracking-widest uppercase">[ DATA_VISUALIZER ]</span>
             </div>

             {/* Contenedor de la Imagen (Simula Pantalla CRT) */}
             <div className="relative flex-grow flex items-center justify-center bg-black/20 overflow-hidden">
               {/* Scanlines Globales sobre la pantalla */}
               <div className="absolute inset-0 bg-scanline opacity-[0.06] z-20 pointer-events-none" />
               {/* Sutil vignette/sombra curva en las esquinas */}
               <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] z-10 pointer-events-none" />
               
               <AnimatePresence mode="wait">
                  <motion.img 
                    key={editedImage || originalImage || 'empty'}
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    src={editedImage || originalImage || ''} 
                    className="w-full h-full object-cover z-0"
                    style={{ imageRendering: editedImage ? 'auto' : 'pixelated' }} // Pixelado sutil para la original
                  />
                  {!originalImage && (
                    <div className="absolute flex flex-col items-center gap-4 text-white/10 z-0">
                      <Palmtree size={60} />
                      <p className="font-retro-play text-[8px]">DISK_REQUIRED</p>
                    </div>
                  )}
               </AnimatePresence>

               {isProcessing && (
                <div className="absolute inset-0 bg-deep-blue/80 backdrop-blur-md flex flex-col items-center justify-center z-30">
                  <Loader2 className="w-12 h-12 text-milk-pink animate-spin" />
                  <p className="text-milk-pink font-retro-play text-[8px] mt-6 animate-pulse uppercase">Recoding Neural Pathway...</p>
                </div>
              )}
             </div>
          </div>
          
          <div className="flex gap-4">
            {/* BOTÓN UPLOAD: Rosa Milkshake, llamativo pero integrado */}
            <motion.button 
              onClick={() => fileInputRef.current?.click()}
              whileHover={{ scale: 1.02, textShadow: "-1px 0 #ff00ff, 1px 0 #00ffff" }}
              whileTap={{ scale: 0.98, y: 1 }}
              className="flex-grow py-4 rounded-full bg-milk-pink text-deep-blue font-retro-play text-[9px] tracking-widest uppercase hover:bg-white hover:shadow-neon-milk-pink transition-all font-bold flex items-center justify-center gap-3 shadow-[0_5px_15px_rgba(255,133,255,0.2)]"
            >
              <Upload size={18} /> [ UPLOAD_DISK ]
            </motion.button>
            <input type="file" ref={fileInputRef} onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => { setOriginalImage(ev.target?.result as string); setEditedImage(null); };
                reader.readAsDataURL(file);
              }
            }} className="hidden" accept="image/*" />
            
            {editedImage && (
              <motion.button whileHover={{ scale: 1.1, rotate: 5 }} onClick={() => {const a=document.createElement('a'); a.href=editedImage!; a.download='edit.png'; a.click();}} className="p-4 rounded-full bg-milk-teal text-deep-blue border border-milk-teal/40 hover:bg-white transition-colors shadow-lg">
                <Download size={20} />
              </motion.button>
            )}
          </div>
        </section>

        {/* COLUMNA DERECHA: BOTONES PÍLDORA (Texturizados) */}
        <section className={`w-full lg:w-[400px] flex flex-col gap-6 ${!originalImage ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
          <div className="glass-panel p-8 rounded-[3rem] border border-white/5 shadow-inner bg-black/20 relative overflow-hidden">
            {/* Noise local para el panel */}
            <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />

            <h2 className="text-[9px] font-retro-play mb-8 text-white/40 tracking-[0.2em] uppercase text-center flex items-center justify-center gap-3 relative z-10">
              <Zap size={14} className="text-milk-teal animate-flicker-slow"/> Neural Sub-Routines
            </h2>
            
            <div className="flex flex-col gap-4 relative z-10">
              {filterModules.map((f) => (
                <motion.button 
                  key={f.id}
                  whileHover={{ x: 12, scale: 1.02 }}
                  whileTap={{ scale: 0.97, y: 1 }}
                  onClick={() => handleEdit(f.prompt)}
                  // Interacciones de color mejoradas para "Pintar" al hover
                  className={`
                    group flex items-center gap-5 p-4 rounded-full border-2 transition-all duration-300
                    border-${f.color}/30 bg-black/40
                    hover:bg-${f.color} hover:border-pastel-white hover:shadow-neon-${f.color}
                    active:bg-pastel-white active:border-white active:text-deep-blue
                  `}
                >
                  {/* Contenedor del Icono: Inversión dramática en hover */}
                  <div className={`p-3 rounded-full bg-deep-blue text-${f.color} border border-${f.color}/20 group-hover:bg-deep-blue/80 group-hover:text-white transition-all duration-300 group-active:bg-deep-blue group-active:text-pastel-white`}>
                    {f.icon}
                  </div>
                  
                  {/* Texto: Negro sutil en hover para contraste */}
                  <span className={`font-retro-play text-[8px] text-${f.color} group-hover:text-deep-blue group-active:text-deep-blue tracking-tighter transition-colors duration-300`}>
                    {f.label}
                  </span>
                  
                  <Sparkles size={14} className={`ml-auto opacity-0 group-hover:opacity-100 text-deep-blue group-active:text-deep-blue transition-opacity`} />
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Alerta de Error Básica */}
      {error && (
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500/90 text-white font-retro-sans text-[10px] uppercase tracking-widest px-6 py-3 rounded-full z-50 shadow-2xl backdrop-blur-sm border border-red-400">
          [!] SYS_ERROR: {error}
        </motion.div>
      )}
    </div>
  );
}