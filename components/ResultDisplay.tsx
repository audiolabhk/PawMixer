import React from 'react';
import { GeneratedImage } from '../types';

interface ResultDisplayProps {
  image: GeneratedImage | null;
  onReset: () => void;
  onDownload: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ image, onReset, onDownload }) => {
  if (!image) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
      <div className="relative aspect-square w-full bg-gray-100">
        <img 
          src={image.url} 
          alt={`Crossbreed of ${image.breed1.name} and ${image.breed2.name}`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none flex flex-col justify-end p-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            The {image.breed1.name} x {image.breed2.name}
          </h2>
          <p className="text-white/80">A unique AI-generated masterpiece</p>
        </div>
      </div>
      
      <div className="p-6 flex gap-4 justify-center bg-white">
        <button 
          onClick={onReset}
          className="px-6 py-3 rounded-full bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/></svg>
          Mix Again
        </button>
        <button 
          onClick={onDownload}
          className="px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-orange-600 transition-colors flex items-center gap-2 shadow-lg shadow-orange-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Download Photo
        </button>
      </div>
    </div>
  );
};
