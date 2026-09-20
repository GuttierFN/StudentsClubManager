import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#76232F',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar
          disableGutters
          sx={{
            minHeight: { xs: 64, md: 72 },
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {/* Логотип */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              color: '#FFFFFF',
              textDecoration: 'none',
            }}
          >
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: 1,
                backgroundColor: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 21,
              }}
            >
              🏛
            </Box>

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.2px',
              }}
            >
              Управление студкружками
            </Typography>
          </Box>

          {/* Навигация */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, md: 1 },
            }}
          >
            <Button
              component={Link}
              to="/"
              sx={{
                color: '#FFFFFF',
                fontSize: 13,
                minWidth: 'auto',
                px: { xs: 1, md: 2 },
                borderRadius: 0,
                borderBottom: isActive('/')
                  ? '2px solid #E6C98F'
                  : '2px solid transparent',

                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              Кружки
            </Button>

            <Button
              component={Link}
              to="/timetable"
              sx={{
                color: '#FFFFFF',
                fontSize: 13,
                minWidth: 'auto',
                px: { xs: 1, md: 2 },
                borderRadius: 0,
                borderBottom: isActive('/timetable')
                  ? '2px solid #E6C98F'
                  : '2px solid transparent',

                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              Расписание
            </Button>

            <Button
              component={Link}
              to="/attendance"
              sx={{
                color: '#FFFFFF',
                fontSize: 13,
                minWidth: 'auto',
                px: { xs: 1, md: 2 },
                borderRadius: 0,
                borderBottom: isActive('/attendance')
                  ? '2px solid #E6C98F'
                  : '2px solid transparent',

                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              Журнал
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}





