import { Typography, Paper, Button, List, ListItem, ListItemText, Divider, Box } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function ClubDetails() {
  const { id } = useParams();
  const students = ['Гасанов К. У.', 'Гутник Е. И.', 'Еременко Г. К.', 'Орлов А. Н.', 'Печерский Д. А.', 'Капранов В. С.', 'Лазарев Р. Н.'];

  return (
    <Paper sx={{ p: 7 }}>
      <Typography variant="h4" gutterBottom>Кружок №{id}</Typography>
      <Typography variant="body1" paragraph>
        Информация о кружке, требования к участникам и контакты преподавателя.
      </Typography>
      
      <Box sx={{ mb: 7 }}>
        <Button variant="contained" color="success">Подать заявку на вступление</Button>
      </Box>

      <Typography variant="h6">Текущие участники:</Typography>
      <List>
        {students.map((student, index) => (
          <div key={index}>
            <ListItem>
              <ListItemText primary={student} />
            </ListItem>
            {index < students.length - 1 && <Divider />}
          </div>
        ))}
      </List>
    </Paper>
  );
}





