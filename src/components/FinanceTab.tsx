import React, { useState } from 'react';
import { PaymentStatus, PeladaSession, Player } from '../types';
import { formatFinancialForWhatsApp } from '../utils/whatsappFormatter';
import { DollarSign, CheckCircle2, Clock, Copy, Check, Share2, Calculator, QrCode, AlertCircle } from 'lucide-react';

interface FinanceTabProps {
  session: PeladaSession;
  onUpdateSession: (updated: Partial<PeladaSession>) => void;
  onUpdatePlayerPayment: (playerId: string, status: PaymentStatus) => void;
}

export const FinanceTab: React.FC<FinanceTabProps> = ({
  session,
  onUpdateSession,
  onUpdatePlayerPayment,
}) => {
  const [courtFee, setCourtFee] = useState<number>(session.courtFee || 180);
  const [pixKey, setPixKey] = useState<string>(session.pixKey || '');
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedZap, setCopiedZap] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pago' | 'pendente'>('all');

  const confirmedPlayers = session.players.filter((p) => p.isConfirmed);
  const totalConfirmed = confirmedPlayers.length;
  const costPerPlayer = totalConfirmed > 0 ? courtFee / totalConfirmed : 0;

  const paidPlayers = confirmedPlayers.filter((p) => p.paymentStatus === 'pago');
  const exemptPlayers = confirmedPlayers.filter((p) => p.paymentStatus === 'isento');
  const pendingPlayers = confirmedPlayers.filter((p) => p.paymentStatus === 'pendente');

  const totalCollected = paidPlayers.length * costPerPlayer;
  const totalPending = pendingPlayers.length * costPerPlayer;
  const progressPercent = totalConfirmed > 0 ? Math.min(100, Math.round(((paidPlayers.length + exemptPlayers.length) / totalConfirmed) * 100)) : 0;

  const handleSaveConfig = () => {
    onUpdateSession({ courtFee, pixKey });
  };

  const handleCopyPix = () => {
    if (pixKey) {
      navigator.clipboard.writeText(pixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    }
  };

  const handleShareWhatsApp = () => {
    const text = formatFinancialForWhatsApp(session);
    navigator.clipboard.writeText(text);
    setCopiedZap(true);
    setTimeout(() => setCopiedZap(false), 2500);
  };

  const filteredList = confirmedPlayers.filter((p) => {
    if (filter === 'pago') return p.paymentStatus === 'pago';
    if (filter === 'pendente') return p.paymentStatus === 'pendente';
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-400" />
            Caixinha & Pix da Pelada
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Calcule a divisão da quadra, controle pagamentos e envie cobrança no WhatsApp
          </p>
        </div>

        <button
          onClick={handleShareWhatsApp}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 flex items-center gap-1.5 transition-all shadow-lg cursor-pointer self-start sm:self-auto"
        >
          {copiedZap ? <Check className="w-4 h-4 text-zinc-950" /> : <Share2 className="w-4 h-4" />}
          {copiedZap ? 'Cobrança Copiada!' : 'Enviar Cobrança no Zap'}
        </button>
      </div>

      {/* Calculator & Pix Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quadra & Divisão Calculator */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            Valor da Quadra e Divisão por Pessoa
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Aluguel da Quadra (R$)</label>
              <input
                type="number"
                value={courtFee}
                onChange={(e) => setCourtFee(Number(e.target.value))}
                onBlur={handleSaveConfig}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs text-zinc-400 block mb-1">Confirmados no Jogo</label>
              <div className="w-full bg-zinc-800/60 border border-zinc-700/60 rounded-xl px-3.5 py-2 text-sm text-zinc-300 font-bold">
                {totalConfirmed} Atletas
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-zinc-900 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-300 block">VALOR POR PESSOA</span>
              <span className="text-2xl font-black text-white font-mono">
                R$ {costPerPlayer.toFixed(2)}
              </span>
            </div>
            <div className="text-right text-[11px] text-zinc-400">
              {totalConfirmed > 0 ? (
                <span>R$ {courtFee} ÷ {totalConfirmed} pessoas</span>
              ) : (
                <span className="text-amber-400">Confirme jogadores no elenco</span>
              )}
            </div>
          </div>
        </div>

        {/* Chave Pix e Copiar */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <QrCode className="w-4 h-4 text-amber-400" />
            Chave Pix para Recebimento
          </h3>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">Chave Pix (E-mail, CPF, Celular ou Aleatória)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: pelada@pix.com.br"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                onBlur={handleSaveConfig}
                className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleCopyPix}
                disabled={!pixKey}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                {copiedPix ? <Check className="w-4 h-4 text-zinc-950" /> : <Copy className="w-4 h-4" />}
                {copiedPix ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-800/50 border border-zinc-700/50 text-xs text-zinc-400">
            💡 Os jogadores poderão copiar esta chave Pix diretamente quando você compartilhar o status da pelada no grupo do WhatsApp.
          </div>
        </div>
      </div>

      {/* Progress & Summary Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="font-bold text-white">
            Progresso dos Pagamentos ({paidPlayers.length + exemptPlayers.length}/{totalConfirmed} pagos/isentos)
          </span>
          <span className="font-mono text-emerald-400 font-bold">{progressPercent}% Concluído</span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden p-0.5 border border-zinc-700">
          <div
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-[11px] text-emerald-300 block">Arrecadado</span>
            <span className="font-black text-white text-base font-mono">
              R$ {totalCollected.toFixed(2)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-[11px] text-amber-300 block">Faltando</span>
            <span className="font-black text-white text-base font-mono">
              R$ {totalPending.toFixed(2)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-800/80 border border-zinc-700">
            <span className="text-[11px] text-zinc-400 block">Pura Isenção</span>
            <span className="font-bold text-white text-base font-mono">
              {exemptPlayers.length} atletas
            </span>
          </div>
        </div>
      </div>

      {/* Individual Players Payment Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-bold text-white">Status de Pagamento por Atleta</h3>

          <div className="flex items-center space-x-1 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filter === 'all' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Todos ({totalConfirmed})
            </button>
            <button
              onClick={() => setFilter('pago')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filter === 'pago' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Pagos ({paidPlayers.length})
            </button>
            <button
              onClick={() => setFilter('pendente')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filter === 'pendente' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Pendentes ({pendingPlayers.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredList.length === 0 ? (
            <div className="col-span-full text-center py-8 text-xs text-zinc-500 italic">
              Nenhum jogador nesta categoria.
            </div>
          ) : (
            filteredList.map((player) => {
              return (
                <div
                  key={player.id}
                  className="p-3.5 rounded-2xl bg-zinc-800/60 border border-zinc-800 flex items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">
                      {player.nickname || player.name}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Cota: R$ {costPerPlayer.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onUpdatePlayerPayment(player.id, 'pago')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                        player.paymentStatus === 'pago'
                          ? 'bg-emerald-500 text-zinc-950 shadow'
                          : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      PAGO
                    </button>
                    <button
                      onClick={() => onUpdatePlayerPayment(player.id, 'pendente')}
                      className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                        player.paymentStatus === 'pendente'
                          ? 'bg-amber-500 text-zinc-950 shadow'
                          : 'bg-zinc-900 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      PENDENTE
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
