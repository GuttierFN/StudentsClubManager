import { AttendanceItem, Club, ClubPayload, Student, TimetableItem, TimetablePayload } from '../types';
import { fetchWithAuth } from './auth';

const API_URL = 'http://127.0.0.1:8000';

async function parseResponse<T>(res: Response, defaultError: string): Promise<T> {
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const detail =
      typeof errBody.detail === 'string'
        ? errBody.detail
        : Array.isArray(errBody.detail)
        ? 'Ошибка валидации введённых данных'
        : defaultError;
    throw new Error(detail);
  }
  return res.json();
}

export async function apiGetClubs(): Promise<Club[]> {
  const res = await fetch(`${API_URL}/clubs/`);
  return parseResponse<Club[]>(res, 'Не удалось загрузить каталог кружков');
}

export async function apiGetClub(clubId: number): Promise<Club> {
  const res = await fetch(`${API_URL}/clubs/${clubId}`);
  return parseResponse<Club>(res, 'Кружок не найден');
}

export async function apiCreateClub(payload: ClubPayload): Promise<Club> {
  const res = await fetchWithAuth('/clubs/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return parseResponse<Club>(res, 'Ошибка создания кружка');
}

export async function apiUpdateClub(clubId: number, payload: ClubPayload): Promise<Club> {
  const res = await fetchWithAuth(`/clubs/${clubId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return parseResponse<Club>(res, 'Ошибка обновления кружка');
}

export async function apiDeleteClub(clubId: number): Promise<void> {
  const res = await fetchWithAuth(`/clubs/${clubId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.detail || 'Ошибка удаления кружка');
  }
}

export async function apiGetClubStudents(clubId: number): Promise<Student[]> {
  const res = await fetch(`${API_URL}/clubs/${clubId}/students`);
  return parseResponse<Student[]>(res, 'Не удалось загрузить список участников');
}

export async function apiEnrollStudentToClub(
  clubId: number,
  fullName: string,
  groupName: string
): Promise<Student> {
  const studentRes = await fetchWithAuth('/students/', {
    method: 'POST',
    body: JSON.stringify({ full_name: fullName, group_name: groupName }),
  });
  const student = await parseResponse<Student>(studentRes, 'Ошибка сохранения данных студента');

  const enrollRes = await fetchWithAuth(`/clubs/${clubId}/enrollments`, {
    method: 'POST',
    body: JSON.stringify({ student_id: student.id }),
  });
  await parseResponse(enrollRes, 'Не удалось записать студента в кружок');

  return student;
}

export async function apiUnenrollStudent(clubId: number, studentId: number): Promise<void> {
  const res = await fetchWithAuth(`/clubs/${clubId}/enrollments/${studentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.detail || 'Не удалось отчислить студента из кружка');
  }
}

export async function apiGetTimetables(): Promise<TimetableItem[]> {
  const res = await fetch(`${API_URL}/timetables/`);
  return parseResponse<TimetableItem[]>(res, 'Не удалось загрузить расписание');
}

export async function apiCreateTimetable(payload: TimetablePayload): Promise<TimetableItem> {
  const res = await fetchWithAuth('/timetables/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return parseResponse<TimetableItem>(res, 'Не удалось добавить занятие');
}

export async function apiUpdateTimetable(
  timetableId: number,
  payload: TimetablePayload
): Promise<TimetableItem> {
  const res = await fetchWithAuth(`/timetables/${timetableId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return parseResponse<TimetableItem>(res, 'Не удалось обновить занятие');
}

export async function apiDeleteTimetable(timetableId: number): Promise<void> {
  const res = await fetchWithAuth(`/timetables/${timetableId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.detail || 'Не удалось удалить занятие');
  }
}

export async function apiGetAttendance(timetableId: number): Promise<AttendanceItem[]> {
  const res = await fetchWithAuth(`/timetables/${timetableId}/attendance`);
  return parseResponse<AttendanceItem[]>(res, 'Не удалось загрузить данные посещаемости');
}

export async function apiSaveAttendance(
  timetableId: number,
  marks: { student_id: number; present: boolean }[]
): Promise<AttendanceItem[]> {
  const res = await fetchWithAuth(`/timetables/${timetableId}/attendance`, {
    method: 'PUT',
    body: JSON.stringify({ marks }),
  });
  return parseResponse<AttendanceItem[]>(res, 'Ошибка сохранения отметок посещаемости');
}
