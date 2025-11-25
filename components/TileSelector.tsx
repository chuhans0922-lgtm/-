import React from 'react';
import { ALL_TILE_TYPES, SUIT_LABELS } from '../constants';
import { Suit } from '../types';
import { Tile } from './Tile';

interface TileSelectorProps {
  onSelect: (symbol: string) => void;
  disabled: boolean;
}

export const TileSelector: React.FC<TileSelectorProps> = ({ onSelect, disabled }) => {
  
  const renderRow = (suit: Suit) => {
    // Filter tiles belonging to this suit
    const tiles = ALL_TILE_TYPES.filter(t => t.endsWith(suit));
    
    return (
      <div className="mb-4" key={suit}>
        <div className="text-mahjong-gold text-xs font-bold uppercase tracking-wider mb-2 opacity-80 pl-1">
          {SUIT_LABELS[suit]}
        </div>
        <div className="flex flex-wrap gap-2">
          {tiles.map(tile => (
            <Tile 
              key={tile} 
              symbol={tile} 
              size="sm" 
              onClick={() => !disabled && onSelect(tile)}
              className={disabled ? 'cursor-not-allowed opacity-50' : 'active:scale-95'}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-inner">
      {renderRow(Suit.Man)}
      {renderRow(Suit.Pin)}
      {renderRow(Suit.Sou)}
      {renderRow(Suit.Honor)}
    </div>
  );
};
