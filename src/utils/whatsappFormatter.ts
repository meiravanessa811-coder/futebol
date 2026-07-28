import { PeladaSession, Player, Team } from '../types';

export function formatTeamsForWhatsApp(session: PeladaSession): string {
  let text = `⚽ *${session.title.toUpperCase()}* ⚽\n`;
  text += `📅 Data: ${session.date}\n`;
  text += `📍 Local: ${session.location}\n\n`;

  if (!session.teams || session.teams.length === 0) {
    return text + 'Nenhum time sorteado ainda.';
  }

  session.teams.forEach((team, idx) => {
    const teamPlayers = session.players.filter((p) => team.playerIds.includes(p.id));
    const totalStars = teamPlayers.reduce((acc, p) => acc + p.stars, 0);

    text += `🎽 *${team.name.toUpperCase()}* (Média: ⭐ ${(totalStars / (teamPlayers.length || 1)).toFixed(1)})\n`;

    teamPlayers.forEach((p, pIdx) => {
      const posEmoji =
        p.position === 'Goleiro'
          ? '🧤'
          : p.position === 'Zagueiro' || p.position === 'Lateral'
          ? '🛡️'
          : p.position === 'Meia'
          ? '🎯'
          : '⚡';

      text += `${pIdx + 1}. ${posEmoji} ${p.nickname || p.name} (${p.position}) ${'⭐'.repeat(p.stars)}\n`;
    });
    text += '\n';
  });

  text += `🔥 Organizado via *Pelada Fácil*`;
  return text;
}

export function formatFinancialForWhatsApp(session: PeladaSession): string {
  const confirmedPlayers = session.players.filter((p) => p.isConfirmed);
  const costPerPlayer = confirmedPlayers.length > 0 ? (session.courtFee / confirmedPlayers.length).toFixed(2) : '0';

  let text = `💰 *FINANCEIRO DA PELADA* 💰\n`;
  text += `📍 ${session.title}\n`;
  text += `🏟️ Aluguel da Quadra: R$ ${session.courtFee.toFixed(2)}\n`;
  text += `👥 Jogadores confirmados: ${confirmedPlayers.length}\n`;
  text += `💵 Valor por pessoa: *R$ ${costPerPlayer}*\n`;

  if (session.pixKey) {
    text += `🔑 Chave PIX: \`${session.pixKey}\`\n`;
  }
  text += `\n*STATUS DOS PAGAMENTOS:*\n`;

  session.players.forEach((p) => {
    if (!p.isConfirmed) return;
    const statusIcon = p.paymentStatus === 'pago' ? '✅' : p.paymentStatus === 'isento' ? '🎟️' : '❌';
    const statusLabel = p.paymentStatus === 'pago' ? 'PAGO' : p.paymentStatus === 'isento' ? 'ISENTO' : 'PENDENTE';
    text += `${statusIcon} ${p.nickname || p.name}: ${statusLabel}\n`;
  });

  text += `\nFavor enviar o comprovante no grupo! ⚽`;
  return text;
}

export function formatArtilhariaForWhatsApp(players: Player[]): string {
  const sortedScorers = [...players]
    .filter((p) => p.stats.goals > 0)
    .sort((a, b) => b.stats.goals - a.stats.goals);

  let text = `🏆 *ARTILHARIA DA PELADA* ⚽\n\n`;

  if (sortedScorers.length === 0) {
    return text + 'Nenhum gol registrado ainda.';
  }

  sortedScorers.slice(0, 10).forEach((p, idx) => {
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`;
    text += `${medal} *${p.nickname || p.name}*: ${p.stats.goals} gols (${p.stats.assists} assistências)\n`;
  });

  return text;
}
