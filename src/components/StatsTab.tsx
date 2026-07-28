import React, { useState } from 'react';
import { Match, PeladaSession, Player } from '../types';
import { formatArtilhariaForWhatsApp } from '../utils/whatsappFormatter';
import { Trophy, Flame, Award, Medal, Share2, Check, Footprints, History } from 'lucide-react';

interface StatsTabProps {
  session: PeladaSession;
}

export const StatsTab: React.FC<StatsTabProps> = ({ session }) => {
  const [copied, setCopied] = useState(false);

  const players = session.players;

  // Top Scorers
  const topScorers = [...players]
    .filter((p) => p.stats.goals > 0)
    .sort((a, b) => b.stats.goals - a.stats.goals);

  // Top Assists
  const topAssists = [...players]
    .filter((p) => p.stats.assists > 0)
    .sort((a, b) => b.stats.assists - a.stats.assists);

  // Top Win Rate
  const topWinners = [...players]
    .filter((p) => p.stats.matchesPlayed > 0)
    .sort((a, b) => {
      const winRateA = a.stats.wins / a.stats.matchesPlayed;
      const winRateB = b.stats.wins / b.stats.matchesPlayed;
      return winRateB - winRateA;
    });

  const handleCopyArtilharia = () => {
    const text = formatArtilhariaForWhatsApp(session.players);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const top1 = topScorers[0];
  const top2 = topScorers[1];
  const top3 = topScorers[2];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            Estatísticas & Ranking
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Artilharia de gols, ranking de assistências e histórico de jogos da pelada
          </p>
        </div>

        <button
          onClick={handleCopyArtilharia}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copiado para Zap!' : 'Copiar Artilharia para Zap'}
        </button>
      </div>

      {/* Podium for Top 3 Scorers */}
      {topScorers.length > 0 && (
        <div className="bg-gradient-to-b from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-3xl p-6 shadow-xl">
          <h3 className="text-center font-bold text-amber-400 text-sm uppercase tracking-wider mb-6 flex items-center justify-center gap-2">
            <Award className="w-5 h-5" />
            PÓDIO DOS ARTILHEROS
          </h3>

          <div className="flex justify-center items-end gap-3 sm:gap-6 max-w-xl mx-auto">
            {/* 2nd Place */}
            {top2 ? (
              <div className="flex flex-col items-center flex-1">
                <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-400 flex items-center justify-center font-extrabold text-zinc-300 mb-2 shadow-lg">
                  🥈
                </div>
                <span className="font-bold text-white text-xs text-center truncate max-w-[90px]">
                  {top2.nickname || top2.name}
                </span>
                <span className="text-[11px] text-amber-300 font-extrabold mt-0.5">
                  {top2.stats.goals} Gols
                </span>
                <div className="w-full h-24 bg-gradient-to-t from-zinc-800 to-zinc-700 rounded-t-2xl mt-2 flex items-center justify-center font-extrabold text-zinc-300 border border-zinc-600">
                  2º
                </div>
              </div>
            ) : (
              <div className="flex-1"></div>
            )}

            {/* 1st Place */}
            {top1 ? (
              <div className="flex flex-col items-center flex-1 -mt-4">
                <div className="w-16 h-16 rounded-full bg-amber-500 border-4 border-amber-300 flex items-center justify-center font-extrabold text-zinc-950 text-2xl mb-2 shadow-2xl animate-bounce">
                  🥇
                </div>
                <span className="font-extrabold text-white text-sm text-center truncate max-w-[110px]">
                  {top1.nickname || top1.name}
                </span>
                <span className="text-xs text-amber-300 font-black mt-0.5">
                  ⚽ {top1.stats.goals} Gols
                </span>
                <div className="w-full h-32 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-2xl mt-2 flex items-center justify-center font-black text-zinc-950 text-xl border border-amber-400 shadow-xl">
                  1º
                </div>
              </div>
            ) : null}

            {/* 3rd Place */}
            {top3 ? (
              <div className="flex flex-col items-center flex-1">
                <div className="w-12 h-12 rounded-full bg-amber-800/80 border-2 border-amber-700 flex items-center justify-center font-extrabold text-amber-200 mb-2 shadow-lg">
                  🥉
                </div>
                <span className="font-bold text-white text-xs text-center truncate max-w-[90px]">
                  {top3.nickname || top3.name}
                </span>
                <span className="text-[11px] text-amber-300 font-extrabold mt-0.5">
                  {top3.stats.goals} Gols
                </span>
                <div className="w-full h-20 bg-gradient-to-t from-zinc-800 to-amber-950 rounded-t-2xl mt-2 flex items-center justify-center font-extrabold text-amber-500 border border-amber-800">
                  3º
                </div>
              </div>
            ) : (
              <div className="flex-1"></div>
            )}
          </div>
        </div>
      )}

      {/* Tables Grid: Artilheiros & Garçons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tabela de Artilharia */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span>⚽ Ranking de Artilheiros</span>
          </h3>

          {topScorers.length === 0 ? (
            <p className="text-xs text-zinc-500 italic text-center py-6">
              Nenhum gol marcado até o momento.
            </p>
          ) : (
            <div className="space-y-2">
              {topScorers.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-800/60 border border-zinc-800 text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 font-mono font-bold text-zinc-400 text-center">
                      {idx + 1}º
                    </span>
                    <div>
                      <span className="font-bold text-white block">
                        {p.nickname || p.name}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {p.position} • {p.stats.matchesPlayed} partidas
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-amber-400 text-sm block">
                      {p.stats.goals} Gols
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      Média: {(p.stats.goals / (p.stats.matchesPlayed || 1)).toFixed(1)}/jogo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tabela de Assistências (Garçons) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <span>👟 Garçons (Assistências)</span>
          </h3>

          {topAssists.length === 0 ? (
            <p className="text-xs text-zinc-500 italic text-center py-6">
              Nenhuma assistência registrada.
            </p>
          ) : (
            <div className="space-y-2">
              {topAssists.map((p, idx) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-zinc-800/60 border border-zinc-800 text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-6 font-mono font-bold text-zinc-400 text-center">
                      {idx + 1}º
                    </span>
                    <div>
                      <span className="font-bold text-white block">
                        {p.nickname || p.name}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {p.position}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-emerald-400 text-sm block">
                      {p.stats.assists} Passes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Histórico de Jogos */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-400" />
          <span>Histórico de Partidas Disputadas</span>
        </h3>

        {session.matches.length === 0 ? (
          <p className="text-xs text-zinc-500 italic py-6 text-center">
            Nenhuma partida gravada no histórico.
          </p>
        ) : (
          <div className="space-y-3">
            {session.matches.map((match) => {
              const teamA = session.teams.find((t) => t.id === match.teamAId);
              const teamB = session.teams.find((t) => t.id === match.teamBId);

              return (
                <div
                  key={match.id}
                  className="p-4 rounded-2xl bg-zinc-800/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-1 rounded-xl bg-zinc-900 text-zinc-400 font-mono font-bold">
                      Jogo #{match.matchNumber}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                      match.status === 'finished' ? 'bg-zinc-800 text-zinc-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {match.status === 'finished' ? 'Encerrado' : 'Em Andamento'}
                    </span>
                  </div>

                  {/* Scoreboard display */}
                  <div className="flex items-center space-x-4 font-bold text-sm">
                    <span className="text-white">{teamA?.name || 'Time A'}</span>
                    <span className="px-3 py-1 bg-zinc-950 rounded-xl font-mono text-emerald-400 text-base">
                      {match.scoreA} x {match.scoreB}
                    </span>
                    <span className="text-white">{teamB?.name || 'Time B'}</span>
                  </div>

                  <div className="text-zinc-400 text-[11px]">
                    {match.goals.length} gols registrados
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
