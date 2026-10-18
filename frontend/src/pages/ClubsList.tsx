import { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, CardActions, Button, Box, TextField, CircularProgress, Alert, Fade } from '@mui/material';
import { Link } from 'react-router-dom';
import { CLUBS } from '../entities/club/data';
import { Club } from '../shared/types';

export default function ClubsList() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setClubs(CLUBS);
        setIsLoading(false);
      } catch {
        setIsError(true);
        setIsLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      {/* Заголовок страницы и поиск */}
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              color: '#4A2428',
              mb: 0.8,
            }}
          >
            Каталог кружков
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#806F70',
              fontSize: 15,
            }}
          >
            Выберите кружок, чтобы узнать подробности
          </Typography>
        </Box>

        <TextField
          placeholder="Поиск по названию или преподавателю..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            minWidth: { xs: '100%', sm: 300 },
            backgroundColor: '#FFFCF7',
          }}
        />
      </Box>

      {/* Состояния загрузки, ошибки и пустых данных */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#76232F' }} />
        </Box>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Не удалось загрузить список кружков. Попробуйте обновить страницу.
        </Alert>
      )}

      {!isLoading && !isError && filteredClubs.length === 0 && (
        <Alert severity="info" sx={{ backgroundColor: '#FBF6F0', color: '#4A2428', border: '1px solid #E8DDD2' }}>
          По вашему запросу «{searchQuery}» кружки не найдены.
        </Alert>
      )}

      {/* Карточки */}
      {!isLoading && !isError && filteredClubs.length > 0 && (
        <Fade in timeout={500}>
          <Grid container spacing={2.5}>
            {filteredClubs.map((club) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={club.id}
              >
                <Card
                  sx={{
                    height: '100%',
                    minHeight: 185,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 1.5,
                  }}
                >
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      p: 2.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 1.5,
                      }}
                    >
                      {/* Иконка */}
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
                        {club.icon}
                      </Box>

                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#3F2729',
                            lineHeight: 1.2,
                            mb: 1,
                          }}
                        >
                          {club.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: '#806F70',
                            lineHeight: 1.5,
                          }}
                        >
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

                        '&:hover': {
                          backgroundColor: '#5A1823',
                        },
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
