import React from 'react';
import { Player, Team } from '../types';
import { calculateTeamStats } from '../utils/teamSorter';
import { Star, Shield, ArrowUpDown, UserCheck, Crown } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  allPlayers: Player[];
  allTeams: Team[];
  onSwapPlayer?: (sourcePlayerId: string, targetTeamId: string) => void;
  onRemovePlayerFromTeam?: (playerId: string, teamId: string) => void;
  onSetCaptain?: (teamId: string, playerId: string) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
  team,
  allPlayers,
  allTeams,
  onSwapPlayer,
  onRemovePlayerFromTeam,
  onSetCaptain,
}) => {
  const stats = calculateTeamStats(team, allPlayers);

  return (
    <div className={`rounded-2xl border ${team.color.border} bg-zinc-900/90 shadow-xl overflow-hidden flex flex-col h-full transition-all hover:border-zinc-500`}>
      {/* Header bar with team bib color */}
      <div className={`px-4 py-3 ${team.color.headerBg} border-b ${team.color.border} flex items-center justify-between`}>
        <div className="flex items-center space-x-2.5">
          <div className={`w-4 h-4 rounded-full ${team.color.badgeBg} border border-white/20 shadow-sm`} />
          <h3 className="font-bold text-base tracking-tight">{team.name}</h3>
        </div>
        <div className="flex items-center space-x-2 text-xs font-medium">
          <span className="px-2 py-0.5 rounded-md bg-zinc-950/40 border border-white/10 flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>Média {stats.avgStars}</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-950/40 border border-white/10">
            {stats.playersCount} Jogadores
          </span>
        </div>
      </div>

      {/* Roster distribution mini breakdown */}
      <div className="px-4 py-2 bg-zinc-950/50 border-b border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-emerald-400" />
          🧤 GOL: {stats.goalkeepersCount}
        </span>
        <span>🛡️ DEF: {stats.defendersCount}</span>
        <span>🎯 MEI: {stats.midfieldersCount}</span>
        <span>⚡ ATA: {stats.forwardsCount}</span>
      </div>

      {/* Players List */}
      <div className="p-3 space-y-1.5 flex-1 overflow-y-auto max-h-[360px]">
        {stats.players.length === 0 ? (
          <div className="text-center py-6 text-xs text-zinc-500 italic">
            Nenhum jogador neste time.
          </div>
        ) : (
          stats.players.map((player, idx) => {
            const isCaptain = team.captainId === player.id;
            const posBadgeColor =
              player.position === 'Goleiro'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : player.position === 'Zagueiro' || player.position === 'Lateral'
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                : player.position === 'Meia'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

            return (
              <div
                key={player.id}
                className="group flex items-center justify-between p-2 rounded-xl bg-zinc-800/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/90 transition-all text-xs"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <span className="text-[11px] font-mono text-zinc-500 w-4 text-center">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-zinc-100 truncate max-w-[120px] sm:max-w-[140px]">
                        {player.nickname || player.name}
                      </span>
                      {isCaptain && (
                        <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline" title="Capitão" />
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-medium ${posBadgeColor}`}>
                        {player.position}
                      </span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: player.stars }).map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions: Swap to other team or Set Captain */}
                <div className="flex items-center space-x-1 opacity-90 group-hover:opacity-100 transition-opacity">
                  {onSetCaptain && !isCaptain && (
                    <button
                      onClick={() => onSetCaptain(team.id, player.id)}
                      className="p-1 rounded bg-zinc-700/50 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-400 transition-colors"
                      title="Tornar Capitão"
                    >
                      <Crown className="w-3 h-3" />
                    </button>
                  )}

                  {onSwapPlayer && allTeams.length > 1 && (
                    <div className="relative group/swap">
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            onSwapPlayer(player.id, e.target.value);
                          }
                        }}
                        defaultValue=""
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        title="Mover para outro time"
                      >
                        <option value="" disabled>
                          Mover para...
                        </option>
                        {allTeams
                          .filter((t) => t.id !== team.id)
                          .map((t) => (
                            <option key={t.id} value={t.id}>
                              Mover para {t.name}
                            </option>
                          ))}
                      </select>
                      <button
                        className="p-1.5 rounded-lg bg-zinc-700/60 hover:bg-emerald-500/20 hover:text-emerald-300 text-zinc-400 transition-all flex items-center gap-1"
                        title="Trocar de time"
                      >
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
