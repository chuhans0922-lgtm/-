import { Suit } from './types';

export const MAX_TILES = 14;

export const SUIT_LABELS: Record<Suit, string> = {
  [Suit.Man]: '萬子',
  [Suit.Pin]: '筒子',
  [Suit.Sou]: '條子',
  [Suit.Honor]: '字牌',
};

// Internal representation of all 34 tile types
export const ALL_TILE_TYPES: string[] = [];

[Suit.Man, Suit.Pin, Suit.Sou].forEach(suit => {
  for (let i = 1; i <= 9; i++) {
    ALL_TILE_TYPES.push(`${i}${suit}`);
  }
});
// 1z=East, 2z=South, 3z=West, 4z=North, 5z=White, 6z=Green, 7z=Red
for (let i = 1; i <= 7; i++) {
  ALL_TILE_TYPES.push(`${i}z`);
}