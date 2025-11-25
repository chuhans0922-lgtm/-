import { ALL_TILE_TYPES } from '../constants';
import { TileData, Suit } from '../types';

// Helper to parse "1m" to object
export const parseTile = (tileStr: string): TileData => {
  const value = parseInt(tileStr.slice(0, -1), 10);
  const suit = tileStr.slice(-1) as Suit;
  return {
    id: `${tileStr}-${Math.random().toString(36).substr(2, 9)}`,
    suit,
    value,
    symbol: tileStr
  };
};

export const sortTiles = (tiles: TileData[]): TileData[] => {
  const suitOrder = { [Suit.Man]: 0, [Suit.Pin]: 1, [Suit.Sou]: 2, [Suit.Honor]: 3 };
  return [...tiles].sort((a, b) => {
    if (a.suit !== b.suit) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    return a.value - b.value;
  });
};

// --- Win Check Logic ---

// Convert tiles to a frequency map array (index 0-33)
const tilesToIndices = (tiles: TileData[]): number[] => {
  const counts = new Array(34).fill(0);
  tiles.forEach(t => {
    let idx = -1;
    if (t.suit === Suit.Man) idx = t.value - 1;
    else if (t.suit === Suit.Pin) idx = 9 + t.value - 1;
    else if (t.suit === Suit.Sou) idx = 18 + t.value - 1;
    else if (t.suit === Suit.Honor) idx = 27 + t.value - 1;
    
    if (idx >= 0) counts[idx]++;
  });
  return counts;
};

const isSevenPairs = (counts: number[]): boolean => {
  let pairs = 0;
  for (let c of counts) {
    if (c === 2) pairs++;
    else if (c !== 0) return false;
  }
  return pairs === 7;
};

const isStandardWin = (counts: number[], setsNeeded: number): boolean => {
  // Try every tile as a pair head
  for (let i = 0; i < 34; i++) {
    if (counts[i] >= 2) {
      counts[i] -= 2;
      if (checkSets(counts, 0, setsNeeded)) {
        counts[i] += 2;
        return true;
      }
      counts[i] += 2;
    }
  }
  return false;
};

const checkSets = (counts: number[], setsFound: number, setsNeeded: number): boolean => {
  if (setsFound === setsNeeded) return true;

  // Find first non-empty tile
  let i = 0;
  while (i < 34 && counts[i] === 0) i++;
  
  if (i === 34) return true; // Should have been caught by setsFound check

  // Try Triplet (Koutsu)
  if (counts[i] >= 3) {
    counts[i] -= 3;
    if (checkSets(counts, setsFound + 1, setsNeeded)) {
      counts[i] += 3;
      return true;
    }
    counts[i] += 3;
  }

  // Try Sequence (Shuntsu) - Honors cannot form sequences
  // Man: 0-8, Pin: 9-17, Sou: 18-26. Honors: 27-33
  if (i < 27 && counts[i] > 0 && counts[i+1] > 0 && counts[i+2] > 0) {
    // Ensure sequence doesn't wrap suits (e.g. 9m 1p 2p)
    const suit1 = Math.floor(i / 9);
    const suit2 = Math.floor((i+1) / 9);
    const suit3 = Math.floor((i+2) / 9);
    
    if (suit1 === suit2 && suit2 === suit3) {
      counts[i]--;
      counts[i+1]--;
      counts[i+2]--;
      if (checkSets(counts, setsFound + 1, setsNeeded)) {
        counts[i]++;
        counts[i+1]++;
        counts[i+2]++;
        return true;
      }
      counts[i]++;
      counts[i+1]++;
      counts[i+2]++;
    }
  }

  return false;
};

// Main function to check if current hand is a win
// Supports 14 tiles (standard), but also 2, 5, 8, 11 for partial drill checks.
export const checkWin = (tiles: TileData[]): boolean => {
  // Must be 3n + 2
  if (tiles.length % 3 !== 2) return false;
  
  const counts = tilesToIndices(tiles);
  
  // Seven pairs is specifically a 14-tile hand
  if (tiles.length === 14 && isSevenPairs(counts)) return true;

  const setsNeeded = (tiles.length - 2) / 3;
  return isStandardWin(counts, setsNeeded);
};

// Calculate Waiting Tiles (Tenpai)
export const calculateWaits = (tiles: TileData[]): string[] => {
  // Can only check waits if adding 1 tile makes a valid win structure (3n + 2)
  // So current length must be 3n + 1: 1, 4, 7, 10, 13
  if (tiles.length % 3 !== 1) return [];

  const waits: string[] = [];
  
  for (const candidate of ALL_TILE_TYPES) {
    const testHand = [...tiles, parseTile(candidate)];
    // Ensure we don't exceed 4 of a kind (validity check)
    const counts = tilesToIndices(testHand);
    if (counts.some(c => c > 4)) continue;

    if (checkWin(testHand)) {
      waits.push(candidate);
    }
  }
  
  return waits;
};