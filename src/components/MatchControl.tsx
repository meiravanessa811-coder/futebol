import React, { useState, useEffect } from 'react';
import { GoalEvent, Match, PeladaSession, Player, Team } from '../types';
import { GoalModal } from './GoalModal';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Plus, Trophy, CheckCircle, RotateCw, Volume2, ArrowRight, Shield, Flame, Trash2 } from 'lucide-react';

interface MatchControlProps {
  session: PeladaSession;
  onUpdateMatchScore: (matchId: string, scoreA: number, scoreB: number, goals: GoalEvent[]) => void;
  onFinishMatch: (matchId: string, winnerTeamId?: string) => void;
  onStartNextMatch: (teamAId: string, teamBId: string) => void;
}

export const MatchControl: React.FC<MatchControlProps> = ({
  session,
  onUpdateMatchScore,
  onFinishMatch,
  onStartNextMatch,
}) => {
  const currentMatch = session.matches.find((m) => m.id === session.currentMatchId) || session.matches[0];
  const [secondsLeft, setSecondsLeft] = useState<number>(10 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [goalModalOpen, setGoalModalOpen] = useState<boolean>(false);
  const [selectedGoalTeamId, setSelectedGoalTeamId] = useState<string>('');

  const teamA = session.teams.find((t) => t.id === currentMatch?.teamAId);
  const teamB = session.teams.find((t) => t.id === currentMatch?.teamBId);

  // Sync initial match timer
  useEffect(() => {
    if (currentMatch) {
      setSecondsLeft((currentMatch.durationMinutes || 10) * 60);
      setIsTimerRunning(false);
    }
  }, [currentMatch?.id]);

  // Timer countdown handler
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Whistle effect
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        // Audio fallback
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  if (!currentMatch || !teamA || !teamB) {
    return (
      <div className="text-center py-16 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-3xl mb-3">
          ⏱️
        </div>
        <h3 className="text-lg font-bold text-white">Nenhuma partida iniciada</h3>
        <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-4">
          Primeiro você precisa sortear os times na aba 'Times & Sorteio'.
        </p>
      </div>
    );
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOpenGoalModal = (teamId: string) => {
    setSelectedGoalTeamId(teamId);
    setGoalModalOpen(true);
  };

  const handleConfirmGoal = (scorerId: string, assistId?: string) => {
    const isTeamA = selectedGoalTeamId === teamA.id;
    const newScoreA = isTeamA ? currentMatch.scoreA + 1 : currentMatch.scoreA;
    const newScoreB = !isTeamA ? currentMatch.scoreB + 1 : currentMatch.scoreB;

    const newGoal: GoalEvent = {
      id: `g-${Date.now()}`,
      playerId: scorerId,
      teamId: selectedGoalTeamId,
      minute: Math.ceil(((currentMatch.durationMinutes * 60) - secondsLeft) / 60) || 1,
      assistPlayerId: assistId,
    };

    const updatedGoals = [...(currentMatch.goals || []), newGoal];
    onUpdateMatchScore(currentMatch.id, newScoreA, newScoreB, updatedGoals);

    // Check if max goals win condition reached (e.g. 2 goals)
    if (currentMatch.maxGoalsWin) {
      if (newScoreA >= currentMatch.maxGoalsWin || newScoreB >= currentMatch.maxGoalsWin) {
        // Auto celebrate win
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    }
  };

  const handleRemoveGoal = (goalId: string) => {
    const targetGoal = currentMatch.goals.find((g) => g.id === goalId);
    if (!targetGoal) return;

    const isTeamA = targetGoal.teamId === teamA.id;
    const newScoreA = isTeamA ? Math.max(0, currentMatch.scoreA - 1) : currentMatch.scoreA;
    const newScoreB = !isTeamA ? Math.max(0, currentMatch.scoreB - 1) : currentMatch.scoreB;

    const updatedGoals = currentMatch.goals.filter((g) => g.id !== goalId);
    onUpdateMatchScore(currentMatch.id, newScoreA, newScoreB, updatedGoals);
  };

  const handleFinishMatch = () => {
    // Confetti celebration
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

    let winnerId: string | undefined = undefined;
    if (currentMatch.scoreA > currentMatch.scoreB) winnerId = teamA.id;
    else if (currentMatch.scoreB > currentMatch.scoreA) winnerId = teamB.id;

    onFinishMatch(currentMatch.id, winnerId);

    // Determine next match queue ("Quem ganha fica")
    if (session.teams.length >= 3) {
      const waitingTeams = session.teams.filter((t) => t.id !== teamA.id && t.id !== teamB.id);
      const nextWaiting = waitingTeams[0];

      if (winnerId) {
        // Winner stays, waiting team enters
        onStartNextMatch(winnerId, nextWaiting.id);
      } else {
        // Draw: Team A stays (or team that was longer) vs waiting
        onStartNextMatch(teamA.id, nextWaiting.id);
      }
    }
  };

  const currentGoalTeam = session.teams.find((t) => t.id === selectedGoalTeamId) || teamA;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Placar Principal e Cronômetro */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Top match header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800 text-xs">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Partida #{currentMatch.matchNumber} • EM ANDAMENTO
          </span>

          <div className="flex items-center gap-2 text-zinc-400">
            <span>Regra: {currentMatch.maxGoalsWin ? `${currentMatch.maxGoalsWin} Gols ou ` : ''}{currentMatch.durationMinutes} Minutos</span>
          </div>
        </div>

        {/* Big Scoreboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-6">
          {/* Team A */}
          <div className="md:col-span-4 flex flex-col items-center p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
            <div className={`w-12 h-12 rounded-2xl ${teamA.color.badgeBg} flex items-center justify-center text-white font-bold text-xl shadow-lg mb-2`}>
              ⚽
            </div>
            <h3 className="font-extrabold text-lg text-white mb-1">{teamA.name}</h3>
            <span className="text-5xl font-black tracking-tight text-white my-2 font-mono">
              {currentMatch.scoreA}
            </span>
            <button
              onClick={() => handleOpenGoalModal(teamA.id)}
              className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Gol do {teamA.name.split(' ')[1] || 'Time A'}
            </button>
          </div>

          {/* Center Timer & VS */}
          <div className="md:col-span-4 flex flex-col items-center justify-center py-2">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1">
              TEMPO DE JOGO
            </span>
            <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-emerald-400 my-1 bg-zinc-950/80 px-6 py-2 rounded-2xl border border-emerald-500/30 shadow-inner">
              {formatTime(secondsLeft)}
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-3 rounded-2xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg ${
                  isTimerRunning
                    ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                    : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400'
                }`}
              >
                {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-zinc-950" />}
                <span>{isTimerRunning ? 'PAUSAR' : 'INICIAR'}</span>
              </button>

              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setSecondsLeft(currentMatch.durationMinutes * 60);
                }}
                className="p-3 rounded-2xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all"
                title="Reiniciar Cronômetro"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Team B */}
          <div className="md:col-span-4 flex flex-col items-center p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center">
            <div className={`w-12 h-12 rounded-2xl ${teamB.color.badgeBg} flex items-center justify-center text-white font-bold text-xl shadow-lg mb-2`}>
              ⚽
            </div>
            <h3 className="font-extrabold text-lg text-white mb-1">{teamB.name}</h3>
            <span className="text-5xl font-black tracking-tight text-white my-2 font-mono">
              {currentMatch.scoreB}
            </span>
            <button
              onClick={() => handleOpenGoalModal(teamB.id)}
              className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Gol do {teamB.name.split(' ')[1] || 'Time B'}
            </button>
          </div>
        </div>

        {/* End match action */}
        <div className="pt-4 border-t border-zinc-800 flex justify-center">
          <button
            onClick={handleFinishMatch}
            className="px-8 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 shadow-xl shadow-amber-950/40 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Trophy className="w-5 h-5 fill-zinc-950" />
            ENCERRAR PARTIDA E DITAR VENCEDOR
          </button>
        </div>
      </div>

      {/* Goal Feed / Súmula da Partida */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
          <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <span>⚽ Súmula de Gols e Assistências</span>
            <span className="text-xs text-zinc-400">({currentMatch.goals?.length || 0} gols no jogo)</span>
          </h3>

          {(!currentMatch.goals || currentMatch.goals.length === 0) ? (
            <p className="text-xs text-zinc-500 italic py-6 text-center">
              Ainda nenhum gol marcado nesta partida. Clique em "+ Gol" para registrar!
            </p>
          ) : (
            <div className="space-y-2">
              {currentMatch.goals.map((g) => {
                const scorer = session.players.find((p) => p.id === g.playerId);
                const assist = session.players.find((p) => p.id === g.assistPlayerId);
                const team = session.teams.find((t) => t.id === g.teamId);

                return (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                        {g.minute}' min
                      </span>
                      <div>
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>⚽ {scorer?.nickname || scorer?.name || 'Jogador'}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded ${team?.color.badgeBg} text-white`}>
                            {team?.name}
                          </span>
                        </div>
                        {assist && (
                          <span className="text-[11px] text-zinc-400 block mt-0.5">
                            👟 Passe de: <strong>{assist.nickname || assist.name}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveGoal(g.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-700/50 transition-colors"
                      title="Anular/Remover Gol"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Fila do Próximo Jogo / King of the Court */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Próximos da Fila ("Quem Ganha Fica")</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              Ordem de entrada dos times aguardando do lado de fora.
            </p>

            {session.teams.length < 3 ? (
              <p className="text-xs text-zinc-500 italic py-4">
                Existem apenas 2 times no total. Ambos jogam continuamente.
              </p>
            ) : (
              <div className="space-y-2">
                {session.teams
                  .filter((t) => t.id !== teamA.id && t.id !== teamB.id)
                  .map((waitingTeam, idx) => (
                    <div
                      key={waitingTeam.id}
                      className="p-3 rounded-2xl bg-zinc-800/60 border border-zinc-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-[11px]">
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-white block">{waitingTeam.name}</span>
                          <span className="text-[10px] text-zinc-400">
                            {waitingTeam.playerIds.length} Jogadores no colete
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded bg-zinc-900 text-zinc-400 font-medium text-[10px]">
                        Aguardando
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-400">
            💡 Em caso de empate na quadra: o time perdedor do jogo anterior sai e o desafiante entra.
          </div>
        </div>
      </div>

      {/* Goal Modal */}
      <GoalModal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        team={currentGoalTeam}
        allPlayers={session.players}
        onConfirmGoal={handleConfirmGoal}
      />
    </div>
  );
};
