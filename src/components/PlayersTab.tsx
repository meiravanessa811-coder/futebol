import React, { useState } from 'react';
import { Player, Position } from '../types';
import { PlayerFormModal } from './PlayerFormModal';
import { Search, UserPlus, Star, CheckCircle, XCircle, Edit, Trash2, Filter, Users, Shield, DollarSign } from 'lucide-react';

interface PlayersTabProps {
  players: Player[];
  onSavePlayer: (playerData: Partial<Player>) => void;
  onDeletePlayer: (playerId: string) => void;
  onTogglePresence: (playerId: string) => void;
  onBulkConfirm: (confirmAll: boolean) => void;
}

export const PlayersTab: React.FC<PlayersTabProps> = ({
  players,
  onSavePlayer,
  onDeletePlayer,
  onTogglePresence,
  onBulkConfirm,
}) => {
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [presenceFilter, setPresenceFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);

  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.nickname && p.nickname.toLowerCase().includes(search.toLowerCase()));

    const matchesPosition = positionFilter === 'all' || p.position === positionFilter;

    const matchesPresence =
      presenceFilter === 'all'
        ? true
        : presenceFilter === 'confirmed'
        ? p.isConfirmed
        : !p.isConfirmed;

    return matchesSearch && matchesPosition && matchesPresence;
  });

  const confirmedCount = players.filter((p) => p.isConfirmed).length;

  const handleEdit = (player: Player) => {
    setPlayerToEdit(player);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setPlayerToEdit(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Roster Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            Gestão do Elenco da Pelada
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Cadastre atletas, ajuste estrelas e confirme quem vai jogar hoje
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onBulkConfirm(true)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all"
          >
            ✅ Confirmar Todos
          </button>
          <button
            onClick={() => onBulkConfirm(false)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
          >
            ❌ Desmarcar Todos
          </button>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-950/40 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Adicionar Jogador
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por nome ou apelido..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Position Filter */}
        <div className="sm:col-span-3">
          <select
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todas as Posições</option>
            <option value="Goleiro">🧤 Goleiros</option>
            <option value="Zagueiro">🛡️ Zagueiros</option>
            <option value="Lateral">⚡ Laterais</option>
            <option value="Meia">🎯 Meias</option>
            <option value="Atacante">⚽ Atacantes</option>
          </select>
        </div>

        {/* Presence Filter */}
        <div className="sm:col-span-4 flex items-center justify-between">
          <select
            value={presenceFilter}
            onChange={(e) => setPresenceFilter(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">Todas as Presenças ({players.length})</option>
            <option value="confirmed">Apenas Confirmados ({confirmedCount})</option>
            <option value="absent">Apenas Ausentes ({players.length - confirmedCount})</option>
          </select>
        </div>
      </div>

      {/* Players List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-zinc-500 text-xs italic">
            Nenhum jogador encontrado para os filtros selecionados.
          </div>
        ) : (
          filteredPlayers.map((player) => {
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
                className={`p-4 rounded-2xl border transition-all ${
                  player.isConfirmed
                    ? 'bg-zinc-900 border-zinc-800 hover:border-emerald-500/50'
                    : 'bg-zinc-900/40 border-zinc-800/60 opacity-60 hover:opacity-100'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-white text-sm truncate">
                        {player.nickname || player.name}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${posBadgeColor}`}>
                        {player.position}
                      </span>
                    </div>

                    {player.nickname && (
                      <span className="text-[11px] text-zinc-400 block truncate">
                        {player.name}
                      </span>
                    )}

                    {/* Stars */}
                    <div className="flex items-center text-amber-400 mt-1.5">
                      {Array.from({ length: player.stars }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                      <span className="text-[10px] text-zinc-400 ml-1.5 font-medium">
                        ({player.stars} est.)
                      </span>
                    </div>
                  </div>

                  {/* Presence Toggle Button */}
                  <button
                    onClick={() => onTogglePresence(player.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      player.isConfirmed
                        ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-950/40'
                        : 'bg-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {player.isConfirmed ? 'CONFIRMADO' : 'AUSENTE'}
                  </button>
                </div>

                {/* Footer stats & actions */}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center space-x-3">
                    <span>⚽ {player.stats.goals} Gols</span>
                    <span>👟 {player.stats.assists} Ass.</span>
                    <span>🏃 {player.stats.matchesPlayed} Jogos</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleEdit(player)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-emerald-300 hover:bg-zinc-800 transition-colors"
                      title="Editar Jogador"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeletePlayer(player.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
                      title="Excluir Jogador"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      <PlayerFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSavePlayer={onSavePlayer}
        playerToEdit={playerToEdit}
      />
    </div>
  );
};
