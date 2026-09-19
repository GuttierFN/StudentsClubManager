import { Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const CLUBS = [
  { id: 1, name: 'Футбол', teacher: 'Сенов Д. C.' },
  { id: 2, name: 'Баскетбол', teacher: 'Гутиеррес - Камблор А. А.' },
  { id: 3, name: 'Пение', teacher: 'Манолиу Д. Д.' },
  { id: 4, name: 'Лёгкая атлетика', teacher: 'Махонин И. Д.'},
  { id: 5, name: 'Воллейбол', teacher: 'Дышенко В. С.'},
  { id: 6, name: 'Шахматы', teacher: 'Бобров А. Д.'},
  { id: 7, name: 'Танцы', teacher: 'Гутиеррес - Камблор А. А.'},
];

export default function ClubsList() {
  return (
    <div>
      <Typography variant="h4" gutterBottom>Каталог кружков</Typography>
      <Grid container spacing={3}>
        {CLUBS.map((club) => (
          <Grid item xs={12} sm={6} md={4} key={club.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5">{club.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Преподаватель: {club.teacher}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" variant="contained" component={Link} to={`/clubs/${club.id}`}>
                  Подробнее
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}




