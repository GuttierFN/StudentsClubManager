import { useState, FormEvent } from 'react';
import { Box, Paper, Typography, TextField, Button, Tabs, Tab, Alert, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/Auth/AuthContext';
import { UserRole } from '../shared/types';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Заполните логин и пароль');
      return;
    }

    if (tab === 'register') {
      if (!fullName.trim()) {
        setError('Укажите ФИО');
        return;
      }
      if (password.length < 6) {
        setError('Пароль должен содержать не менее 6 символов');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (tab === 'login') {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), fullName.trim(), password, role);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка авторизации');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 460, mx: 'auto', mt: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          border: '1px solid #E8DDD2',
          borderRadius: 1.5,
          backgroundColor: '#FFFCF7',
        }}
      >
        <Typography variant="h4" sx={{ color: '#4A2428', mb: 1, textAlign: 'center' }}>
          Авторизация
        </Typography>
        <Typography variant="body2" sx={{ color: '#806F70', mb: 3, textAlign: 'center' }}>
          Войдите в аккаунт или зарегистрируйтесь для работы с системой
        </Typography>

        <Tabs
          value={tab}
          onChange={(_, newValue) => {
            setTab(newValue);
            setError('');
          }}
          variant="fullWidth"
          sx={{
            mb: 3,
            borderBottom: '1px solid #E8DDD2',
            '& .MuiTab-root': { color: '#806F70', fontWeight: 600 },
            '& .Mui-selected': { color: '#76232F !important' },
            '& .MuiTabs-indicator': { backgroundColor: '#76232F' },
          }}
        >
          <Tab label="Вход" value="login" />
          <Tab label="Регистрация" value="register" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2.5 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Логин"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isSubmitting}
            fullWidth
          />

          {tab === 'register' && (
            <>
              <TextField
                label="Фамилия и инициалы (например, Иванов И. И.)"
                size="small"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSubmitting}
                fullWidth
              />

              <FormControl size="small" fullWidth>
                <InputLabel>Роль в системе</InputLabel>
                <Select
                  value={role}
                  label="Роль в системе"
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  disabled={isSubmitting}
                >
                  <MenuItem value="student">Студент (запись в кружки)</MenuItem>
                  <MenuItem value="teacher">Преподаватель (ведение журнала и кружков)</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <TextField
            label="Пароль"
            type="password"
            size="small"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{
              mt: 1,
              py: 1.2,
              backgroundColor: '#76232F',
              '&:hover': { backgroundColor: '#5A1823' },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={22} color="inherit" />
            ) : tab === 'login' ? (
              'Войти в систему'
            ) : (
              'Зарегистрироваться'
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}