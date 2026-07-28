import React, { useState } from 'react';
import { PeladaSession } from '../types';
import { ShieldAlert, Trophy, Users, DollarSign, Calendar, MapPin, PlusCircle, Edit3, Check, Copy } from 'lucide-react';

interface HeaderProps {
  session: PeladaSession;
  onUpdateSession: (updated: Partial<PeladaSession>) => void;
  onNewSession: () => void;
}

export const Header: React.FC<HeaderProps> = ({ session, onUpdateSession, onNewSession }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(session.title);
  const [location, setLocation] = useState(session.location);
  const [date, setDate] = useState(session.date);
  const [copiedPix, setCopiedPix] = useState(false);

  const confirmedCount = session.players.filter((p) => p.isConfirmed).length;
  const paidCount = session.players.filter((p) => p.isConfirmed && p.paymentStatus === 'pago').length;

  const handleSave = () => {
    onUpdateSession({ title, location, date });
    setIsEditing(false);
  };

  const handleCopyPix = () => {
    if (session.pixKey) {
      navigator.clipboard.writeText(session.pixKey);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    }
  };

  return (
    <header className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-zinc-900 text-white shadow-xl border-b border-emerald-700/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top bar with logo and primary actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl shadow-inner">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  Horário Fut
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Copa Fácil Style
                  </span>
                </h1>
              </div>
              <p className="text-xs text-emerald-200/80">
                Sorteador de times, placar ao vivo, artilharia e Pix da quadra
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-300" />
              Editar Horário
            </button>
            <button
              onClick={onNewSession}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 transition-all shadow-md shadow-emerald-900/30 active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Novo Horário
            </button>
          </div>
        </div>

        {/* Info banner or Edit Form */}
        {isEditing ? (
          <div className="mt-4 p-4 rounded-2xl bg-zinc-900/90 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Nome do Grupo / Pelada</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Local / Quadra</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 block mb-1">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="sm:col-span-3 flex justify-end gap-2 mt-1">
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 hover:bg-emerald-400"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-emerald-700/30 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-100">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-emerald-200">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                {session.title} • {session.date}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-200/80">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {session.location}
              </span>
            </div>

            {/* Quick Stat Chips */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-600/30 text-emerald-200">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span><strong>{confirmedCount}</strong> Confirmados</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-600/30 text-emerald-200">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span><strong>{session.teams.length}</strong> Times</span>
              </div>
              {session.pixKey && (
                <button
                  onClick={handleCopyPix}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 transition-all cursor-pointer"
                  title="Copiar chave PIX"
                >
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pix: {paidCount}/{confirmedCount} pagos</span>
                  {copiedPix ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
