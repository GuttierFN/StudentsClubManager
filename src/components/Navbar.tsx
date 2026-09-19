import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Управление кружками
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Кружки</Button>
          <Button color="inherit" component={Link} to="/schedule">Расписание</Button>
          <Button color="inherit" component={Link} to="/attendance">Журнал</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}





