import React from 'react';
import { Breed } from '../types';

interface BreedCardProps {
  breed: Breed;
  isSelected: boolean;
  onSelect: (breed: Breed) => void;
  disabled: boolean;
  selectionOrder: number | null;
}

export const BreedCard: React.FC<BreedCardProps> = ({ 
  breed, 
  isSelected, 
  onSelect, 
  disabled,
  selectionOrder
}) => {
  const handleClick = () => {
    if (!disabled || isSelected) {
      onSelect(breed);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        relative group cursor-pointer rounded-xl overflow-hidden shadow-md transition-all duration-300
        ${isSelected ? 'ring-4 ring-primary scale-105 shadow-xl' : 'hover:shadow-lg hover:-translate-y-1'}
        ${disabled && !isSelected ? 'opacity-50 cursor-not-allowed grayscale' : ''}
        bg-white
      `}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        <img 
          src={breed.imageUrl} 
          alt={breed.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-3 text-center bg-white border-t border-gray-100">
        <h3 className={`font-bold text-gray-800 ${isSelected ? 'text-primary' : ''}`}>
          {breed.name}
        </h3>
      </div>

      {/* Selection Badge */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
          {selectionOrder}
        </div>
      )}
    </div>
  );
};