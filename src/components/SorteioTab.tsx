import React, { useState } from 'react';
import { DrawConfig, PeladaSession, Player, Team, TeamColor } from '../types';
import { TeamCard } from './TeamCard';
import { AddTeamModal } from './AddTeamModal';
import { formatTeamsForWhatsApp } from '../utils/whatsappFormatter';
import { Shuffle, Users, Sparkles, Share2, Check, ArrowRight, ShieldCheck, Settings2, Plus, Shield } from 'lucide-react';

interface SorteioTabProps {
  session: PeladaSession;
  onRunDraw: (config: DrawConfig) => void;
  onSwapPlayer: (sourcePlayerId: string, targetTeamId: string) => void;
  onSetCaptain: (teamId: string, playerId: string) => void;
  onGoToMatch: () => void;
  onAddCustomTeam?: (
    teamName: string,
    teamColor: TeamColor,
    selectedPlayerIds: string[],
    newAthletesCreated: Partial<Player>[]
  ) => void;
}

export const SorteioTab: React.FC<SorteioTabProps> = ({
  session,
  onRunDraw,
  onSwapPlayer,
  onSetCaptain,
  onGoToMatch,
  onAddCustomTeam,
}) => {
  const [copied, setCopied] = useState(false);
  const [playersPerTeam, setPlayersPerTeam] = useState<number>(session.drawConfig.playersPerTeam || 5);
  const [balanceMode, setBalanceMode] = useState<DrawConfig['balanceMode']>(session.drawConfig.balanceMode || 'stars');
  const [goalkeepersMode, setGoalkeepersMode] = useState<DrawConfig['goalkeepersMode']>(session.drawConfig.goalkeepersMode || 'dedicated');
  const [isAddTeamModalOpen, setIsAddTeamModalOpen] = useState(false);

  const confirmedPlayers = session.players.filter((p) => p.isConfirmed);
  const totalConfirmed = confirmedPlayers.length;
  const calculatedNumTeams = Math.max(2, Math.ceil(totalConfirmed / playersPerTeam));

  const handleDraw = () => {
    onRunDraw({
      playersPerTeam,
      balanceMode,
      goalkeepersMode,
      numTeams: calculatedNumTeams,
    });
  };

  const handleCopyWhatsApp = () => {
    const text = formatTeamsForWhatsApp(session);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveCustomTeam = (
    teamName: string,
    teamColor: TeamColor,
    selectedPlayerIds: string[],
    newAthletesCreated: Partial<Player>[]
  ) => {
    if (onAddCustomTeam) {
      onAddCustomTeam(teamName, teamColor, selectedPlayerIds, newAthletesCreated);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Sorteio Configuration Panel */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shuffle className="w-5 h-5 text-emerald-400" />
              Sorteio & Divisão de Times
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Configure o formato e o algoritmo inteligente vai equilibrar as equipes
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-semibold text-xs flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              {totalConfirmed} Confirmados ({calculatedNumTeams} Times previstos)
            </span>
          </div>
        </div>

        {/* Configuration Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Jogadores por time */}
          <div className="bg-zinc-800/60 border border-zinc-800 rounded-2xl p-4">
            <label className="text-xs font-bold text-zinc-300 block mb-2">
              Formato de Jogo (Jogadores por time)
            </label>
            <select
              value={playersPerTeam}
              onChange={(e) => setPlayersPerTeam(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value={3}>3 x 3 (Futsal reduzido)</option>
              <option value={4}>4 x 4 (Quadra pequena)</option>
              <option value={5}>5 x 5 (Futsal / Society 5)</option>
              <option value={6}>6 x 6 (Society 6)</option>
              <option value={7}>7 x 7 (Society Padrão)</option>
              <option value={8}>8 x 8 (Campo reduzido)</option>
              <option value={11}>11 x 11 (Campo oficial)</option>
            </select>
            <p className="text-[11px] text-zinc-400 mt-1.5">
              Gera cerca de {Math.ceil(totalConfirmed / playersPerTeam)} times de {playersPerTeam} pessoas.
            </p>
          </div>

          {/* Modo de Equilíbrio */}
          <div className="bg-zinc-800/60 border border-zinc-800 rounded-2xl p-4">
            <label className="text-xs font-bold text-zinc-300 block mb-2">
              Algoritmo de Balanceamento
            </label>
            <select
              value={balanceMode}
              onChange={(e) => setBalanceMode(e.target.value as DrawConfig['balanceMode'])}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="stars">⚖️ Equilibrado por Estrelas (Nível)</option>
              <option value="positions">🎯 Equilibrado por Posições + Estrelas</option>
              <option value="random">🎲 Aleatório Pure Luck</option>
            </select>
            <p className="text-[11px] text-zinc-400 mt-1.5">
              Distribui os craques uniformemente entre todos os coletes.
            </p>
          </div>

          {/* Goleiros */}
          <div className="bg-zinc-800/60 border border-zinc-800 rounded-2xl p-4">
            <label className="text-xs font-bold text-zinc-300 block mb-2">
              Modo de Goleiros
            </label>
            <select
              value={goalkeepersMode}
              onChange={(e) => setGoalkeepersMode(e.target.value as DrawConfig['goalkeepersMode'])}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="dedicated">🧤 1 Goleiro Fixo por Time</option>
              <option value="rotate">🔄 Rodízio na Linha (Goleiro Linha)</option>
            </select>
            <p className="text-[11px] text-zinc-400 mt-1.5">
              {goalkeepersMode === 'dedicated'
                ? 'Separa os goleiros cadastrados antes dos jogadores de linha.'
                : 'Mete todo mundo na linha e faz rodízio durante o jogo.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-zinc-400">
            {totalConfirmed < 4 ? (
              <span className="text-amber-400 font-medium">
                ⚠️ Poucos jogadores confirmados. Vá na aba 'Elenco' para confirmar mais gente ou adicione um time manualmente.
              </span>
            ) : (
              <span>Sorteio automático pronto para rodar com {totalConfirmed} atletas.</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsAddTeamModalOpen(true)}
              className="px-4 py-3 rounded-2xl font-bold text-xs bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Adicionar Novo Time
            </button>

            <button
              onClick={handleDraw}
              disabled={totalConfirmed < 2}
              className="flex-1 sm:flex-none px-6 py-3 rounded-2xl font-extrabold text-sm bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 transition-all shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-zinc-950" />
              SORTEAR TIMES AGORA
            </button>
          </div>
        </div>
      </div>

      {/* Generated Teams Showcase */}
      {session.teams.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-3xl mb-3">
            🎽
          </div>
          <h3 className="text-lg font-bold text-white">Nenhum time cadastrado ou sorteado ainda</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-4">
            Você pode adicionar um time novo manualmente com seus atletas ou clicar no botão acima para rodar o sorteio automático!
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setIsAddTeamModalOpen(true)}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Adicionar Time com Atletas
            </button>
            <button
              onClick={handleDraw}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
            >
              Sorteia Aí
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Coletes Definidos</span>
              <span className="text-xs font-normal text-zinc-400">
                ({session.teams.length} equipes)
              </span>
            </h3>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsAddTeamModalOpen(true)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Time</span>
              </button>

              <button
                onClick={handleCopyWhatsApp}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                {copied ? 'Copiado para Zap!' : 'Copiar para WhatsApp'}
              </button>

              <button
                onClick={onGoToMatch}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 flex items-center gap-1.5 shadow-md"
              >
                <span>Ir para a Partida</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {session.teams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                allPlayers={session.players}
                allTeams={session.teams}
                onSwapPlayer={onSwapPlayer}
                onSetCaptain={onSetCaptain}
              />
            ))}
          </div>
        </div>
      )}

      {/* Add Team Modal */}
      {isAddTeamModalOpen && (
        <AddTeamModal
          isOpen={isAddTeamModalOpen}
          onClose={() => setIsAddTeamModalOpen(false)}
          availablePlayers={session.players}
          onSaveTeam={handleSaveCustomTeam}
        />
      )}
    </div>
  );
};
