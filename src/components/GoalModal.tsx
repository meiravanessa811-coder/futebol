import React, { useState } from 'react';
import { Player, Team } from '../types';
import { X, Trophy, UserCheck } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  allPlayers: Player[];
  onConfirmGoal: (scorerId: string, assistId?: string) => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  team,
  allPlayers,
  onConfirmGoal,
}) => {
  const [scorerId, setScorerId] = useState<string>('');
  const [assistId, setAssistId] = useState<string>('');

  if (!isOpen) return null;

  const teamPlayers = allPlayers.filter((p) => team.playerIds.includes(p.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scorerId) return;
    onConfirmGoal(scorerId, assistId || undefined);
    setScorerId('');
    setAssistId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-emerald-500/30 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            ⚽
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Registrar Gol</h3>
            <p className="text-xs text-zinc-400">
              Para o <strong className="text-white">{team.name}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Autor do Gol */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Autor do Gol <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={scorerId}
              onChange={(e) => setScorerId(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Selecione quem fez o gol...</option>
              {teamPlayers.map((p) => (
                <option key={p.id} value={p.id}>
                  ⚽ {p.nickname || p.name} ({p.position})
                </option>
              ))}
            </select>
          </div>

          {/* Assistência */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Assistência (Garçom / Passe)
            </label>
            <select
              value={assistId}
              onChange={(e) => setAssistId(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="">Sem assistência (Sem passe / Gol individual)</option>
              {teamPlayers
                .filter((p) => p.id !== scorerId)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    👟 {p.nickname || p.name} ({p.position})
                  </option>
                ))}
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!scorerId}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all shadow-lg shadow-emerald-950/50 disabled:opacity-50"
            >
              Confirmar Gol ⚽
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
