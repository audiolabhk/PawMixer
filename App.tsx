import React, { useState, useCallback } from 'react';
import { DOG_BREEDS } from './constants';
import { Breed, GenerationStatus, GeneratedImage } from './types';
import { BreedCard } from './components/BreedCard';
import { generateCrossBreedImage } from './services/geminiService';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';

const App: React.FC = () => {
  const [selectedBreeds, setSelectedBreeds] = useState<Breed[]>([]);
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleBreedSelect = (breed: Breed) => {
    if (status === 'loading') return;

    setSelectedBreeds(prev => {
      const isAlreadySelected = prev.some(b => b.id === breed.id);
      
      if (isAlreadySelected) {
        return prev.filter(b => b.id !== breed.id);
      }

      if (prev.length < 2) {
        return [...prev, breed];
      }

      // If 2 are already selected, replace the second one (or create a queue behavior if preferred, but simple replacement or block is better)
      // Here we just don't add if 2 are full, unless we deselect first. 
      // UX decision: prevent adding more than 2.
      return prev;
    });
  };

  const handleGenerate = async () => {
    if (selectedBreeds.length !== 2) return;

    setStatus('loading');
    setError(null);

    try {
      const [breed1, breed2] = selectedBreeds;
      const imageUrl = await generateCrossBreedImage(breed1.name, breed2.name);
      
      setGeneratedImage({
        url: imageUrl,
        breed1,
        breed2
      });
      setStatus('success');
    } catch (err) {
      console.error(err);
      setError("Oops! Failed to generate the image. Please try again.");
      setStatus('error');
    }
  };

  const handleReset = useCallback(() => {
    setSelectedBreeds([]);
    setGeneratedImage(null);
    setStatus('idle');
    setError(null);
  }, []);

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage.url;
      link.download = `pawmixer-${generatedImage.breed1.id}-${generatedImage.breed2.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 text-gray-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-orange-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">
              P
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">PawMixer</h1>
          </div>
          <div className="text-sm font-medium text-gray-500">
            Powered by Seans 3 week hiatus
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {status === 'idle' || status === 'error' ? (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-3xl md:text-5xl font-extrabold text-secondary">
                Mix Your Perfect Puppy
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Select exactly <span className="font-bold text-primary">two breeds</span> from the list below and watch AI create a unique cross-breed photo!
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
              {DOG_BREEDS.map((breed) => {
                const isSelected = selectedBreeds.some(b => b.id === breed.id);
                const selectionIndex = selectedBreeds.findIndex(b => b.id === breed.id);
                
                return (
                  <BreedCard
                    key={breed.id}
                    breed={breed}
                    isSelected={isSelected}
                    selectionOrder={isSelected ? selectionIndex + 1 : null}
                    onSelect={handleBreedSelect}
                    disabled={selectedBreeds.length >= 2 && !isSelected}
                  />
                );
              })}
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 transition-transform transform translate-y-0">
               <div className="max-w-5xl mx-auto flex items-center justify-between">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                      <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Selected:</span>
                      <div className="flex gap-2">
                        {selectedBreeds.length === 0 && <span className="text-gray-400 italic text-sm">None</span>}
                        {selectedBreeds.map((b, i) => (
                          <span key={b.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-secondary">
                            {i + 1}. {b.name}
                          </span>
                        ))}
                      </div>
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={selectedBreeds.length !== 2}
                    className={`
                      px-8 py-3 rounded-full font-bold text-lg shadow-lg transition-all
                      ${selectedBreeds.length === 2 
                        ? 'bg-primary text-white hover:bg-orange-600 hover:scale-105 hover:shadow-xl' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                    `}
                  >
                    Mix 'Em Up! ✨
                  </button>
               </div>
            </div>
            
            {error && (
              <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
          </div>
        ) : null}

        {status === 'loading' && (
          <div className="min-h-[50vh] flex flex-col items-center justify-center">
            <Loader />
          </div>
        )}

        {status === 'success' && generatedImage && (
          <div className="flex flex-col items-center space-y-8">
            <div className="text-center mb-4">
               <h2 className="text-3xl font-bold text-secondary">It's a Match!</h2>
            </div>
            <ResultDisplay 
              image={generatedImage} 
              onReset={handleReset} 
              onDownload={handleDownload} 
            />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
