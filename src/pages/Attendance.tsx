import { Typography, Paper, Button, Box, Divider, Chip, Stack, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const SESSIONS = [
  { id: 1, date: '15.10.2026', time: '18:00', club: 'Баскетбол', room: 'Ауд. 301', teacher: 'Гутиеррес - Камблор А. А.' },
  { id: 2, date: '16.10.2026', time: '16:00', club: 'Воллейбол', room: 'Ауд. 101', teacher: 'Дышенко В. С.' },
  { id: 3, date: '15.10.2026', time: '15:30', club: 'Шахматы', room: 'Ауд. 410', teacher: 'Бобров А. Д.' },
  { id: 4, date: '25.10.2026', time: '17:00', club: 'Лёгкая атлетика', room: 'Ауд. 201', teacher: 'Махонин И. Д.' },
  { id: 5, date: '20.10.2026', time: '20:00', club: 'Футбол', room: 'Ауд. 212', teacher: 'Сенов Д. C.' },
  { id: 6, date: '18.10.2026', time: '19:00', club: 'Пение', room: 'Ауд. 310', teacher: 'Манолиу Д. Д.' },
  { id: 7, date: '16.10.2026', time: '16:30', club: 'Танцы', room: 'Ауд. 202', teacher: 'Гутиеррес - Камблор А. А.' },
];

const STUDENTS = ['Печерский Д. А.', 'Гутник Е. И.', 'Еременко Г. К.', 'Орлов А. А.', 'Гасанов К. У.', 'Капранов В. С.', 'Лазарев Р. Н.'];

export default function Attendance() {
  const { id } = useParams();

  const initialSession =
    SESSIONS.find((session) => session.id === Number(id)) ??
    SESSIONS[0];

  const [selectedSessionId, setSelectedSessionId] =
    useState(initialSession.id);

  const [attendance, setAttendance] = useState<Record<string, boolean>>({
    'Печерский Д. А.': true,
    'Гутник Е. И.': false,
    'Еременко Г. К.': true,
    'Орлов А. А.': true,
    'Гасанов К. У.': false,
    'Капранов В. С.': true,
    'Лазарев Р. Н.': true,
  });

  const selectedSession =
    SESSIONS.find((session) => session.id === selectedSessionId) ?? SESSIONS[0];

  const presentCount = Object.values(attendance).filter(Boolean).length;

  const absentCount =
    STUDENTS.length - presentCount;

  const toggleAttendance = (student: string) => {
    setAttendance((prev) => ({...prev, [student]: !prev[student]}));
  };

  return (
    <Box>
      {/* Заголовок */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: '#4A2428',
            mb: 0.8,
          }}
        >
          Журнал посещаемости
        </Typography>

        <Typography
          sx={{
            color: '#806F70',
          }}
        >
          Отметьте присутствующих на выбранном занятии
        </Typography>
      </Box>

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
        <Typography
          variant="h6"
          sx={{
            color: '#4A2428',
            mb: 2,
          }}
        >
          Выбор занятия
        </Typography>

        <Stack
          direction={{
            xs: 'column',
            md: 'row',
          }}
          spacing={2}
        >
          <FormControl fullWidth>
            <InputLabel>Занятие</InputLabel>

            <Select
              value={selectedSessionId}
              label="Занятие"
              onChange={(event) => {
                setSelectedSessionId(
                  Number(event.target.value),
                );
              }}
            >
              {SESSIONS.map((session) => (
                <MenuItem
                  key={session.id}
                  value={session.id}
                >
                  {session.club} — {session.date} —{' '}
                  {session.time}
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
        <Typography
          variant="h5"
          sx={{
            color: '#4A2428',
            mb: 1,
          }}
        >
          {selectedSession.club}
        </Typography>

        <Typography
          sx={{
            color: '#76686A',
            mb: 0.5,
          }}
        >
          {selectedSession.date} · {selectedSession.time} ·{' '}
          {selectedSession.room}
        </Typography>

        <Typography
          sx={{
            color: '#76686A',
          }}
        >
          Преподаватель: {selectedSession.teacher}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip
            label={`Присутствуют: ${presentCount}`}
            sx={{
              backgroundColor: '#E9F1E8',
              color: '#40613F',
              fontWeight: 600,
            }}
          />

          <Chip
            label={`Отсутствуют: ${absentCount}`}
            sx={{
              backgroundColor: '#F5E4E1',
              color: '#76232F',
              fontWeight: 600,
            }}
          />

          <Chip
            label={`Всего: ${STUDENTS.length}`}
            sx={{
              backgroundColor: '#F1E9DF',
              color: '#6D5B4E',
              fontWeight: 600,
            }}
          />
        </Stack>
      </Paper>

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
          <Typography
            variant="h6"
            sx={{
              color: '#4A2428',
            }}
          >
            Участники
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#806F70',
              mt: 0.5,
            }}
          >
            Нажмите на статус, чтобы изменить отметку
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: '#76232F',
                }}
              >
                <TableCell
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                  }}
                >
                  №
                </TableCell>

                <TableCell
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                  }}
                >
                  Студент
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    color: '#FFFFFF',
                    fontWeight: 700,
                  }}
                >
                  Статус
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {STUDENTS.map((student, index) => {
                const isPresent = attendance[student];

                return (
                  <TableRow
                    key={student}
                    sx={{
                      '&:nth-of-type(even)': {
                        backgroundColor: '#FBF6F0',
                      },

                      '&:hover': {
                        backgroundColor: '#F3E8DF',
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        width: 60,
                        color: '#8A7778',
                      }}
                    >
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: '#443335',
                        }}
                      >
                        {student}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Button
                        onClick={() =>
                          toggleAttendance(student)
                        }
                        size="small"
                        variant="outlined"
                        sx={{
                          minWidth: 155,
                          borderColor: isPresent
                            ? '#66815F'
                            : '#A76565',
                          color: isPresent
                            ? '#4D6C47'
                            : '#76232F',
                          backgroundColor: isPresent
                            ? '#EEF4EC'
                            : '#F8EDEC',

                          '&:hover': {
                            backgroundColor: isPresent
                              ? '#E2EDE0'
                              : '#F4E1DF',
                            borderColor: isPresent
                              ? '#4D6C47'
                              : '#76232F',
                          },
                        }}
                      >
                        {isPresent
                          ? '✓ Присутствует'
                          : '× Отсутствует'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Нижняя панель */}
        <Box
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'space-between',
            alignItems: {
              xs: 'stretch',
              sm: 'center',
            },
            gap: 2,
            borderTop: '1px solid #E8DDD2',
            backgroundColor: '#FBF6F0',
          }}
        >
          <Typography
            sx={{
              color: '#76686A',
            }}
          >
            Изменения пока не сохранены
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#76232F',

              '&:hover': {
                backgroundColor: '#5A1823',
              },
            }}
          >
            Сохранить отметки
          </Button>
        </Box>
      </Paper>

      {/* Назад */}
      <Box sx={{ mt: 3 }}>
        <Button
          component={Link}
          to="/timetable"
          sx={{
            color: '#76232F',
          }}
        >
          ← Вернуться к расписанию
        </Button>
      </Box>
    </Box>
  );
}
 



