import { Typography, Paper, Button, Box, Divider, Chip, Stack, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Collapse, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../features/Auth/AuthContext';
import { AttendanceItem, Club, TimetableItem } from '../shared/types';
import { apiGetAttendance, apiGetClubs, apiGetTimetables, apiSaveAttendance } from '../shared/api/clubs';

export default function Attendance() {
  const { id } = useParams();
  const { user } = useAuth();

  const [sessions, setSessions] = useState<TimetableItem[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number>(0);
  const [records, setRecords] = useState<AttendanceItem[]>([]);

  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadSessions = async () => {
      setIsLoadingSessions(true);
      setErrorMessage('');
      try {
        const [timetableData, clubsData] = await Promise.all([
          apiGetTimetables(),
          apiGetClubs(),
        ]);
        setSessions(timetableData);
        setClubs(clubsData);

        if (timetableData.length > 0) {
          const requestedId = Number(id);
          const found = timetableData.find((s) => s.id === requestedId);
          setSelectedSessionId(found ? found.id : timetableData[0].id);
        }
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Не удалось загрузить список занятий'
        );
      } finally {
        setIsLoadingSessions(false);
      }
    };
    loadSessions();
  }, [id, user]);

  useEffect(() => {
    if (!user || !selectedSessionId) return;

    const loadAttendance = async () => {
      setIsLoadingRecords(true);
      setErrorMessage('');
      try {
        const data = await apiGetAttendance(selectedSessionId);
        setRecords(data);
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : 'Ошибка загрузки журнала посещаемости'
        );
      } finally {
        setIsLoadingRecords(false);
      }
    };
    loadAttendance();
  }, [selectedSessionId, user]);

  if (!user) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: '1px solid #E8DDD2',
          borderRadius: 1.5,
          backgroundColor: '#FFFCF7',
        }}
      >
        <Typography variant="h5" sx={{ color: '#4A2428', mb: 1 }}>
          Доступ ограничен
        </Typography>
        <Typography sx={{ color: '#76686A', mb: 3 }}>
          Журнал посещаемости доступен только авторизованным пользователям.
        </Typography>
        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{ backgroundColor: '#76232F', '&:hover': { backgroundColor: '#5A1823' } }}
        >
          Войти в систему
        </Button>
      </Paper>
    );
  }

  const isTeacher = user.role === 'teacher';
  const clubMap = Object.fromEntries(clubs.map((c) => [c.id, c]));

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);
  const selectedClub = selectedSession ? clubMap[selectedSession.club_id] : undefined;

  const presentCount = records.filter((r) => r.present).length;
  const absentCount = records.length - presentCount;

  const toggleAttendance = (studentId: number) => {
    if (!isTeacher) return;
    setRecords((prev) =>
      prev.map((item) =>
        item.student_id === studentId ? { ...item, present: !item.present } : item
      )
    );
    setIsSaved(false);
  };

  const handleSave = async () => {
    if (!isTeacher || !selectedSessionId) return;
    setIsSaving(true);
    setErrorMessage('');
    setIsSaved(false);

    try {
      const updated = await apiSaveAttendance(
        selectedSessionId,
        records.map((r) => ({ student_id: r.student_id, present: r.present }))
      );
      setRecords(updated);
      setIsSaved(true);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Не удалось сохранить отметки в базе данных'
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingSessions) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#76232F' }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: '#4A2428', mb: 0.8 }}>
          Журнал посещаемости
        </Typography>
        <Typography sx={{ color: '#806F70' }}>
          {isTeacher
            ? 'Отметьте присутствующих на выбранном занятии'
            : 'Режим просмотра (редактирование доступно только преподавателям)'}
        </Typography>
      </Box>

      {!isTeacher && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Вы вошли как студент ({user.full_name}). Изменение отметок посещаемости доступно только пользователям с ролью «Преподаватель».
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {sessions.length === 0 ? (
        <Alert severity="info">В базе данных пока нет занятий в расписании.</Alert>
      ) : (
        <>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              border: '1px solid #E8DDD2',
              borderRadius: 1.5,
              backgroundColor: '#FFFCF7',
            }}
          >
            <Typography variant="h6" sx={{ color: '#4A2428', mb: 2 }}>
              Выбор занятия
            </Typography>

            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Занятие</InputLabel>
                <Select
                  value={selectedSessionId}
                  label="Занятие"
                  onChange={(event) => {
                    setSelectedSessionId(Number(event.target.value));
                    setIsSaved(false);
                  }}
                >
                  {sessions.map((session) => {
                    const cName = clubMap[session.club_id]?.name || `Кружок #${session.club_id}`;
                    return (
                      <MenuItem key={session.id} value={session.id}>
                        {cName} — {session.date} — {session.time}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Stack>
          </Paper>

          {selectedSession && (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                mb: 3,
                border: '1px solid #E8DDD2',
                borderRadius: 1.5,
                backgroundColor: '#FFFCF7',
              }}
            >
              <Typography variant="h5" sx={{ color: '#4A2428', mb: 1 }}>
                {selectedClub?.name || `Кружок #${selectedSession.club_id}`}
              </Typography>

              <Typography sx={{ color: '#76686A', mb: 0.5 }}>
                {selectedSession.date} · {selectedSession.time} · {selectedSession.room}
              </Typography>

              <Typography sx={{ color: '#76686A' }}>
                Преподаватель: {selectedClub?.teacher || 'Не указан'}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  label={`Присутствуют: ${presentCount}`}
                  sx={{ backgroundColor: '#E9F1E8', color: '#40613F', fontWeight: 600 }}
                />
                <Chip
                  label={`Отсутствуют: ${absentCount}`}
                  sx={{ backgroundColor: '#F5E4E1', color: '#76232F', fontWeight: 600 }}
                />
                <Chip
                  label={`Всего: ${records.length}`}
                  sx={{ backgroundColor: '#F1E9DF', color: '#6D5B4E', fontWeight: 600 }}
                />
              </Stack>
            </Paper>
          )}

          <Collapse in={isSaved}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Данные о посещаемости для занятия «{selectedClub?.name}» успешно сохранены в PostgreSQL!
            </Alert>
          </Collapse>

          <Paper
            elevation={0}
            sx={{
              border: '1px solid #E8DDD2',
              borderRadius: 1.5,
              overflow: 'hidden',
              backgroundColor: '#FFFCF7',
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: '#4A2428' }}>
                Участники
              </Typography>
              <Typography variant="body2" sx={{ color: '#806F70', mt: 0.5 }}>
                {isTeacher
                  ? 'Нажмите на статус, чтобы изменить отметку'
                  : 'Статус посещаемости участников'}
              </Typography>
            </Box>

            {isLoadingRecords ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress sx={{ color: '#76232F' }} />
              </Box>
            ) : records.length === 0 ? (
              <Box sx={{ p: 3 }}>
                <Alert severity="info">В этот кружок пока не записан ни один студент.</Alert>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#76232F' }}>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 700 }}>№</TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 700 }}>Студент</TableCell>
                      <TableCell sx={{ color: '#FFFFFF', fontWeight: 700 }}>Группа</TableCell>
                      <TableCell align="right" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                        Статус
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {records.map((student, index) => {
                      const isPresent = student.present;

                      return (
                        <TableRow
                          key={student.student_id}
                          sx={{
                            '&:nth-of-type(even)': { backgroundColor: '#FBF6F0' },
                            '&:hover': { backgroundColor: '#F3E8DF' },
                          }}
                        >
                          <TableCell sx={{ width: 60, color: '#8A7778' }}>{index + 1}</TableCell>
                          <TableCell>
                            <Typography sx={{ fontWeight: 500, color: '#443335' }}>
                              {student.full_name}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ color: '#76686A' }}>{student.group_name}</TableCell>
                          <TableCell align="right">
                            <Button
                              onClick={() => toggleAttendance(student.student_id)}
                              disabled={!isTeacher || isSaving}
                              size="small"
                              variant="outlined"
                              sx={{
                                minWidth: 155,
                                borderColor: isPresent ? '#66815F' : '#A76565',
                                color: isPresent ? '#4D6C47' : '#76232F',
                                backgroundColor: isPresent ? '#EEF4EC' : '#F8EDEC',
                                '&:hover': {
                                  backgroundColor: isPresent ? '#E2EDE0' : '#F4E1DF',
                                  borderColor: isPresent ? '#4D6C47' : '#76232F',
                                },
                              }}
                            >
                              {isPresent ? '✓ Присутствует' : '× Отсутствует'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {isTeacher && records.length > 0 && (
              <Box
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'stretch', sm: 'center' },
                  gap: 2,
                  borderTop: '1px solid #E8DDD2',
                  backgroundColor: '#FBF6F0',
                }}
              >
                <Typography
                  sx={{
                    color: isSaved ? '#40613F' : '#76686A',
                    fontWeight: isSaved ? 600 : 400,
                  }}
                >
                  {isSaved ? '✓ Все изменения сохранены в БД' : 'Изменения пока не сохранены'}
                </Typography>

                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={isSaving}
                  sx={{
                    backgroundColor: '#76232F',
                    '&:hover': { backgroundColor: '#5A1823' },
                  }}
                >
                  {isSaving ? <CircularProgress size={22} color="inherit" /> : 'Сохранить отметки'}
                </Button>
              </Box>
            )}
          </Paper>
        </>
      )}

      <Box sx={{ mt: 3 }}>
        <Button component={Link} to="/timetable" sx={{ color: '#76232F' }}>
          ← Вернуться к расписанию
        </Button>
      </Box>
    </Box>
  );
}
