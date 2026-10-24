import { Typography, Paper, Button, Box, Divider, Chip, Stack, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Alert, Collapse } from '@mui/material';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SESSIONS, INITIAL_STUDENTS } from '../entities/club/data';
import { useAuth } from '../features/Auth/AuthContext';

export default function Attendance() {
  const { id } = useParams();
  const { user } = useAuth();

  const initialSession =
    SESSIONS.find((session) => session.id === Number(id)) ?? SESSIONS[0];

  const [selectedSessionId, setSelectedSessionId] = useState(initialSession.id);

  const [attendance, setAttendance] = useState<Record<string, boolean>>({
    'Гасанов К. У.': false,
    'Гутник Е. И.': false,
    'Еременко Г. К.': true,
    'Орлов А. Н.': true,
    'Печерский Д. А.': true,
    'Капранов В. С.': true,
    'Лазарев Р. Н.': true,
  });

  const [isSaved, setIsSaved] = useState(false);

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

  const selectedSession =
    SESSIONS.find((session) => session.id === selectedSessionId) ?? SESSIONS[0];

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const absentCount = INITIAL_STUDENTS.length - presentCount;

  const toggleAttendance = (student: string) => {
    if (!isTeacher) return;
    setAttendance((prev) => ({ ...prev, [student]: !prev[student] }));
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!isTeacher) return;
    setIsSaved(true);
  };

  return (
    <Box>
      {/* Заголовок */}
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

      {/* Выбор занятия */}
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
              {SESSIONS.map((session) => (
                <MenuItem key={session.id} value={session.id}>
                  {session.club} — {session.date} — {session.time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Информация о занятии */}
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
          {selectedSession.club}
        </Typography>

        <Typography sx={{ color: '#76686A', mb: 0.5 }}>
          {selectedSession.date} · {selectedSession.time} · {selectedSession.room}
        </Typography>

        <Typography sx={{ color: '#76686A' }}>
          Преподаватель: {selectedSession.teacher}
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
            label={`Всего: ${INITIAL_STUDENTS.length}`}
            sx={{ backgroundColor: '#F1E9DF', color: '#6D5B4E', fontWeight: 600 }}
          />
        </Stack>
      </Paper>

      <Collapse in={isSaved}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Данные о посещаемости для занятия «{selectedSession.club}» успешно сохранены!
        </Alert>
      </Collapse>

      {/* Журнал */}
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
            {isTeacher ? 'Нажмите на статус, чтобы изменить отметку' : 'Статус посещаемости участников'}
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#76232F' }}>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 700 }}>№</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 700 }}>Студент</TableCell>
                <TableCell align="right" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                  Статус
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {INITIAL_STUDENTS.map((student, index) => {
                const isPresent = Boolean(attendance[student]);

                return (
                  <TableRow
                    key={student}
                    sx={{
                      '&:nth-of-type(even)': { backgroundColor: '#FBF6F0' },
                      '&:hover': { backgroundColor: '#F3E8DF' },
                    }}
                  >
                    <TableCell sx={{ width: 60, color: '#8A7778' }}>{index + 1}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 500, color: '#443335' }}>{student}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        onClick={() => toggleAttendance(student)}
                        disabled={!isTeacher}
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

        {isTeacher && (
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
            <Typography sx={{ color: isSaved ? '#40613F' : '#76686A', fontWeight: isSaved ? 600 : 400 }}>
              {isSaved ? '✓ Все изменения сохранены' : 'Изменения пока не сохранены'}
            </Typography>

            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                backgroundColor: '#76232F',
                '&:hover': { backgroundColor: '#5A1823' },
              }}
            >
              Сохранить отметки
            </Button>
          </Box>
        )}
      </Paper>

      <Box sx={{ mt: 3 }}>
        <Button component={Link} to="/timetable" sx={{ color: '#76232F' }}>
          ← Вернуться к расписанию
        </Button>
      </Box>
    </Box>
  );
}
