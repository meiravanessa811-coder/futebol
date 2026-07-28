/**
 * @license
 * Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DrawConfig, GoalEvent, PaymentStatus, PeladaSession, Player, Team, TeamColor } from './types';
import { INITIAL_SESSION } from './utils/mockData';
import { sortTeams } from './utils/teamSorter';
import { Header } from './components/Header';
import { NavigationTabs, TabType } from './components/NavigationTabs';
import { SorteioTab } from './components/SorteioTab';
import { MatchControl } from './components/MatchControl';
import { PlayersTab } from './components/PlayersTab';
import { StatsTab } from './components/StatsTab';
import { FinanceTab } from './components/FinanceTab';
import { NewHorarioModal } from './components/NewHorarioModal';

const LOCAL_STORAGE_KEY = 'pelada_facil_session_v1';

export default function App() {
  const [session, setSession] = useState<PeladaSession>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from local storage', e);
    }
    return INITIAL_SESSION;
  });

  const [activeTab, setActiveTab] = useState<TabType>('sorteio');
  const [isNewHorarioModalOpen, setIsNewHorarioModalOpen] = useState(false);

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to save to local storage', e);
    }
  }, [session]);

  const updateSession = (updatedFields: Partial<PeladaSession>) => {
    setSession((prev) => ({ ...prev, ...updatedFields }));
  };

  // Add a Custom Team manually
  const handleAddCustomTeam = (
    teamName: string,
    teamColor: TeamColor,
    selectedPlayerIds: string[],
    newAthletesCreated: Partial<Player>[]
  ) => {
    setSession((prev) => {
      const newlyCreatedPlayersList: Player[] = newAthletesCreated.map((ath, idx) => ({
        id: ath.id || `player-${Date.now()}-${idx}`,
        name: ath.name || 'Novo Atleta',
        nickname: ath.nickname,
        stars: ath.stars || 3,
        position: ath.position || 'Meia',
        isConfirmed: true,
        paymentStatus: 'pendente',
        stats: { goals: 0, assists: 0, matchesPlayed: 0, wins: 0, losses: 0, draws: 0 },
      }));

      const updatedPlayers = [...prev.players, ...newlyCreatedPlayersList];

      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: teamName,
        color: teamColor,
        playerIds: selectedPlayerIds,
      };

      return {
        ...prev,
        players: updatedPlayers,
        teams: [...prev.teams, newTeam],
      };
    });
  };

  // Create Novo Horário Session with optional Teams & Players
  const handleCreateSchedule = (
    details: {
      title: string;
      location: string;
      date: string;
      courtFee: number;
      pixKey: string;
    },
    newTeams: Team[],
    newPlayers: Player[]
  ) => {
    setSession((prev) => {
      const combinedPlayers = [...prev.players];
      newPlayers.forEach((np) => {
        if (!combinedPlayers.some((p) => p.id === np.id)) {
          combinedPlayers.push(np);
        }
      });

      const finalTeams = newTeams.length > 0 ? newTeams : prev.teams;

      let newMatches = prev.matches;
      let currentMatchId = prev.currentMatchId;

      if (newTeams.length >= 2) {
        const firstMatch = {
          id: `match-${Date.now()}-1`,
          matchNumber: 1,
          teamAId: newTeams[0].id,
          teamBId: newTeams[1].id,
          scoreA: 0,
          scoreB: 0,
          status: 'live' as const,
          durationMinutes: 10,
          maxGoalsWin: 2,
          goals: [],
        };
        newMatches = [firstMatch];
        currentMatchId = firstMatch.id;
      }

      return {
        ...prev,
        id: `session-${Date.now()}`,
        title: details.title,
        location: details.location,
        date: details.date,
        courtFee: details.courtFee,
        pixKey: details.pixKey,
        players: combinedPlayers,
        teams: finalTeams,
        matches: newTeams.length > 0 ? newMatches : prev.matches,
        currentMatchId: newTeams.length > 0 ? currentMatchId : prev.currentMatchId,
      };
    });
    setActiveTab('sorteio');
  };

  // Run Team Sorteio
  const handleRunDraw = (config: DrawConfig) => {
    const generatedTeams = sortTeams(session.players, config);

    // Create default first match between Team 1 and Team 2 if available
    let newMatches = session.matches;
    let currentMatchId = session.currentMatchId;

    if (generatedTeams.length >= 2) {
      const firstMatch = {
        id: `match-${Date.now()}-1`,
        matchNumber: 1,
        teamAId: generatedTeams[0].id,
        teamBId: generatedTeams[1].id,
        scoreA: 0,
        scoreB: 0,
        status: 'live' as const,
        durationMinutes: 10,
        maxGoalsWin: 2,
        goals: [],
      };
      newMatches = [firstMatch];
      currentMatchId = firstMatch.id;
    }

    setSession((prev) => ({
      ...prev,
      teams: generatedTeams,
      drawConfig: config,
      matches: newMatches,
      currentMatchId,
    }));
  };

  // Swap Player to Target Team
  const handleSwapPlayer = (sourcePlayerId: string, targetTeamId: string) => {
    setSession((prev) => {
      const updatedTeams = prev.teams.map((t) => {
        // Remove from current team if present
        const filteredPlayerIds = t.playerIds.filter((id) => id !== sourcePlayerId);
        if (t.id === targetTeamId) {
          return { ...t, playerIds: [...filteredPlayerIds, sourcePlayerId] };
        }
        return { ...t, playerIds: filteredPlayerIds };
      });
      return { ...prev, teams: updatedTeams };
    });
  };

  // Set Team Captain
  const handleSetCaptain = (teamId: string, playerId: string) => {
    setSession((prev) => {
      const updatedTeams = prev.teams.map((t) =>
        t.id === teamId ? { ...t, captainId: playerId } : t
      );
      return { ...prev, teams: updatedTeams };
    });
  };

  // Save Player (Add or Edit)
  const handleSavePlayer = (playerData: Partial<Player>) => {
    setSession((prev) => {
      let updatedPlayers = [...prev.players];

      if (playerData.id) {
        // Edit
        updatedPlayers = updatedPlayers.map((p) =>
          p.id === playerData.id ? ({ ...p, ...playerData } as Player) : p
        );
      } else {
        // Create
        const newPlayer: Player = {
          id: `player-${Date.now()}`,
          name: playerData.name || 'Novo Jogador',
          nickname: playerData.nickname,
          stars: playerData.stars || 3,
          position: playerData.position || 'Meia',
          isConfirmed: playerData.isConfirmed ?? true,
          paymentStatus: playerData.paymentStatus || 'pendente',
          stats: { goals: 0, assists: 0, matchesPlayed: 0, wins: 0, losses: 0, draws: 0 },
        };
        updatedPlayers.push(newPlayer);
      }

      return { ...prev, players: updatedPlayers };
    });
  };

  // Delete Player
  const handleDeletePlayer = (playerId: string) => {
    setSession((prev) => {
      const updatedPlayers = prev.players.filter((p) => p.id !== playerId);
      const updatedTeams = prev.teams.map((t) => ({
        ...t,
        playerIds: t.playerIds.filter((id) => id !== playerId),
      }));
      return { ...prev, players: updatedPlayers, teams: updatedTeams };
    });
  };

  // Toggle Presence
  const handleTogglePresence = (playerId: string) => {
    setSession((prev) => {
      const updatedPlayers = prev.players.map((p) =>
        p.id === playerId ? { ...p, isConfirmed: !p.isConfirmed } : p
      );
      return { ...prev, players: updatedPlayers };
    });
  };

  // Bulk Confirm
  const handleBulkConfirm = (confirmAll: boolean) => {
    setSession((prev) => {
      const updatedPlayers = prev.players.map((p) => ({ ...p, isConfirmed: confirmAll }));
      return { ...prev, players: updatedPlayers };
    });
  };

  // Update Player Payment
  const handleUpdatePlayerPayment = (playerId: string, status: PaymentStatus) => {
    setSession((prev) => {
      const updatedPlayers = prev.players.map((p) =>
        p.id === playerId ? { ...p, paymentStatus: status } : p
      );
      return { ...prev, players: updatedPlayers };
    });
  };

  // Live Match Score Update
  const handleUpdateMatchScore = (
    matchId: string,
    scoreA: number,
    scoreB: number,
    goals: GoalEvent[]
  ) => {
    setSession((prev) => {
      const updatedMatches = prev.matches.map((m) =>
        m.id === matchId ? { ...m, scoreA, scoreB, goals } : m
      );
      return { ...prev, matches: updatedMatches };
    });
  };

  // Finish Match & Calculate Player Stats
  const handleFinishMatch = (matchId: string, winnerTeamId?: string) => {
    setSession((prev) => {
      const currentMatch = prev.matches.find((m) => m.id === matchId);
      if (!currentMatch) return prev;

      const teamA = prev.teams.find((t) => t.id === currentMatch.teamAId);
      const teamB = prev.teams.find((t) => t.id === currentMatch.teamBId);

      const teamAPlayerIds = teamA ? teamA.playerIds : [];
      const teamBPlayerIds = teamB ? teamB.playerIds : [];

      // Update match status
      const updatedMatches = prev.matches.map((m) =>
        m.id === matchId
          ? { ...m, status: 'finished' as const, winnerTeamId, endedAt: Date.now() }
          : m
      );

      // Accumulate player stats from this match
      const updatedPlayers = prev.players.map((p) => {
        const isTeamA = teamAPlayerIds.includes(p.id);
        const isTeamB = teamBPlayerIds.includes(p.id);

        if (!isTeamA && !isTeamB) return p;

        // Count goals scored in this match by player
        const playerGoalsInMatch = currentMatch.goals.filter((g) => g.playerId === p.id).length;
        const playerAssistsInMatch = currentMatch.goals.filter(
          (g) => g.assistPlayerId === p.id
        ).length;

        let wins = p.stats.wins;
        let losses = p.stats.losses;
        let draws = p.stats.draws;

        if (winnerTeamId) {
          if ((isTeamA && winnerTeamId === teamA?.id) || (isTeamB && winnerTeamId === teamB?.id)) {
            wins += 1;
          } else {
            losses += 1;
          }
        } else {
          draws += 1;
        }

        return {
          ...p,
          stats: {
            ...p.stats,
            goals: p.stats.goals + playerGoalsInMatch,
            assists: p.stats.assists + playerAssistsInMatch,
            matchesPlayed: p.stats.matchesPlayed + 1,
            wins,
            losses,
            draws,
          },
        };
      });

      return { ...prev, matches: updatedMatches, players: updatedPlayers };
    });
  };

  // Start Next Match in Queue
  const handleStartNextMatch = (teamAId: string, teamBId: string) => {
    const newMatch = {
      id: `match-${Date.now()}`,
      matchNumber: session.matches.length + 1,
      teamAId,
      teamBId,
      scoreA: 0,
      scoreB: 0,
      status: 'live' as const,
      durationMinutes: 10,
      maxGoalsWin: 2,
      goals: [],
    };

    setSession((prev) => ({
      ...prev,
      matches: [...prev.matches, newMatch],
      currentMatchId: newMatch.id,
    }));
  };

  // Start New Fresh Pelada Session
  const handleNewSession = () => {
    if (confirm('Deseja iniciar uma nova pelada? As estatísticas e times atuais serão reiniciados.')) {
      setSession({
        ...INITIAL_SESSION,
        id: `session-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        matches: [],
        teams: [],
        currentMatchId: undefined,
      });
      setActiveTab('sorteio');
    }
  };

  const liveMatch = session.matches.find((m) => m.id === session.currentMatchId);
  const liveMatchActive = liveMatch?.status === 'live';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased selection:bg-emerald-500 selection:text-zinc-950">
      {/* App Header */}
      <Header
        session={session}
        onUpdateSession={updateSession}
        onNewSession={() => setIsNewHorarioModalOpen(true)}
      />

      {/* Navigation Tabs Bar */}
      <NavigationTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        liveMatchActive={liveMatchActive}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'sorteio' && (
          <SorteioTab
            session={session}
            onRunDraw={handleRunDraw}
            onSwapPlayer={handleSwapPlayer}
            onSetCaptain={handleSetCaptain}
            onGoToMatch={() => setActiveTab('partida')}
            onAddCustomTeam={handleAddCustomTeam}
          />
        )}

        {activeTab === 'partida' && (
          <MatchControl
            session={session}
            onUpdateMatchScore={handleUpdateMatchScore}
            onFinishMatch={handleFinishMatch}
            onStartNextMatch={handleStartNextMatch}
          />
        )}

        {activeTab === 'jogadores' && (
          <PlayersTab
            players={session.players}
            onSavePlayer={handleSavePlayer}
            onDeletePlayer={handleDeletePlayer}
            onTogglePresence={handleTogglePresence}
            onBulkConfirm={handleBulkConfirm}
          />
        )}

        {activeTab === 'estatisticas' && <StatsTab session={session} />}

        {activeTab === 'caixinha' && (
          <FinanceTab
            session={session}
            onUpdateSession={updateSession}
            onUpdatePlayerPayment={handleUpdatePlayerPayment}
          />
        )}
      </main>

      {/* Modal para Novo Horário */}
      <NewHorarioModal
        isOpen={isNewHorarioModalOpen}
        onClose={() => setIsNewHorarioModalOpen(false)}
        currentPlayers={session.players}
        onCreateSchedule={handleCreateSchedule}
      />
    </div>
  );
}
