'use client';

import React, { useState, useRef, useEffect } from 'react';
import { uploadToImageBB } from '../../lib/imagebb';
import { UploadCloud, Image as ImageIcon, Trash2, ShieldAlert, CheckCircle, RefreshCw } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  aspectRatio?: 'avatar' | 'banner' | 'square' | 'video';
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  label = 'Upload Image',
  aspectRatio = 'square',
}: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Progress tracker (simulated smooth state)
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up any active timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Class helper to map design requirements
  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'avatar':
        return 'w-24 h-24 rounded-full';
      case 'banner':
        return 'w-full h-36 rounded-xl';
      case 'video':
        return 'w-full aspect-video rounded-xl';
      case 'square':
      default:
        return 'w-32 h-32 rounded-xl';
    }
  };

  const handleFileChange = async (file: File) => {
    setError(null);
    setLoading(true);
    setProgress(10);

    // Simulated progress increments
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev;
        return prev + 15;
      });
    }, 150);

    try {
      const res = await uploadToImageBB(file);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setProgress(100);
      setTimeout(() => {
        onChange(res.data.url);
        setLoading(false);
        setProgress(0);
      }, 300);
    } catch (err: unknown) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setLoading(false);
      setProgress(0);
      const errMsg = err instanceof Error ? err.message : 'Uploading encountered a network error.';
      setError(errMsg);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const triggerPicker = () => {
    fileInputRef.current?.click();
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange('');
    if (onRemove) onRemove();
    setError(null);
  };

  return (
    <div className="space-y-3 w-full font-sans">
      <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider pl-0.5">
        {label}
      </span>

      {/* Main Drag-Drop-Select Wrapper */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerPicker}
        className={`relative border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-950/20 scale-[1.01] shadow-lg shadow-indigo-950/25'
            : value 
              ? 'border-slate-800 bg-slate-905/30 hover:border-slate-700' 
              : 'border-slate-850 bg-slate-950/40 hover:border-slate-800'
        } min-h-[140px]`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={onFileInputChange}
          className="hidden"
        />

        {loading ? (
          /* Loading & Progress State */
          <div className="flex flex-col items-center gap-3.5 py-4">
            <div className="relative flex items-center justify-center">
              <RefreshCw className="w-9 h-9 text-indigo-400 animate-spin" />
              <span className="absolute text-[10px] font-black text-slate-200">{progress}%</span>
            </div>
            <div className="w-32 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-850">
              <div
                className="bg-indigo-500 h-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-widest animate-pulse">
              Compressing & Uploading...
            </span>
          </div>
        ) : value ? (
          /* Uploaded Preview State */
          <div className="relative flex flex-col items-center gap-4 py-2 group w-full">
            <div className={`relative overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center shadow-lg ${getAspectClass()}`}>
              <img
                src={value}
                alt="Upload Preview"
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none" />
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Live on ImgBB
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 bg-slate-950 border border-slate-850 hover:bg-red-950/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors flex items-center justify-center"
                title="Remove Image"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty / Upload Prompt State */
          <div className="flex flex-col items-center gap-3 py-4 select-none">
            <div className="p-3.5 bg-slate-900 border border-slate-850 rounded-2xl text-slate-400 group-hover:text-indigo-400 transition-colors">
              <UploadCloud className="w-7 h-7 text-slate-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                Drag & drop image, or <span className="text-indigo-400 underline">browse</span>
              </p>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                Supports JPG, PNG, WEBP (Max 10MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* User-Friendly Floating Toast/Inline Error Alert */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-950/30 border border-red-900/40 rounded-xl text-red-300 text-xs font-medium animate-fadeIn">
          <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block mb-0.5">Upload Failed</span>
            {error}
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-[10px] uppercase font-bold text-slate-400 hover:text-slate-200 pl-2 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
