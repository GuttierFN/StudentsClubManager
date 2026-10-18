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