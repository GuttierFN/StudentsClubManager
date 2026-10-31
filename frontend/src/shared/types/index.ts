export interface Club {
  id: number;
  name: string;
  teacher: string;
  description?: string | null;
}

export interface ClubPayload {
  name: string;
  teacher: string;
  description?: string | null;
}

export interface Student {
  id: number;
  full_name: string;
  group_name: string;
}

export interface TimetableItem {
  id: number;
  club_id: number;
  date: string;
  time: string;
  room: string;
}

export interface TimetablePayload {
  club_id: number;
  date: string;
  time: string;
  room: string;
}

export interface AttendanceItem {
  student_id: number;
  full_name: string;
  group_name: string;
  present: boolean;
}

export interface EnrollFormProps {
  clubId: number;
  onEnroll: (student: Student) => void;
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
