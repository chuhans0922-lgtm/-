import React, { useState, useEffect } from 'react';
import { TileData } from './types';
import { parseTile, sortTiles, checkWin, calculateWaits } from './utils/mahjongLogic';
import { TileSelector } from './components/TileSelector';
import { Tile } from './components/Tile';
import { MAX_TILES } from './constants';
import { Trash2, Info, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [hand, setHand] = useState<TileData[]>([]);
  const [waitingTiles, setWaitingTiles] = useState<string[]>([]);
  
  // Hand Calculation Effect
  useEffect(() => {
    // Calculate waits if we have 1, 4, 7, 10, 13 tiles
    if (hand.length > 0) {
      const waits = calculateWaits(hand);
      setWaitingTiles(waits);
    } else {
      setWaitingTiles([]);
    }
  }, [hand]);

  const addTile = (symbol: string) => {
    if (hand.length >= MAX_TILES) return;
    
    // Count occurences to prevent >4 of same tile
    const count = hand.filter(t => t.symbol === symbol).length;
    if (count >= 4) return;

    const newTile = parseTile(symbol);
    setHand(prev => sortTiles([...prev, newTile]));
  };

  const removeTile = (id: string) => {
    setHand(prev => prev.filter(t => t.id !== id));
  };

  const clearHand = () => {
    setHand([]);
    setWaitingTiles([]);
  };

  // Derived state for display
  const isTenpai = waitingTiles.length > 0;
  const isWinning = hand.length % 3 === 2 && checkWin(hand); // Can win on 2, 5, 8, 11, 14
  
  // Check if hand count is valid for Tenpai (1, 4, 7, 10, 13)
  const isWaitCheckable = hand.length > 0 && (hand.length % 3 === 1);
  const showCountWarning = hand.length > 0 && !isWaitCheckable && !isWinning && hand.length !== 14;

  return (
    <div className="min-h-screen text-gray-100 font-sans pb-10">
      
      {/* Header */}
      <header className="bg-mahjong-green/90 backdrop-blur border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white rounded flex items-center justify-center text-red-600 font-serif font-bold text-2xl shadow-lg">
                中
             </div>
             <div>
               <h1 className="text-xl font-bold tracking-wide text-mahjong-gold">麻將聽牌大師</h1>
               <p className="text-xs text-gray-400">聽牌計算器</p>
             </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={clearHand}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-colors text-sm"
              title="清空手牌"
            >
              <Trash2 className="w-4 h-4 text-gray-300" />
              <span>清空</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 flex flex-col gap-6">
        
          {/* Hand Display Area */}
          <section className="bg-mahjong-felt rounded-xl p-4 sm:p-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] border border-white/5 min-h-[220px] flex flex-col justify-center relative transition-all duration-300">
            
            {/* Status Indicators */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-mono border transition-colors ${showCountWarning ? 'bg-red-900/40 border-red-500/50 text-red-200' : 'bg-black/40 border-white/10 text-gray-300'}`}>
                {hand.length} / {MAX_TILES} 張
              </span>
              {isTenpai && !isWinning && (
                <span className="bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg shadow-red-900/50">
                  聽牌
                </span>
              )}
               {isWinning && (
                <span className="bg-mahjong-gold text-black px-3 py-1 rounded-full text-xs font-bold animate-bounce shadow-lg shadow-yellow-500/50">
                  胡牌!
                </span>
              )}
            </div>

            {/* The Hand */}
            <div className="flex flex-wrap justify-center items-end gap-1 sm:gap-2 mt-6">
              {hand.map((tile) => (
                <div key={tile.id} className="animate-tile-enter group relative">
                  <Tile 
                    data={tile} 
                    size="lg" // Larger on main display
                    onClick={() => removeTile(tile.id)}
                    className="cursor-pointer hover:z-10"
                  />
                  {/* Hover Delete Indicator */}
                  <div className="absolute -top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white rounded-full p-0.5 shadow-md pointer-events-none transform translate-x-1/2 -translate-y-1/2 scale-75">
                    <Trash2 className="w-3 h-3" />
                  </div>
                </div>
              ))}
              
              {/* Ghost Tile Slot if empty */}
              {hand.length === 0 && (
                <div className="text-white/20 text-center font-serif italic text-lg w-full py-10">
                  請點選下方牌組建立手牌
                </div>
              )}
            </div>

             {/* Count Warning Message */}
             {showCountWarning && (
               <div className="mt-8 mx-auto max-w-md flex items-center justify-center gap-3 text-yellow-300 bg-yellow-900/30 px-5 py-3 rounded-lg border border-yellow-500/30 animate-pulse">
                 <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                 <span className="text-sm font-medium tracking-wide">聽牌時手牌數應為 1, 4, 7, 10, 13 張</span>
               </div>
            )}

            {/* Waiting Tiles Display */}
            {waitingTiles.length > 0 && !isWinning && (
               <div className="mt-8 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex items-center gap-2 mb-3 text-mahjong-gold text-sm font-bold uppercase tracking-widest opacity-80">
                   <Info className="w-4 h-4" /> 聽牌列表 ({waitingTiles.length}門)：
                 </div>
                 <div className="flex flex-wrap gap-3">
                   {waitingTiles.map((wait) => (
                     <div key={wait} className="flex flex-col items-center gap-1 group">
                        <Tile symbol={wait} size="md" className="ring-2 ring-mahjong-gold/50 group-hover:scale-110 group-hover:ring-mahjong-gold transition-all" />
                     </div>
                   ))}
                 </div>
               </div>
            )}
          </section>

          {/* Tile Picker */}
          <TileSelector 
            onSelect={addTile} 
            disabled={hand.length >= MAX_TILES}
          />

      </main>
    </div>
  );
};

export default App;