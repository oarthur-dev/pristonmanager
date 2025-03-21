export interface Character {
  CharID: number;
  CharName: string;
  Level: number;
  Class: number;
  Exp: number;
  Strength: number;
  Spirit: number;
  Talent: number;
  Agility: number;
  Health: number;
  Mana: number;
  LastLogin: Date;
}

export interface GameRanking {
  Rank: number;
  CharName: string;
  Level: number;
  Class: number;
  Experience: number;
  GuildName: string | null;
}

export interface CharacterStats {
  TotalPlayTime: number;
  KillCount: number;
  DeathCount: number;
  QuestsCompleted: number;
  ItemsCollected: number;
}

export const ClassNames: Record<number, string> = {
  0: 'Fighter',
  1: 'Mechanician',
  2: 'Archer',
  3: 'Pikeman',
  4: 'Atalanta',
  5: 'Knight',
  6: 'Magician',
  7: 'Priestess',
};