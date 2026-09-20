import { Typography, Grid, Card, CardContent, CardActions, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const CLUBS = [
  { id: 1, name: 'Футбол', teacher: 'Сенов Д. C.', icon: '⚽' },
  { id: 2, name: 'Баскетбол', teacher: 'Гутиеррес - Камблор А. А.', icon: '🏀' },
  { id: 3, name: 'Пение', teacher: 'Манолиу Д. Д.', icon: '🎵' },
  { id: 4, name: 'Лёгкая атлетика', teacher: 'Махонин И. Д.', icon: '🏃'},
  { id: 5, name: 'Воллейбол', teacher: 'Дышенко В. С.', icon: '🏐'},
  { id: 6, name: 'Шахматы', teacher: 'Бобров А. Д.', icon: '♟'},
  { id: 7, name: 'Танцы', teacher: 'Гутиеррес - Камблор А. А.', icon: '🕺'},
];

export default function ClubsList() {
  return (
    <Box>
      {/* Заголовок страницы */}
      <Box sx={{ mb: 4 }}>
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

      {/* Карточки */}
      <Grid container spacing={2.5}>
        {CLUBS.map((club) => (
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
    </Box>
  );
}




