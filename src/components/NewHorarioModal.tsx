import React, { useState } from 'react';
import { PeladaSession, Player, Team, TeamColor } from '../types';
import { AddTeamModal } from './AddTeamModal';
import { X, Calendar, MapPin, DollarSign, Plus, Trash2, Users, Shield, Check, Sparkles, Trophy } from 'lucide-react';
import { PRESET_TEAM_COLORS } from '../utils/teamColors';

interface NewHorarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlayers: Player[];
  onCreateSchedule: (
    sessionDetails: {
      title: string;
      location: string;
      date: string;
      courtFee: number;
      pixKey: string;
    },
    teams: Team[],
    newPlayers: Player[]
  ) => void;
}

export const NewHorarioModal: React.FC<NewHorarioModalProps> = ({
  isOpen,
  onClose,
  currentPlayers,
  onCreateSchedule,
}) => {
  const defaultDate = new Date().toISOString().split('T')[0];
  const [title, setTitle] = useState('Horário Fut - Arena Fives');
  const [location, setLocation] = useState('Arena Fives - Quadra 2 (Society)');
  const [date, setDate] = useState(defaultDate);
  const [courtFee, setCourtFee] = useState(180);
  const [pixKey, setPixKey] = useState('horariofut@pix.com.br');

  // Draft teams created for this new schedule
  const [draftTeams, setDraftTeams] = useState<Team[]>([]);
  // Extra players created during team configuration
  const [extraPlayers, setExtraPlayers] = useState<Player[]>([]);

  // Sub-modal for adding a team
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);

  if (!isOpen) return null;

  const allAvailablePlayersPool = [...currentPlayers, ...extraPlayers];

  const handleSaveDraftTeam = (
    teamName: string,
    teamColor: TeamColor,
    selectedPlayerIds: string[],
    newAthletesCreated: Partial<Player>[]
  ) => {
    // Process new athletes created in the modal
    const newlyCreatedPlayersList: Player[] = newAthletesCreated.map((ath, idx) => ({
      id: ath.id || `p-new-${Date.now()}-${idx}`,
      name: ath.name || 'Novo Atleta',
      nickname: ath.nickname,
      stars: ath.stars || 3,
      position: ath.position || 'Meia',
      isConfirmed: true,
      paymentStatus: 'pendente',
      stats: { goals: 0, assists: 0, matchesPlayed: 0, wins: 0, losses: 0, draws: 0 },
    }));

    if (newlyCreatedPlayersList.length > 0) {
      setExtraPlayers((prev) => [...prev, ...newlyCreatedPlayersList]);
    }

    const newTeam: Team = {
      id: `team-draft-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      name: teamName,
      color: teamColor,
      playerIds: selectedPlayerIds,
    };

    setDraftTeams((prev) => [...prev, newTeam]);
  };

  const handleRemoveDraftTeam = (teamId: string) => {
    setDraftTeams((prev) => prev.filter((t) => t.id !== teamId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateSchedule(
      {
        title: title.trim(),
        location: location.trim(),
        date,
        courtFee: Number(courtFee) || 0,
        pixKey: pixKey.trim(),
      },
      draftTeams,
      extraPlayers
    );

    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl relative text-white my-6 max-h-[92vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Novo Horário</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Horário Fut
                  </span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Crie uma nova sessão de jogo, configure local, taxa e adicione os times com atletas
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

          <form onSubmit={handleSubmit} className="space-y-6 pt-4 overflow-y-auto pr-1 flex-1">
            {/* Informações Básicas do Horário */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                1. Informações do Horário / Quadra
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Nome do Horário / Pelada <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Horário Fut - Quarta 20h"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Local / Quadra
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Ex: Arena Fives - Quadra 2"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Data do Jogo
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Valor Aluguel Quadra (R$)
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
                    <input
                      type="number"
                      value={courtFee}
                      onChange={(e) => setCourtFee(Number(e.target.value))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Chave Pix para Recebimento
                  </label>
                  <input
                    type="text"
                    placeholder="E-mail, CPF ou Telefone"
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Adicionar Novo Time e com Atletas */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    2. Times e Atletas do Horário ({draftTeams.length} times adicionados)
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Adicione times manualmente com seus respectivos atletas
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddTeamOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Novo Time</span>
                </button>
              </div>

              {draftTeams.length === 0 ? (
                <div className="text-center py-8 px-4 rounded-2xl bg-zinc-950/50 border border-dashed border-zinc-800">
                  <Trophy className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-zinc-300">Nenhum time criado ainda</p>
                  <p className="text-[11px] text-zinc-500 max-w-sm mx-auto mt-1 mb-3">
                    Você pode criar times fixos com atletas agora ou sortear os times automaticamente depois na aba "Times & Sorteio".
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAddTeamOpen(true)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar Primeiro Time com Atletas
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {draftTeams.map((team) => {
                    const teamPlayers = allAvailablePlayersPool.filter((p) =>
                      team.playerIds.includes(p.id)
                    );

                    return (
                      <div
                        key={team.id}
                        className={`p-3.5 rounded-2xl bg-zinc-950/80 border ${team.color.border} flex flex-col justify-between`}
                      >
                        <div>
                          <div className="flex items-center justify-between pb-2 border-b border-zinc-800 mb-2">
                            <div className="flex items-center space-x-2">
                              <span
                                className={`w-3.5 h-3.5 rounded-full ${team.color.badgeBg} border border-white/20`}
                              />
                              <span className="font-bold text-sm text-white">{team.name}</span>
                              <span className="text-[10px] text-zinc-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                                {teamPlayers.length} Atletas
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveDraftTeam(team.id)}
                              className="p-1 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800"
                              title="Remover Time"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="space-y-1">
                            {teamPlayers.length === 0 ? (
                              <p className="text-[11px] text-zinc-500 italic">Nenhum atleta selecionado</p>
                            ) : (
                              teamPlayers.map((p) => (
                                <div
                                  key={p.id}
                                  className="flex items-center justify-between text-xs text-zinc-300 py-0.5 px-1.5 rounded bg-zinc-900/60"
                                >
                                  <span>{p.nickname || p.name}</span>
                                  <span className="text-[10px] text-zinc-400">{p.position} • {p.stars}★</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-zinc-400">
                {draftTeams.length > 0
                  ? `Novo Horário pronto com ${draftTeams.length} time(s) e ${extraPlayers.length} novos atleta(s).`
                  : 'Ao criar, você poderá gerenciar partidas, placar e cobranças deste novo horário.'}
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 transition-all shadow-lg flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Criar e Iniciar Novo Horário
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Sub-Modal to add a team to this draft schedule */}
      {isAddTeamOpen && (
        <AddTeamModal
          isOpen={isAddTeamOpen}
          onClose={() => setIsAddTeamOpen(false)}
          availablePlayers={allAvailablePlayersPool}
          onSaveTeam={handleSaveDraftTeam}
        />
      )}
    </>
  );
};
