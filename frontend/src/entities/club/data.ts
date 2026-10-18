import { Club, SessionItem } from '../../shared/types';

export const CLUBS: Club[] = [
  { id: 1, name: 'Футбол', teacher: 'Сенов Д. C.', icon: '⚽' },
  { id: 2, name: 'Баскетбол', teacher: 'Гутиеррес - Камблор А. А.', icon: '🏀' },
  { id: 3, name: 'Пение', teacher: 'Манолиу Д. Д.', icon: '🎵' },
  { id: 4, name: 'Лёгкая атлетика', teacher: 'Махонин И. Д.', icon: '🏃' },
  { id: 5, name: 'Воллейбол', teacher: 'Дышенко В. С.', icon: '🏐' },
  { id: 6, name: 'Шахматы', teacher: 'Бобров А. Д.', icon: '♟' },
  { id: 7, name: 'Танцы', teacher: 'Гутиеррес - Камблор А. А.', icon: '🕺' },
];

export const SESSIONS: SessionItem[] = [
  { id: 1, date: '15.10.2026', time: '18:00', club: 'Баскетбол', room: 'Ауд. 301', teacher: 'Гутиеррес - Камблор А. А.' },
  { id: 2, date: '16.10.2026', time: '16:00', club: 'Воллейбол', room: 'Ауд. 101', teacher: 'Дышенко В. С.' },
  { id: 3, date: '15.10.2026', time: '15:30', club: 'Шахматы', room: 'Ауд. 410', teacher: 'Бобров А. Д.' },
  { id: 4, date: '25.10.2026', time: '17:00', club: 'Лёгкая атлетика', room: 'Ауд. 201', teacher: 'Махонин И. Д.' },
  { id: 5, date: '20.10.2026', time: '20:00', club: 'Футбол', room: 'Ауд. 212', teacher: 'Сенов Д. C.' },
  { id: 6, date: '18.10.2026', time: '19:00', club: 'Пение', room: 'Ауд. 310', teacher: 'Манолиу Д. Д.' },
  { id: 7, date: '16.10.2026', time: '16:30', club: 'Танцы', room: 'Ауд. 202', teacher: 'Гутиеррес - Камблор А. А.' },
];

export const INITIAL_STUDENTS: string[] = [
  'Гасанов К. У.',
  'Гутник Е. И.',
  'Еременко Г. К.',
  'Орлов А. Н.',
  'Печерский Д. А.',
  'Капранов В. С.',
  'Лазарев Р. Н.',
];