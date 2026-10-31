export function getClubIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('футбол')) return '⚽';
  if (lower.includes('баскетбол')) return '🏀';
  if (lower.includes('пение') || lower.includes('вокал') || lower.includes('музык')) return '🎵';
  if (lower.includes('атлетик') || lower.includes('бег')) return '🏃';
  if (lower.includes('воллейбол') || lower.includes('волейбол')) return '🏐';
  if (lower.includes('шахмат')) return '♟';
  if (lower.includes('танц')) return '🕺';
  return '🎓';
}
