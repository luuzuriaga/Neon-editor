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
      
      {/* BACKGROUND BITS (Fondo animado) */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-deep-blue">
        <div className="absolute inset-0 bg-retro-grid opacity-10 animate-grid-drift" />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i} className="absolute w-1.5 h-1.5 bg-pastel-blue opacity-20 rounded-full"
            animate={{ y: [0, -1000], x: [0, Math.random() * 40 - 20], opacity: [0, 0.6, 0] }}
            transition={{ duration: Math.random() * 8 + 6, repeat: Infinity, delay: i * 0.5 }}
            style={{ left: `${Math.random() * 100}%`, top: '100%' }}
          />
        ))}
      </div>

      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold font-retro-play tracking-tighter title-gradient">
          NEON EDITOR
        </h1>
        <p className="text-pastel-blue font-retro-play text-[8px] tracking-[0.4em] uppercase opacity-60 mt-4">
          Neural Interface // v2.6.0
        </p>
      </header>

      <main className="flex flex-col lg:flex-row gap-12 items-start justify-center z-10">
        
        {/* COLUMNA IZQUIERDA: VISOR (Con estilo ventana de sistema operativo) */}
        <section className="w-full lg:w-[500px] flex flex-col gap-6">
          <div className="relative glass-panel rounded-2xl overflow-hidden retro-border-soft flex flex-col shadow-2xl">
             
             {/* Barra de Título (Window Bar) */}
             <div className="w-full bg-black/40 border-b border-white/10 px-4 py-2 flex items-center gap-2 z-30">
               <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
               <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
               <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
               <span className="ml-4 font-mono text-[9px] text-white/40 tracking-widest">data_viewer.exe</span>
             </div>

             {/* Contenedor de la Imagen */}
             <div className="relative aspect-square flex items-center justify-center bg-black/20">
               <div className="absolute inset-0 pointer-events-none bg-scanline opacity-5 z-20" />
               <AnimatePresence mode="wait">
                  <motion.img 
                    key={editedImage || originalImage || 'empty'}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    src={editedImage || originalImage || ''} 
                    className="w-full h-full object-cover"
                  />
                  {!originalImage && (
                    <div className="absolute flex flex-col items-center gap-4 text-white/10">
                      <Palmtree size={60} />
                      <p className="font-retro-play text-[8px]">DISK_REQUIRED</p>
                    </div>
                  )}
               </AnimatePresence>

               {isProcessing && (
                <div className="absolute inset-0 bg-deep-blue/80 backdrop-blur-md flex flex-col items-center justify-center z-30">
                  <Loader2 className="w-12 h-12 text-milk-pink animate-spin" />
                  <p className="text-milk-pink font-retro-play text-[8px] mt-6 animate-pulse">RECODING...</p>
                </div>
              )}
             </div>
          </div>
          
          <div className="flex gap-4">
            {/* BOTÓN UPLOAD: Muy llamativo, color pastel rosa */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-grow py-4 rounded-full bg-milk-pink text-deep-blue font-retro-play text-[9px] tracking-widest uppercase hover:bg-white hover:shadow-neon-milk-pink transition-all font-bold flex items-center justify-center gap-3"
            >
              <Upload size={18} /> [ UPLOAD_IMAGE ]
            </button>
            <input type="file" ref={fileInputRef} onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => { setOriginalImage(ev.target?.result as string); setEditedImage(null); };
                reader.readAsDataURL(file);
              }
            }} className="hidden" accept="image/*" />
            
            {editedImage && (
              <button onClick={() => {const a=document.createElement('a'); a.href=editedImage!; a.download='edit.png'; a.click();}} className="p-4 rounded-full bg-milk-teal text-deep-blue border border-milk-teal/40 hover:bg-white transition-colors shadow-lg">
                <Download size={20} />
              </button>
            )}
          </div>
        </section>

        {/* COLUMNA DERECHA: BOTONES PÍLDORA */}
        <section className={`w-full lg:w-[400px] flex flex-col gap-6 ${!originalImage ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
          <div className="glass-panel p-8 rounded-[3rem] border border-white/5 shadow-inner bg-black/20">
            <h2 className="text-[9px] font-retro-play mb-8 text-white/40 tracking-[0.2em] uppercase text-center flex items-center justify-center gap-3">
              <Zap size={14} className="text-milk-teal"/> Processing Modules
            </h2>
            
            <div className="flex flex-col gap-4">
              {filterModules.map((f) => (
                <motion.button 
                  key={f.id}
                  whileHover={{ x: 10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEdit(f.prompt)}
                  // INTERACCIONES DE COLOR: 
                  // 1. Normal: bg-black/40 (gradiente sutil)
                  // 2. Hover: bg-${f.color}/30 (se pinta de color suave), texto blanco.
                  // 3. Active (Click): active:bg-${f.color} active:text-black (Color intenso e inversión)
                  className={`
                    group flex items-center gap-5 p-4 rounded-full border-2 transition-all duration-300
                    border-${f.color}/30 bg-black/40
                    hover:bg-${f.color}/30 hover:border-${f.color} hover:shadow-neon-${f.color}
                    active:bg-${f.color} active:border-white
                  `}
                >
                  {/* Contenedor del Icono: También invierte colores al cliquear */}
                  <div className={`p-3 rounded-full bg-deep-blue text-${f.color} border border-${f.color}/20 group-hover:bg-${f.color} group-hover:text-deep-blue transition-all duration-300 group-active:bg-white group-active:text-deep-blue`}>
                    {f.icon}
                  </div>
                  
                  {/* Texto: Se vuelve blanco en hover, negro al cliquear */}
                  <span className={`font-retro-play text-[8px] text-${f.color} group-hover:text-white group-active:text-deep-blue tracking-tighter transition-colors duration-300`}>
                    {f.label}
                  </span>
                  
                  <Sparkles size={14} className={`ml-auto opacity-0 group-hover:opacity-100 text-${f.color} group-active:text-deep-blue transition-opacity`} />
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Alerta de Error Básica */}
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-500/90 text-white font-mono text-xs px-6 py-3 rounded-full z-50">
          [!] {error}
        </div>
      )}
    </div>
  );
}