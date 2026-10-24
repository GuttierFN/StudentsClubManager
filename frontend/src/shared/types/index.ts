export interface Club {
  id: number;
  name: string;
  teacher: string;
  icon: string;
}

export interface SessionItem {
  id: number;
  date: string;
  time: string;
  club: string;
  room: string;
  teacher: string;
}

export interface EnrollFormProps {
  onEnroll: (studentName: string) => void;
}

export type UserRole = 'student' | 'teacher';

export interface User {
  id: number;
  username: string;
  full_name: string;
  role: UserRole;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}
