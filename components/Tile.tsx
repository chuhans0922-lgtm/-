import React from 'react';
import { Suit, TileData } from '../types';

interface TileProps {
  data?: TileData;
  symbol?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  selected?: boolean;
  className?: string;
  isGhost?: boolean;
}

// Color Palette
const C = {
  R: '#d91e18', // Red
  G: '#10893e', // Green
  B: '#0055aa', // Blue
  K: '#111111', // Black
};

// --- Render Helpers ---

const renderTextTile = (val: number, suitChar: string, suitColor: string) => {
  const chars = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full p-1">
      {/* Number (Black) */}
      <text x="50" y="55" textAnchor="middle" fontSize="60" fontFamily="serif" fontWeight="bold" fill={C.K}>
        {chars[val - 1]}
      </text>
      {/* Suit Character (Colored) */}
      <text x="50" y="105" textAnchor="middle" fontSize="45" fontFamily="serif" fontWeight="bold" fill={suitColor}>
        {suitChar}
      </text>
    </svg>
  );
};

const renderHonor = (val: number) => {
  const honors = ['東', '南', '西', '北', '白', '發', '中'];
  // Colors: Winds=Black, White=Blue, Green=Green, Red=Red
  const colors = [C.K, C.K, C.K, C.K, C.B, C.G, C.R];
  
  return (
    <svg viewBox="0 0 100 120" className="w-full h-full p-1">
      <text 
        x="50" y="85" 
        textAnchor="middle" 
        fontSize="75" 
        fontFamily="serif" 
        fontWeight="bold" 
        fill={colors[val - 1]}
      >
        {honors[val - 1]}
      </text>
    </svg>
  );
};

export const Tile: React.FC<TileProps> = ({ 
  data, 
  symbol, 
  size = 'md', 
  onClick, 
  selected, 
  className = '',
  isGhost
}) => {
  
  // Parse symbol if data not provided
  let suit: Suit | undefined;
  let value: number | undefined;

  if (data) {
    suit = data.suit;
    value = data.value;
  } else if (symbol) {
    value = parseInt(symbol.slice(0, -1), 10);
    suit = symbol.slice(-1) as Suit;
  }

  const sizeClasses = {
    sm: 'w-8 h-[44px]',
    md: 'w-10 h-[56px]',
    lg: 'w-12 h-[68px]',
    xl: 'w-16 h-[90px]'
  };

  const renderContent = () => {
    if (!suit || value === undefined) return null;
    switch (suit) {
      case Suit.Man: return renderTextTile(value, '萬', C.R);
      case Suit.Pin: return renderTextTile(value, '筒', C.B);
      case Suit.Sou: return renderTextTile(value, '條', C.G);
      case Suit.Honor: return renderHonor(value);
      default: return null;
    }
  };

  if (!suit || value === undefined) {
     return <div className={`${sizeClasses[size]} bg-mahjong-greenLight rounded opacity-50 border border-white/10`} />;
  }

  return (
    <div 
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        relative
        bg-[#FAFAFA]
        rounded-[4px]
        shadow-[1px_1px_3px_rgba(0,0,0,0.3),inset_-1px_-1px_1px_rgba(0,0,0,0.1),inset_1px_1px_1px_rgba(255,255,255,0.9)]
        flex items-center justify-center
        select-none cursor-pointer
        transition-all duration-200
        ${selected ? '-translate-y-3 shadow-xl ring-2 ring-yellow-400' : 'hover:-translate-y-1 hover:shadow-lg'}
        ${isGhost ? 'opacity-50 grayscale' : ''}
        ${className}
      `}
    >
      {/* 3D Depth effect at bottom/side for realism */}
      <div className="absolute bottom-0 w-full h-[6%] bg-gray-300 rounded-b-[4px]" />
      <div className="absolute right-0 top-0 h-full w-[2%] bg-gray-200 rounded-r-[4px]" />
      
      {/* Content */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden pb-[2%]">
        {renderContent()}
      </div>
    </div>
  );
};
