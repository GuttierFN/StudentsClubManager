import { Typography, Paper, Button, List, ListItem, ListItemText, Divider, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function ClubDetails() {
  const { id } = useParams();
  const students = ['Гасанов К. У.', 'Гутник Е. И.', 'Еременко Г. К.', 'Орлов А. Н.', 'Печерский Д. А.', 'Капранов В. С.', 'Лазарев Р. Н.'];

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        border: '1px solid #E8DDD2',
        borderRadius: 1.5,
        backgroundColor: '#FFFCF7',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: '#4A2428',
          mb: 1.5,
        }}
      >
        Кружок №{id}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#76686A',
          maxWidth: 750,
          lineHeight: 1.7,
        }}
      >
        Информация о кружке, требования к участникам и
        контакты преподавателя.
      </Typography>

      <Box sx={{ mt: 3, mb: 5 }}>
        <Button
          variant="contained"
          color="primary"
        >
          Подать заявку на вступление
        </Button>
      </Box>

      <Typography
        variant="h6"
        sx={{
          color: '#4A2428',
          mb: 1,
        }}
      >
        Текущие участники
      </Typography>

      <List
        sx={{
          maxWidth: 700,
          borderTop: '1px solid #E8DDD2',
        }}
      >
        {students.map((student, index) => (
          <Box key={index}>
            <ListItem
              sx={{
                px: 0,
                py: 1.5,
              }}
            >
              <ListItemText
                primary={student}
                primaryTypographyProps={{
                  color: '#443335',
                }}
              />
            </ListItem>

            {index < students.length - 1 && (
              <Divider />
            )}
          </Box>
        ))}
      </List>
    </Paper>
  );
}





