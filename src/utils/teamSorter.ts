import { DrawConfig, Player, Team } from '../types';
import { PRESET_TEAM_COLORS } from './teamColors';

export function sortTeams(players: Player[], config: DrawConfig): Team[] {
  const confirmedPlayers = players.filter((p) => p.isConfirmed);

  if (confirmedPlayers.length === 0) {
    return [];
  }

  // Calculate number of teams
  const targetNumTeams = Math.max(
    2,
    config.numTeams || Math.ceil(confirmedPlayers.length / config.playersPerTeam)
  );

  // Initialize team buckets
  const teamBuckets: Player[][] = Array.from({ length: targetNumTeams }, () => []);

  let availablePlayers = [...confirmedPlayers];

  // 1. Separate dedicated goalkeepers if requested
  if (config.goalkeepersMode === 'dedicated') {
    const goalkeepers = availablePlayers.filter((p) => p.position === 'Goleiro');
    availablePlayers = availablePlayers.filter((p) => p.position !== 'Goleiro');

    // Sort goalkeepers by stars descending
    goalkeepers.sort((a, b) => b.stars - a.stars);

    // Distribute goalkeepers 1 per team
    goalkeepers.forEach((gk, idx) => {
      const teamIdx = idx % targetNumTeams;
      teamBuckets[teamIdx].push(gk);
    });
  }

  // Helper function to calculate total stars in a bucket
  const getBucketStars = (bucket: Player[]) =>
    bucket.reduce((sum, p) => sum + p.stars, 0);

  // Helper function to find the best team for a player
  const getTeamWithLowestStarsAndSpace = (buckets: Player[][], maxCap: number) => {
    let minStars = Infinity;
    let chosenIdx = 0;

    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i].length < maxCap) {
        const stars = getBucketStars(buckets[i]);
        if (stars < minStars) {
          minStars = stars;
          chosenIdx = i;
        }
      }
    }
    return chosenIdx;
  };

  const maxCap = Math.ceil(confirmedPlayers.length / targetNumTeams);

  // 2. Distribute remaining players according to balance mode
  if (config.balanceMode === 'random') {
    // Fisher-Yates shuffle
    for (let i = availablePlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availablePlayers[i], availablePlayers[j]] = [availablePlayers[j], availablePlayers[i]];
    }

    availablePlayers.forEach((p) => {
      // Find first team under capacity
      let idx = teamBuckets.findIndex((b) => b.length < maxCap);
      if (idx === -1) idx = 0;
      teamBuckets[idx].push(p);
    });
  } else if (config.balanceMode === 'positions') {
    // Group by position
    const positionGroups: Record<string, Player[]> = {
      Zagueiro: [],
      Lateral: [],
      Meia: [],
      Atacante: [],
      Goleiro: [],
    };

    availablePlayers.forEach((p) => {
      if (!positionGroups[p.position]) positionGroups[p.position] = [];
      positionGroups[p.position].push(p);
    });

    // Sort each position group by skill descending
    Object.keys(positionGroups).forEach((pos) => {
      positionGroups[pos].sort((a, b) => b.stars - a.stars);
    });

    // Distribute group by group
    const positionsOrder = ['Zagueiro', 'Lateral', 'Meia', 'Atacante', 'Goleiro'];
    positionsOrder.forEach((pos) => {
      const group = positionGroups[pos] || [];
      group.forEach((p) => {
        const teamIdx = getTeamWithLowestStarsAndSpace(teamBuckets, maxCap);
        teamBuckets[teamIdx].push(p);
      });
    });
  } else {
    // Default: 'stars' or 'captains' greedy balance
    // Sort players by stars descending
    availablePlayers.sort((a, b) => b.stars - a.stars);

    // Greedy snake balance
    availablePlayers.forEach((p) => {
      const teamIdx = getTeamWithLowestStarsAndSpace(teamBuckets, maxCap);
      teamBuckets[teamIdx].push(p);
    });
  }

  // Build Teams with names and preset colors
  const generatedTeams: Team[] = teamBuckets.map((bucket, idx) => {
    const color = PRESET_TEAM_COLORS[idx % PRESET_TEAM_COLORS.length];
    return {
      id: `team-${Date.now()}-${idx + 1}`,
      name: `Time ${color.name}`,
      color,
      playerIds: bucket.map((p) => p.id),
      captainId: bucket[0]?.id,
    };
  });

  return generatedTeams;
}

export function calculateTeamStats(team: Team, allPlayers: Player[]) {
  const teamPlayers = allPlayers.filter((p) => team.playerIds.includes(p.id));
  const totalStars = teamPlayers.reduce((sum, p) => sum + p.stars, 0);
  const avgStars = teamPlayers.length > 0 ? (totalStars / teamPlayers.length).toFixed(1) : '0';
  
  const goalkeepersCount = teamPlayers.filter((p) => p.position === 'Goleiro').length;
  const defendersCount = teamPlayers.filter((p) => p.position === 'Zagueiro' || p.position === 'Lateral').length;
  const midfieldersCount = teamPlayers.filter((p) => p.position === 'Meia').length;
  const forwardsCount = teamPlayers.filter((p) => p.position === 'Atacante').length;

  return {
    playersCount: teamPlayers.length,
    totalStars,
    avgStars,
    goalkeepersCount,
    defendersCount,
    midfieldersCount,
    forwardsCount,
    players: teamPlayers,
  };
}
