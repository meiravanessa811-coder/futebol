import React, { useState } from 'react';
import { Player, Position, Team, TeamColor } from '../types';
import { PRESET_TEAM_COLORS } from '../utils/teamColors';
import { X, Shield, Plus, Check, UserPlus, Star } from 'lucide-react';

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  availablePlayers: Player[];
  onSaveTeam: (
    teamName: string,
    teamColor: TeamColor,
    selectedPlayerIds: string[],
    newAthletesCreated: Partial<Player>[]
  ) => void;
  initialTeam?: Team | null;
}

export const AddTeamModal: React.FC<AddTeamModalProps> = ({
  isOpen,
  onClose,
  availablePlayers,
  onSaveTeam,
  initialTeam,
}) => {
  const [teamName, setTeamName] = useState(initialTeam?.name || '');
  const [selectedColor, setSelectedColor] = useState<TeamColor>(
    initialTeam?.color || PRESET_TEAM_COLORS[0]
  );
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>(
    initialTeam?.playerIds || []
  );

  // Quick inline creation of new athletes for this team
  const [newAthletes, setNewAthletes] = useState<Partial<Player>[]>([]);
  const [newAthleteName, setNewAthleteName] = useState('');
  const [newAthletePos, setNewAthletePos] = useState<Position>('Meia');
  const [newAthleteStars, setNewAthleteStars] = useState<number>(3);

  if (!isOpen) return null;

  const handleTogglePlayer = (playerId: string) => {
    setSelectedPlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  const handleAddInlineAthlete = () => {
    if (!newAthleteName.trim()) return;
    const tempId = `new-athlete-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newAthlete: Partial<Player> = {
      id: tempId,
      name: newAthleteName.trim(),
      position: newAthletePos,
      stars: newAthleteStars,
      isConfirmed: true,
      paymentStatus: 'pendente',
      stats: { goals: 0, assists: 0, matchesPlayed: 0, wins: 0, losses: 0, draws: 0 },
    };
    setNewAthletes((prev) => [...prev, newAthlete]);
    setSelectedPlayerIds((prev) => [...prev, tempId]);
    setNewAthleteName('');
  };

  const handleRemoveInlineAthlete = (id?: string) => {
    if (!id) return;
    setNewAthletes((prev) => prev.filter((a) => a.id !== id));
    setSelectedPlayerIds((prev) => prev.filter((pId) => pId !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = teamName.trim() || selectedColor.name;
    onSaveTeam(finalName, selectedColor, selectedPlayerIds, newAthletes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl relative text-white my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-2xl ${selectedColor.badgeBg} flex items-center justify-center text-white shadow-md border ${selectedColor.border}`}
            >
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {initialTeam ? 'Editar Time' : 'Adicionar Novo Time'}
              </h3>
              <p className="text-xs text-zinc-400">
                Defina o nome do time, a cor do colete e os atletas integrantes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4 overflow-y-auto pr-1 flex-1">
          {/* Nome e Cor do Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Nome do Time <span className="text-emerald-400">*</span>
              </label>
              <input
                type="text"
                placeholder={`Ex: ${selectedColor.name}`}
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Cor do Colete
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_TEAM_COLORS.map((color) => {
                  const isSelected = selectedColor.name === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(color);
                        if (!teamName || PRESET_TEAM_COLORS.some((c) => c.name === teamName)) {
                          setTeamName(color.name);
                        }
                      }}
                      className={`w-7 h-7 rounded-full ${color.badgeBg} border-2 flex items-center justify-center transition-all ${
                        isSelected ? 'border-white scale-110 ring-2 ring-emerald-400' : 'border-transparent opacity-80 hover:opacity-100'
                      }`}
                      title={color.name}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Add New Athlete */}
          <div className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-700/60 space-y-2">
            <label className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              Cadastrar Novo Atleta Direto Neste Time
            </label>
            <div className="flex flex-wrap sm:flex-nowrap gap-2">
              <input
                type="text"
                placeholder="Nome do atleta (ex: Zico)"
                value={newAthleteName}
                onChange={(e) => setNewAthleteName(e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 min-w-[140px]"
              />
              <select
                value={newAthletePos}
                onChange={(e) => setNewAthletePos(e.target.value as Position)}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Goleiro">🧤 Gol</option>
                <option value="Zagueiro">🛡️ Zai</option>
                <option value="Lateral">⚡ Lat</option>
                <option value="Meia">🎯 Mei</option>
                <option value="Atacante">⚽ Ata</option>
              </select>
              <select
                value={newAthleteStars}
                onChange={(e) => setNewAthleteStars(Number(e.target.value))}
                className="bg-zinc-900 border border-zinc-700 rounded-xl px-2 py-1.5 text-xs text-amber-400 focus:outline-none"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                <option value={4}>⭐⭐⭐⭐ (4)</option>
                <option value={3}>⭐⭐⭐ (3)</option>
                <option value={2}>⭐⭐ (2)</option>
                <option value={1}>⭐ (1)</option>
              </select>
              <button
                type="button"
                onClick={handleAddInlineAthlete}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {newAthletes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-zinc-700/50">
                {newAthletes.map((ath) => (
                  <span
                    key={ath.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium"
                  >
                    <span>{ath.name} ({ath.position})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInlineAthlete(ath.id)}
                      className="text-zinc-400 hover:text-red-400 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Select Existing Athletes from Elenco */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-zinc-300">
                Selecionar Atletas do Elenco ({selectedPlayerIds.length} selecionados)
              </label>
              <span className="text-[11px] text-zinc-400">
                Marque os jogadores que jogarão neste time
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto p-1 bg-zinc-950/60 rounded-2xl border border-zinc-800">
              {availablePlayers.length === 0 && newAthletes.length === 0 ? (
                <div className="col-span-2 text-center py-6 text-xs text-zinc-500 italic">
                  Nenhum atleta cadastrado. Use o campo acima para adicionar atletas diretamente!
                </div>
              ) : (
                availablePlayers.map((player) => {
                  const isChecked = selectedPlayerIds.includes(player.id);
                  return (
                    <label
                      key={player.id}
                      onClick={() => handleTogglePlayer(player.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all text-xs ${
                        isChecked
                          ? 'bg-emerald-950/70 border-emerald-500/60 text-white'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                      }`}
                    >
                      <div className="flex items-center space-x-2 min-w-0">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-emerald-500 border-emerald-400 text-zinc-950'
                              : 'border-zinc-700 bg-zinc-800'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold block truncate">
                            {player.nickname || player.name}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {player.position} • {player.stars}★
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-400 text-[10px]">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="ml-0.5">{player.stars}</span>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all shadow-lg flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Salvar Time
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
