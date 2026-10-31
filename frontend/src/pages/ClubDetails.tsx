import { useState, useEffect, FormEvent } from 'react';
import { Typography, Paper, Button, List, ListItem, ListItemText, Divider, Box, Stack, Chip, Alert, CircularProgress, Collapse, TextField } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import EnrollForm from '../features/EnrollForm/EnrollForm';
import { getClubIcon } from '../entities/club/data';
import { Club, Student } from '../shared/types';
import { apiDeleteClub, apiGetClub, apiGetClubStudents, apiUnenrollStudent, apiUpdateClub } from '../shared/api/clubs';
import { useAuth } from '../features/Auth/AuthContext';

export default function ClubDetails() {
  const { id } = useParams();
  const clubId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const [club, setClub] = useState<Club | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editTeacher, setEditTeacher] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [actionError, setActionError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [clubData, studentsData] = await Promise.all([
          apiGetClub(clubId),
          apiGetClubStudents(clubId),
        ]);
        setClub(clubData);
        setStudents(studentsData);
        setEditName(clubData.name);
        setEditTeacher(clubData.teacher);
        setEditDescription(clubData.description || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить данные кружка');
      } finally {
        setIsLoading(false);
      }
    };
    loadDetails();
  }, [clubId]);

  const handleEnrollStudent = (newStudent: Student) => {
    setStudents((prev) => [...prev, newStudent]);
  };

  const handleUpdateClub = async (e: FormEvent) => {
    e.preventDefault();
    setActionError('');

    if (!editName.trim() || !editTeacher.trim()) {
      setActionError('Название кружка и ФИО преподавателя не могут быть пустыми');
      return;
    }

    setIsSaving(true);
    try {
      const updated = await apiUpdateClub(clubId, {
        name: editName.trim(),
        teacher: editTeacher.trim(),
        description: editDescription.trim() || null,
      });
      setClub(updated);
      setIsEditing(false);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ошибка обновления кружка');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClub = async () => {
    setActionError('');
    try {
      await apiDeleteClub(clubId);
      navigate('/');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ошибка удаления кружка');
    }
  };

  const handleUnenroll = async (studentId: number) => {
    setActionError('');
    try {
      await apiUnenrollStudent(clubId, studentId);
      setStudents((prev) => prev.filter((s) => s.id !== studentId));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Ошибка при отчислении студента');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#76232F' }} />
      </Box>
    );
  }

  if (error || !club) {
    return (
      <Box>
        <Button component={Link} to="/" sx={{ color: '#76232F', px: 0, mb: 2 }}>
          ← Вернуться к каталогу
        </Button>
        <Alert severity="error">{error || 'Запрашиваемый кружок не найден.'}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        component={Link}
        to="/"
        sx={{
          color: '#76232F',
          px: 0,
          mb: 2,
          '&:hover': {
            backgroundColor: 'transparent',
            color: '#5A1823',
          },
        }}
      >
        ← Вернуться к каталогу
      </Button>

      {actionError && (
        <Alert severity="error" sx={{ mb: 2.5 }}>
          {actionError}
        </Alert>
      )}

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            gap: 4,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 2,
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  flexShrink: 0,
                  borderRadius: '50%',
                  backgroundColor: '#F3E3D8',
                  color: '#76232F',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 30,
                }}
              >
                {getClubIcon(club.name)}
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#4A2428',
                    lineHeight: 1.15,
                    mb: 0.8,
                  }}
                >
                  {club.name}
                </Typography>

                <Typography sx={{ color: '#76686A' }}>
                  Преподаватель: {club.teacher}
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                color: '#76686A',
                maxWidth: 760,
                lineHeight: 1.7,
              }}
            >
              {club.description ||
                'Информация о кружке, требования к участникам и контакты преподавателя.'}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
              sx={{ mt: 3 }}
            >
              <Chip
                label={`Участников: ${students.length}`}
                sx={{
                  backgroundColor: '#F1E9DF',
                  color: '#6D5B4E',
                  fontWeight: 600,
                }}
              />

              <Chip
                label="Набор участников"
                sx={{
                  backgroundColor: '#F3E3D8',
                  color: '#76232F',
                  fontWeight: 600,
                }}
              />
            </Stack>

            <EnrollForm clubId={club.id} onEnroll={handleEnrollStudent} />

            {isTeacher && (
              <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{ color: '#76232F', borderColor: '#76232F' }}
                >
                  {isEditing ? 'Отменить редактирование' : 'Редактировать кружок'}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={handleDeleteClub}
                >
                  Удалить кружок
                </Button>
              </Stack>
            )}

            <Collapse in={isEditing && isTeacher}>
              <Box
                component="form"
                onSubmit={handleUpdateClub}
                sx={{
                  mt: 2.5,
                  p: 2.5,
                  maxWidth: 480,
                  borderRadius: 1.5,
                  backgroundColor: '#FBF6F0',
                  border: '1px solid #E8DDD2',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#4A2428' }}>
                  Редактирование данных кружка
                </Typography>
                <TextField
                  label="Название кружка"
                  size="small"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={isSaving}
                  fullWidth
                />
                <TextField
                  label="Преподаватель"
                  size="small"
                  value={editTeacher}
                  onChange={(e) => setEditTeacher(e.target.value)}
                  disabled={isSaving}
                  fullWidth
                />
                <TextField
                  label="Описание"
                  size="small"
                  multiline
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  disabled={isSaving}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSaving}
                  sx={{ backgroundColor: '#76232F', '&:hover': { backgroundColor: '#5A1823' } }}
                >
                  Сохранить изменения
                </Button>
              </Box>
            </Collapse>
          </Box>

          <Box
            sx={{
              width: { xs: '100%', md: 260 },
              p: 2.5,
              borderRadius: 1.5,
              backgroundColor: '#FBF6F0',
              border: '1px solid #E8DDD2',
              alignSelf: 'flex-start',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: '#806F70',
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Кружок
            </Typography>

            <Typography variant="h6" sx={{ color: '#4A2428', mb: 2 }}>
              {club.name}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Typography variant="body2" sx={{ color: '#806F70', mb: 0.5 }}>
              Руководитель
            </Typography>

            <Typography sx={{ color: '#443335', fontWeight: 600 }}>
              {club.teacher}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid #E8DDD2',
          borderRadius: 1.5,
          backgroundColor: '#FFFCF7',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            px: { xs: 3, md: 4 },
            py: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ color: '#4A2428' }}>
              Текущие участники
            </Typography>

            <Typography variant="body2" sx={{ color: '#806F70', mt: 0.5 }}>
              Список студентов, записанных в кружок
            </Typography>
          </Box>

          <Chip
            label={`${students.length} человек`}
            sx={{
              backgroundColor: '#F3E3D8',
              color: '#76232F',
              fontWeight: 600,
            }}
          />
        </Box>

        <Divider />

        {students.length === 0 ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">В этом кружке пока нет участников.</Alert>
          </Box>
        ) : (
          <List disablePadding>
            {students.map((student, index) => (
              <Box key={student.id}>
                <ListItem
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: 1.5,
                  }}
                  secondaryAction={
                    isTeacher ? (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleUnenroll(student.id)}
                      >
                        Отчислить
                      </Button>
                    ) : null
                  }
                >
                  <Box
                    sx={{
                      width: 34,
                      color: '#A18484',
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </Box>

                  <ListItemText
                    primary={student.full_name}
                    secondary={`Группа: ${student.group_name}`}
                    primaryTypographyProps={{
                      color: '#443335',
                      fontWeight: 500,
                    }}
                  />
                </ListItem>

                {index < students.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}
