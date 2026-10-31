import { useState, useEffect, FormEvent } from 'react';
import { Typography, Grid, Card, CardContent, CardActions, Button, Box, TextField, CircularProgress, Alert, Fade, Collapse, Paper, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { getClubIcon } from '../entities/club/data';
import { Club } from '../shared/types';
import { apiCreateClub, apiGetClubs } from '../shared/api/clubs';
import { useAuth } from "../features/EnrollForm/Auth/AuthContext";

export default function ClubsList() {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTeacher, setNewTeacher] = useState(user?.full_name || '');
  const [newDescription, setNewDescription] = useState('');
  const [createError, setCreateError] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const loadClubs = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await apiGetClubs();
      setClubs(data);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Ошибка соединения с сервером FastAPI'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const handleCreateClub = async (e: FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!newName.trim() || !newTeacher.trim()) {
      setCreateError('Укажите название кружка и ФИО преподавателя');
      return;
    }

    setIsCreating(true);
    try {
      const created = await apiCreateClub({
        name: newName.trim(),
        teacher: newTeacher.trim(),
        description: newDescription.trim() || 'Описание кружка, требования к участникам и контакты преподавателя.',
      });
      setClubs((prev) => [...prev, created]);
      setNewName('');
      setNewDescription('');
      setIsCreateOpen(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Ошибка создания кружка');
    } finally {
      setIsCreating(false);
    }
  };

  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ color: '#4A2428', mb: 0.8 }}>
            Каталог кружков
          </Typography>
          <Typography variant="body1" sx={{ color: '#806F70', fontSize: 15 }}>
            Выберите кружок, чтобы узнать подробности
          </Typography>
        </Box>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            placeholder="Поиск по названию или преподавателю..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              minWidth: { xs: '100%', sm: 290 },
              backgroundColor: '#FFFCF7',
            }}
          />

          {isTeacher && (
            <Button
              variant="contained"
              onClick={() => {
                setIsCreateOpen(!isCreateOpen);
                setCreateError('');
              }}
              sx={{
                backgroundColor: '#76232F',
                whiteSpace: 'nowrap',
                '&:hover': { backgroundColor: '#5A1823' },
              }}
            >
              {isCreateOpen ? 'Отмена' : '+ Добавить кружок'}
            </Button>
          )}
        </Stack>
      </Box>

      <Collapse in={isCreateOpen && isTeacher}>
        <Paper
          elevation={0}
          component="form"
          onSubmit={handleCreateClub}
          sx={{
            p: 3,
            mb: 4,
            border: '1px solid #E8DDD2',
            borderRadius: 1.5,
            backgroundColor: '#FFFCF7',
          }}
        >
          <Typography variant="h6" sx={{ color: '#4A2428', mb: 2 }}>
            Создание нового кружка
          </Typography>

          {createError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {createError}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Название кружка"
                size="small"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                disabled={isCreating}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Преподаватель (ФИО)"
                size="small"
                value={newTeacher}
                onChange={(e) => setNewTeacher(e.target.value)}
                disabled={isCreating}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Описание кружка"
                size="small"
                multiline
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                disabled={isCreating}
                fullWidth
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            disabled={isCreating}
            sx={{
              mt: 2,
              backgroundColor: '#76232F',
              '&:hover': { backgroundColor: '#5A1823' },
            }}
          >
            {isCreating ? <CircularProgress size={22} color="inherit" /> : 'Сохранить кружок'}
          </Button>
        </Paper>
      </Collapse>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#76232F' }} />
        </Box>
      )}

      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small" onClick={loadClubs}>
              Повторить
            </Button>
          }
        >
          {errorMessage}
        </Alert>
      )}

      {!isLoading && !errorMessage && filteredClubs.length === 0 && (
        <Alert
          severity="info"
          sx={{ backgroundColor: '#FBF6F0', color: '#4A2428', border: '1px solid #E8DDD2' }}
        >
          {searchQuery
            ? `По вашему запросу «${searchQuery}» кружки не найдены.`
            : 'В базе данных пока нет созданных кружков.'}
        </Alert>
      )}

      {!isLoading && !errorMessage && filteredClubs.length > 0 && (
        <Fade in timeout={500}>
          <Grid container spacing={2.5}>
            {filteredClubs.map((club) => (
              <Grid item xs={12} sm={6} md={4} key={club.id}>
                <Card
                  sx={{
                    height: '100%',
                    minHeight: 185,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 1.5,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <Box
                        sx={{
                          flexShrink: 0,
                          width: 46,
                          height: 46,
                          borderRadius: '50%',
                          backgroundColor: '#F3E3D8',
                          color: '#76232F',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 22,
                          fontWeight: 600,
                        }}
                      >
                        {getClubIcon(club.name)}
                      </Box>

                      <Box>
                        <Typography variant="h6" sx={{ color: '#3F2729', lineHeight: 1.2, mb: 1 }}>
                          {club.name}
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#806F70', lineHeight: 1.5 }}>
                          Преподаватель: {club.teacher}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ px: 2.5, pb: 2.5 }}>
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/clubs/${club.id}`}
                      endIcon={<span>→</span>}
                      sx={{
                        backgroundColor: '#76232F',
                        '&:hover': { backgroundColor: '#5A1823' },
                      }}
                    >
                      Подробнее
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}
    </Box>
  );
}
