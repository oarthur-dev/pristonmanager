export interface Profile {
  id: string;
  username: string;
  game_character_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Clan {
  id: string;
  name: string;
  leader_id: string;
  created_at: string;
  updated_at: string;
}

export interface ClanMember {
  clan_id: string;
  profile_id: string;
  role: string;
  joined_at: string;
}

export interface SupportTicket {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}