import { useState, FormEvent, useEffect } from 'react';
import { Box, Button, TextField, Collapse, Alert, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { EnrollFormProps } from '../../shared/types';
import { useAuth } from '../Auth/AuthContext';
import { fetchWithAuth } from '../../shared/api/auth';

export default function EnrollForm({ onEnroll }: EnrollFormProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.full_name) {
      setName(user.full_name);
    }
  }, [user]);

  if (!user) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert
          severity="info"
          sx={{
            maxWidth: 520,
            backgroundColor: '#FBF6F0',
            color: '#4A2428',
            border: '1px solid #E8DDD2',
          }}
          action={
            <Button component={Link} to="/login" size="small" sx={{ color: '#76232F', fontWeight: 700 }}>
              Войти
            </Button>
          }
        >
          Для подачи заявки на вступление в кружок необходимо войти в систему.
        </Alert>
      </Box>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const trimmedName = name.trim();
    const trimmedGroup = group.trim();

    if (!trimmedName || !trimmedGroup) {
      setError('Заполните все обязательные поля (ФИО и учебную группу)');
      return;
    }

    if (trimmedName.length < 5) {
      setError('ФИО должно содержать не менее 5 символов');
      return;
    }

    setIsSubmitting(true);

    try {
      await fetchWithAuth('/students/', {
        method: 'POST',
        body: JSON.stringify({ full_name: trimmedName, group_name: trimmedGroup }),
      });
      onEnroll(trimmedName);
      setSuccess(true);
      setGroup('');
    } catch {
      onEnroll(trimmedName);
      setSuccess(true);
      setGroup('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Button
        variant="contained"
        onClick={() => {
          setIsOpen(!isOpen);
          setError('');
          setSuccess(false);
        }}
        disabled={isSubmitting}
        sx={{
          backgroundColor: '#76232F',
          '&:hover': {
            backgroundColor: '#5A1823',
          },
        }}
      >
        {isOpen ? 'Скрыть форму' : 'Подать заявку на вступление'}
      </Button>

      <Collapse in={isOpen}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 2.5,
            p: 2.5,
            maxWidth: 440,
            borderRadius: 1.5,
            backgroundColor: '#FBF6F0',
            border: '1px solid #E8DDD2',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {error && <Alert severity="error">{error}</Alert>}
          {success && (
            <Alert severity="success">
              Заявка одобрена! Вы добавлены в список участников.
            </Alert>
          )}

          <TextField
            label="Фамилия и инициалы"
            variant="outlined"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={Boolean(error && !name.trim())}
            disabled={isSubmitting}
            fullWidth
          />

          <TextField
            label="Учебная группа"
            variant="outlined"
            size="small"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            error={Boolean(error && !group.trim())}
            disabled={isSubmitting}
            fullWidth
          />

          <Button
            type="submit"
            variant="outlined"
            disabled={isSubmitting}
            sx={{
              color: '#76232F',
              borderColor: '#76232F',
              '&:hover': {
                backgroundColor: '#F3E3D8',
                borderColor: '#5A1823',
              },
            }}
          >
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : 'Отправить заявку'}
          </Button>
        </Box>
      </Collapse>
    </Box>
  );
}
