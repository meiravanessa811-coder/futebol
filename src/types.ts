export type Position = 'Goleiro' | 'Zagueiro' | 'Lateral' | 'Meia' | 'Atacante';

export type PaymentStatus = 'pago' | 'pendente' | 'isento';

export interface PlayerStats {
  goals: number;
  assists: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  stars: number; // 1 to 5
  position: Position;
  isConfirmed: boolean;
  paymentStatus: PaymentStatus;
  isCaptain?: boolean;
  stats: PlayerStats;
  avatarUrl?: string;
}

export type TeamColor = {
  name: string;
  hex: string;
  badgeBg: string;
  badgeText: string;
  border: string;
  headerBg: string;
};

export interface Team {
  id: string;
  name: string;
  color: TeamColor;
  playerIds: string[];
  captainId?: string;
}

export type BalanceMode = 'stars' | 'positions' | 'random' | 'captains';
export type GoalkeepersMode = 'dedicated' | 'rotate';

export interface DrawConfig {
  playersPerTeam: number; // e.g. 5, 6, 7
  balanceMode: BalanceMode;
  goalkeepersMode: GoalkeepersMode;
  numTeams: number;
}

export interface GoalEvent {
  id: string;
  playerId: string;
  teamId: string;
  minute: number;
  assistPlayerId?: string;
}

export interface Match {
  id: string;
  matchNumber: number;
  teamAId: string;
  teamBId: string;
  scoreA: number;
  scoreB: number;
  status: 'scheduled' | 'live' | 'finished';
  durationMinutes: number;
  maxGoalsWin?: number;
  goals: GoalEvent[];
  startedAt?: number;
  endedAt?: number;
  winnerTeamId?: string;
}

export interface PeladaSession {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  location: string;
  courtFee: number; // R$ total rent
  pixKey?: string;
  players: Player[];
  teams: Team[];
  matches: Match[];
  currentMatchId?: string;
  drawConfig: DrawConfig;
}
