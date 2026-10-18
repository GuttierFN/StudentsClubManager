import { useState } from 'react';
import { Typography, Paper, Button, List, ListItem, ListItemText, Divider, Box, Stack, Chip, Alert } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import EnrollForm from '../features/EnrollForm/EnrollForm';
import { CLUBS, INITIAL_STUDENTS } from '../entities/club/data';

export default function ClubDetails() {
  const { id } = useParams();
  const [students, setStudents] = useState<string[]>(INITIAL_STUDENTS);

  const club = CLUBS.find((item) => item.id === Number(id));

  if (!club) {
    return (
      <Box>
        <Button component={Link} to="/" sx={{ color: '#76232F', px: 0, mb: 2 }}>
          ← Вернуться к каталогу
        </Button>
        <Alert severity="error">Запрашиваемый кружок не найден.</Alert>
      </Box>
    );
  }

  const handleEnrollStudent = (newStudent: string) => {
    setStudents((prev) => [...prev, newStudent]);
  };

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
                {club.icon}
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
              Информация о кружке, требования к участникам
              и контакты преподавателя.
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

            <EnrollForm onEnroll={handleEnrollStudent} />
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

            <Typography
              variant="h6"
              sx={{
                color: '#4A2428',
                mb: 2,
              }}
            >
              {club.name}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Typography
              variant="body2"
              sx={{
                color: '#806F70',
                mb: 0.5,
              }}
            >
              Руководитель
            </Typography>

            <Typography
              sx={{
                color: '#443335',
                fontWeight: 600,
              }}
            >
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
            <Typography
              variant="h6"
              sx={{ color: '#4A2428' }}
            >
              Текущие участники
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#806F70',
                mt: 0.5,
              }}
            >
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
              <Box key={`${student}-${index}`}>
                <ListItem
                  sx={{
                    px: { xs: 3, md: 4 },
                    py: 1.5,
                  }}
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
                    primary={student}
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
