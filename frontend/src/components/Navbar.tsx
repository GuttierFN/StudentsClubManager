import { AppBar, Toolbar, Typography, Button, Box, Container, Chip } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/Auth/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
            flexWrap: 'wrap',
            gap: 1,
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

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Управление студкружками
            </Typography>
          </Box>

          {/* Навигация и профиль */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 0.5, md: 1.5 },
            }}
          >
            <Button
              component={Link}
              to="/"
              sx={{
                color: '#FFFFFF',
                minWidth: 'auto',
                px: { xs: 1, md: 1.5 },
                borderRadius: 0,
                borderBottom: isActive('/') ? '2px solid #E6C98F' : '2px solid transparent',
              }}
            >
              Кружки
            </Button>

            <Button
              component={Link}
              to="/timetable"
              sx={{
                color: '#FFFFFF',
                minWidth: 'auto',
                px: { xs: 1, md: 1.5 },
                borderRadius: 0,
                borderBottom: isActive('/timetable') ? '2px solid #E6C98F' : '2px solid transparent',
              }}
            >
              Расписание
            </Button>

            <Button
              component={Link}
              to="/attendance"
              sx={{
                color: '#FFFFFF',
                minWidth: 'auto',
                px: { xs: 1, md: 1.5 },
                borderRadius: 0,
                borderBottom: location.pathname.startsWith('/attendance')
                  ? '2px solid #E6C98F'
                  : '2px solid transparent',
              }}
            >
              Журнал
            </Button>

            {user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                <Chip
                  label={`${user.full_name} (${user.role === 'teacher' ? 'Преп.' : 'Студ.'})`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.16)',
                    color: '#FFFFFF',
                    fontWeight: 600,
                  }}
                />
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: '#FFFFFF',
                    borderColor: 'rgba(255,255,255,0.4)',
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Выйти
                </Button>
              </Box>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                size="small"
                sx={{
                  ml: 1,
                  color: '#FFFFFF',
                  borderColor: '#E6C98F',
                  '&:hover': {
                    borderColor: '#FFFFFF',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Войти
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
