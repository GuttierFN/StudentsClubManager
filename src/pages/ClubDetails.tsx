import { Typography, Paper, Button, List, ListItem, ListItemText, Divider, Box, Stack, Chip } from '@mui/material';
import { Link, useParams } from 'react-router-dom';

const CLUBS = [
  { id: 1, name: 'Футбол', teacher: 'Сенов Д. C.', icon: '⚽' },
  { id: 2, name: 'Баскетбол', teacher: 'Гутиеррес - Камблор А. А.', icon: '🏀' },
  { id: 3, name: 'Пение', teacher: 'Манолиу Д. Д.', icon: '♪' },
  { id: 4, name: 'Лёгкая атлетика', teacher: 'Махонин И. Д.', icon: '🏃' },
  { id: 5, name: 'Воллейбол', teacher: 'Дышенко В. С.', icon: '🏐' },
  { id: 6, name: 'Шахматы', teacher: 'Бобров А. Д.', icon: '♟' },
  { id: 7, name: 'Танцы', teacher: 'Гутиеррес - Камблор А. А.', icon: '🕺' },
];

const STUDENTS = ['Гасанов К. У.', 'Гутник Е. И.', 'Еременко Г. К.', 'Орлов А. Н.', 'Печерский Д. А.', 'Капранов В. С.', 'Лазарев Р. Н.' ];

export default function ClubDetails() {
  const { id } = useParams();

  const club = CLUBS.find((item) => item.id === Number(id)) ?? CLUBS[0];

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
                label={`Участников: ${STUDENTS.length}`}
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

            <Button
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: '#76232F',
                '&:hover': {
                  backgroundColor: '#5A1823',
                },
              }}
            >
              Подать заявку на вступление
            </Button>
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
            label={`${STUDENTS.length} человек`}
            sx={{
              backgroundColor: '#F3E3D8',
              color: '#76232F',
              fontWeight: 600,
            }}
          />
        </Box>

        <Divider />

        <List disablePadding>
          {STUDENTS.map((student, index) => (
            <Box key={student}>
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

              {index < STUDENTS.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Paper>
    </Box>
  );
}





