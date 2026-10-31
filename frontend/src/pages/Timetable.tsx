import { useState, useEffect, FormEvent } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, CircularProgress, Alert, Fade, Collapse, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { Club, TimetableItem } from '../shared/types';
import { apiCreateTimetable, apiDeleteTimetable, apiGetClubs, apiGetTimetables, apiUpdateTimetable } from '../shared/api/clubs';
import { useAuth } from '../features/Auth/AuthContext';

export default function Timetable() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const [timetable, setTimetable] = useState<TimetableItem[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [clubId, setClubId] = useState<number>(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [room, setRoom] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [timetableData, clubsData] = await Promise.all([
        apiGetTimetables(),
        apiGetClubs(),
      ]);
      setTimetable(timetableData);
      setClubs(clubsData);
      if (clubsData.length > 0 && clubId === 0) {
        setClubId(clubsData[0].id);
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Ошибка загрузки расписания');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const clubMap = Object.fromEntries(clubs.map((c) => [c.id, c.name]));

  const openCreateForm = () => {
    setEditingId(null);
    if (clubs.length > 0) setClubId(clubs[0].id);
    setDate('');
    setTime('');
    setRoom('');
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditForm = (row: TimetableItem) => {
    setEditingId(row.id);
    setClubId(row.club_id);
    setDate(row.date);
    setTime(row.time);
    setRoom(row.room);
    setFormError('');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!clubId || !date.trim() || !time.trim() || !room.trim()) {
      setFormError('Заполните все поля расписания');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId === null) {
        const created = await apiCreateTimetable({
          club_id: clubId,
          date: date.trim(),
          time: time.trim(),
          room: room.trim(),
        });
        setTimetable((prev) => [...prev, created]);
      } else {
        const updated = await apiUpdateTimetable(editingId, {
          club_id: clubId,
          date: date.trim(),
          time: time.trim(),
          room: room.trim(),
        });
        setTimetable((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
      }
      setIsFormOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Ошибка сохранения занятия');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiDeleteTimetable(id);
      setTimetable((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Ошибка удаления занятия');
    }
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ color: '#4A2428', mb: 0.8 }}>
            Расписание занятий
          </Typography>
          <Typography variant="body1" sx={{ color: '#806F70' }}>
            Предстоящие занятия студенческих кружков
          </Typography>
        </Box>

        {isTeacher && (
          <Button
            variant="contained"
            onClick={() => (isFormOpen ? setIsFormOpen(false) : openCreateForm())}
            sx={{
              backgroundColor: '#76232F',
              '&:hover': { backgroundColor: '#5A1823' },
            }}
          >
            {isFormOpen ? 'Закрыть форму' : '+ Добавить занятие'}
          </Button>
        )}
      </Box>

      <Collapse in={isFormOpen && isTeacher}>
        <Paper
          elevation={0}
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 3,
            mb: 3,
            border: '1px solid #E8DDD2',
            borderRadius: 1.5,
            backgroundColor: '#FFFCF7',
          }}
        >
          <Typography variant="h6" sx={{ color: '#4A2428', mb: 2 }}>
            {editingId === null ? 'Новое занятие' : 'Редактирование занятия'}
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl size="small" fullWidth>
                <InputLabel>Кружок</InputLabel>
                <Select
                  value={clubId}
                  label="Кружок"
                  onChange={(e) => setClubId(Number(e.target.value))}
                >
                  {clubs.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Дата (например, 28.10.2026)"
                size="small"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Время (например, 18:00)"
                size="small"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Аудитория (например, Ауд. 301)"
                size="small"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              mt: 2,
              backgroundColor: '#76232F',
              '&:hover': { backgroundColor: '#5A1823' },
            }}
          >
            {editingId === null ? 'Добавить в расписание' : 'Сохранить изменения'}
          </Button>
        </Paper>
      </Collapse>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#76232F' }} />
        </Box>
      ) : timetable.length === 0 ? (
        <Alert severity="info">Расписание занятий пока не сформировано.</Alert>
      ) : (
        <Fade in timeout={500}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: '1px solid #E8DDD2',
              borderRadius: 1.5,
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#76232F' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Дата</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Время</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Кружок</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Аудитория</TableCell>
                  <TableCell align="right" sx={{ color: '#fff', fontWeight: 700 }}>
                    Действие
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {timetable.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:nth-of-type(even)': { backgroundColor: '#FBF6F0' },
                      '&:hover': { backgroundColor: '#F3E8DF' },
                    }}
                  >
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#5F222C' }}>
                      {clubMap[row.club_id] || `Кружок #${row.club_id}`}
                    </TableCell>
                    <TableCell>{row.room}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          component={Link}
                          to={`/attendance/${row.id}`}
                          variant="outlined"
                          size="small"
                          sx={{
                            color: '#76232F',
                            borderColor: '#76232F',
                            '&:hover': {
                              borderColor: '#5A1823',
                              backgroundColor: '#F7ECE7',
                            },
                          }}
                        >
                          Журнал
                        </Button>

                        {isTeacher && (
                          <>
                            <Button
                              size="small"
                              variant="text"
                              onClick={() => openEditForm(row)}
                              sx={{ color: '#6D5B4E' }}
                            >
                              Изменить
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleDelete(row.id)}
                            >
                              Удалить
                            </Button>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}
    </Box>
  );
}
