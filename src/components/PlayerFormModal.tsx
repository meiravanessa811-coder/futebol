import React, { useState, useEffect } from 'react';
import { PaymentStatus, Player, Position } from '../types';
import { X, Star, UserPlus } from 'lucide-react';

interface PlayerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePlayer: (playerData: Partial<Player>) => void;
  playerToEdit?: Player | null;
}

export const PlayerFormModal: React.FC<PlayerFormModalProps> = ({
  isOpen,
  onClose,
  onSavePlayer,
  playerToEdit,
}) => {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [stars, setStars] = useState<number>(3);
  const [position, setPosition] = useState<Position>('Meia');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pendente');
  const [isConfirmed, setIsConfirmed] = useState(true);

  useEffect(() => {
    if (playerToEdit) {
      setName(playerToEdit.name);
      setNickname(playerToEdit.nickname || '');
      setStars(playerToEdit.stars);
      setPosition(playerToEdit.position);
      setPaymentStatus(playerToEdit.paymentStatus);
      setIsConfirmed(playerToEdit.isConfirmed);
    } else {
      setName('');
      setNickname('');
      setStars(3);
      setPosition('Meia');
      setPaymentStatus('pendente');
      setIsConfirmed(true);
    }
  }, [playerToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSavePlayer({
      id: playerToEdit ? playerToEdit.id : undefined,
      name: name.trim(),
      nickname: nickname.trim() || undefined,
      stars,
      position,
      paymentStatus,
      isConfirmed,
      stats: playerToEdit
        ? playerToEdit.stats
        : { goals: 0, assists: 0, matchesPlayed: 0, wins: 0, losses: 0, draws: 0 },
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">
              {playerToEdit ? 'Editar Jogador' : 'Novo Jogador no Elenco'}
            </h3>
            <p className="text-xs text-zinc-400">
              Cadastre nome, posição e nível de habilidade
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Nome Completo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Carlos Eduardo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Apelido na Pelada
            </label>
            <input
              type="text"
              placeholder="Ex: Cadu Canhota"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Posição Principal
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Goleiro">🧤 Goleiro</option>
                <option value="Zagueiro">🛡️ Zagueiro</option>
                <option value="Lateral">⚡ Lateral</option>
                <option value="Meia">🎯 Meia</option>
                <option value="Atacante">⚽ Atacante</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Status Pagamento
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="pago">✅ Pago</option>
                <option value="pendente">⏳ Pendente</option>
                <option value="isento">🎟️ Isento</option>
              </select>
            </div>
          </div>

          {/* Stars Picker */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Nível / Estrelas (1 a 5)
            </label>
            <div className="flex items-center space-x-2 bg-zinc-800/80 p-2.5 rounded-xl border border-zinc-700 justify-between">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((starNum) => (
                  <button
                    key={starNum}
                    type="button"
                    onClick={() => setStars(starNum)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        starNum <= stars
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-zinc-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-zinc-900">
                {stars} {stars === 1 ? 'Estrela' : 'Estrelas'}
              </span>
            </div>
          </div>

          {/* Presença para hoje */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-800/50 border border-zinc-700/60">
            <div>
              <span className="text-xs font-semibold block">Confirmado para Hoje?</span>
              <span className="text-[11px] text-zinc-400">
                Determina se o jogador entra no sorteio de times
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsConfirmed(!isConfirmed)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isConfirmed
                  ? 'bg-emerald-500 text-zinc-950'
                  : 'bg-zinc-700 text-zinc-400'
              }`}
            >
              {isConfirmed ? 'CONFIRMADO ✅' : 'AUSENTE ❌'}
            </button>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all shadow-lg"
            >
              {playerToEdit ? 'Salvar Alterações' : 'Adicionar Jogador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
