import { PeladaSession, Player } from '../types';
import { PRESET_TEAM_COLORS } from './teamColors';

export const INITIAL_PLAYERS: Player[] = [
  // Goleiros
  {
    id: 'p1',
    name: 'Pedro Henrique',
    nickname: 'Pedrinho Paredão',
    stars: 5,
    position: 'Goleiro',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 0, assists: 1, matchesPlayed: 14, wins: 8, losses: 4, draws: 2 },
  },
  {
    id: 'p2',
    name: 'Marcos Vinicius',
    nickname: 'Marcão Luva',
    stars: 4,
    position: 'Goleiro',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 0, assists: 0, matchesPlayed: 12, wins: 6, losses: 5, draws: 1 },
  },
  {
    id: 'p3',
    name: 'Lucas Silva',
    nickname: 'Mão de Alface',
    stars: 3,
    position: 'Goleiro',
    isConfirmed: true,
    paymentStatus: 'pendente',
    stats: { goals: 0, assists: 0, matchesPlayed: 8, wins: 3, losses: 4, draws: 1 },
  },

  // Zagueiros / Defensores
  {
    id: 'p4',
    name: 'Antonio Carlos',
    nickname: 'Tonho Zagueiro',
    stars: 5,
    position: 'Zagueiro',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 2, assists: 3, matchesPlayed: 15, wins: 10, losses: 3, draws: 2 },
  },
  {
    id: 'p5',
    name: 'Bruno Lima',
    nickname: 'Brunão do Corte',
    stars: 4,
    position: 'Zagueiro',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 1, assists: 2, matchesPlayed: 11, wins: 6, losses: 4, draws: 1 },
  },
  {
    id: 'p6',
    name: 'Rafael Santos',
    nickname: 'Rafa Xerife',
    stars: 4,
    position: 'Zagueiro',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 3, assists: 1, matchesPlayed: 13, wins: 7, losses: 4, draws: 2 },
  },
  {
    id: 'p7',
    name: 'Thiago Oliveira',
    nickname: 'Thiagão Barreira',
    stars: 3,
    position: 'Zagueiro',
    isConfirmed: true,
    paymentStatus: 'pendente',
    stats: { goals: 0, assists: 1, matchesPlayed: 9, wins: 4, losses: 4, draws: 1 },
  },

  // Laterais
  {
    id: 'p8',
    name: 'Gabriel Costa',
    nickname: 'Gabi Flash',
    stars: 4,
    position: 'Lateral',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 5, assists: 6, matchesPlayed: 14, wins: 8, losses: 4, draws: 2 },
  },
  {
    id: 'p9',
    name: 'Felipe Alves',
    nickname: 'Felipinho',
    stars: 3,
    position: 'Lateral',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 2, assists: 4, matchesPlayed: 10, wins: 5, losses: 4, draws: 1 },
  },

  // Meias / Armadores
  {
    id: 'p10',
    name: 'Alexandre Souza',
    nickname: 'Xande Maestro',
    stars: 5,
    position: 'Meia',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 9, assists: 14, matchesPlayed: 16, wins: 11, losses: 3, draws: 2 },
  },
  {
    id: 'p11',
    name: 'Matheus Rocha',
    nickname: 'Matheuzinho',
    stars: 4,
    position: 'Meia',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 6, assists: 8, matchesPlayed: 12, wins: 7, losses: 4, draws: 1 },
  },
  {
    id: 'p12',
    name: 'Rodrigo Ferreira',
    nickname: 'Rodrigão Driblador',
    stars: 4,
    position: 'Meia',
    isConfirmed: true,
    paymentStatus: 'pendente',
    stats: { goals: 7, assists: 5, matchesPlayed: 13, wins: 6, losses: 5, draws: 2 },
  },
  {
    id: 'p13',
    name: 'Daniel Martins',
    nickname: 'Dani Passador',
    stars: 3,
    position: 'Meia',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 3, assists: 7, matchesPlayed: 10, wins: 4, losses: 5, draws: 1 },
  },

  // Atacantes / Artilheiros
  {
    id: 'p14',
    name: 'Caio Ribeiro',
    nickname: 'Caio Pantera',
    stars: 5,
    position: 'Atacante',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 18, assists: 4, matchesPlayed: 15, wins: 10, losses: 3, draws: 2 },
  },
  {
    id: 'p15',
    name: 'Gabriel Barbosa',
    nickname: 'Gabigol do Bairro',
    stars: 5,
    position: 'Atacante',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 15, assists: 5, matchesPlayed: 14, wins: 9, losses: 4, draws: 1 },
  },
  {
    id: 'p16',
    name: 'Igor Fernandes',
    nickname: 'Igor Tanque',
    stars: 4,
    position: 'Atacante',
    isConfirmed: true,
    paymentStatus: 'pago',
    stats: { goals: 10, assists: 3, matchesPlayed: 12, wins: 6, losses: 5, draws: 1 },
  },
  {
    id: 'p17',
    name: 'Leandro Ramos',
    nickname: 'Léo Chuteira de Ouro',
    stars: 3,
    position: 'Atacante',
    isConfirmed: true,
    paymentStatus: 'pendente',
    stats: { goals: 6, assists: 2, matchesPlayed: 9, wins: 4, losses: 4, draws: 1 },
  },
  {
    id: 'p18',
    name: 'Arthur Aguiar',
    nickname: 'Tutu',
    stars: 2,
    position: 'Atacante',
    isConfirmed: false,
    paymentStatus: 'pendente',
    stats: { goals: 1, assists: 0, matchesPlayed: 4, wins: 1, losses: 3, draws: 0 },
  }
];

export const INITIAL_SESSION: PeladaSession = {
  id: 'session-1',
  title: 'Horário Fut - Arena Fives',
  date: new Date().toISOString().split('T')[0],
  location: 'Arena Fives - Quadra 2 (Society)',
  courtFee: 180, // R$ 180 total
  pixKey: 'peladadefives@pix.com.br',
  players: INITIAL_PLAYERS,
  teams: [
    {
      id: 'team-1',
      name: 'Time Colete Amarelo',
      color: PRESET_TEAM_COLORS[0],
      playerIds: ['p1', 'p4', 'p8', 'p10', 'p14'],
    },
    {
      id: 'team-2',
      name: 'Time Colete Azul',
      color: PRESET_TEAM_COLORS[1],
      playerIds: ['p2', 'p5', 'p9', 'p11', 'p15'],
    },
    {
      id: 'team-3',
      name: 'Time Colete Vermelho',
      color: PRESET_TEAM_COLORS[2],
      playerIds: ['p3', 'p6', 'p12', 'p13', 'p16'],
    }
  ],
  matches: [
    {
      id: 'm1',
      matchNumber: 1,
      teamAId: 'team-1',
      teamBId: 'team-2',
      scoreA: 2,
      scoreB: 1,
      status: 'finished',
      durationMinutes: 10,
      maxGoalsWin: 2,
      goals: [
        { id: 'g1', playerId: 'p14', teamId: 'team-1', minute: 3, assistPlayerId: 'p10' },
        { id: 'g2', playerId: 'p15', teamId: 'team-2', minute: 6, assistPlayerId: 'p11' },
        { id: 'g3', playerId: 'p14', teamId: 'team-1', minute: 9, assistPlayerId: 'p8' },
      ],
      winnerTeamId: 'team-1'
    },
    {
      id: 'm2',
      matchNumber: 2,
      teamAId: 'team-1',
      teamBId: 'team-3',
      scoreA: 0,
      scoreB: 0,
      status: 'live',
      durationMinutes: 10,
      maxGoalsWin: 2,
      goals: []
    }
  ],
  currentMatchId: 'm2',
  drawConfig: {
    playersPerTeam: 5,
    balanceMode: 'stars',
    goalkeepersMode: 'dedicated',
    numTeams: 3
  }
};
