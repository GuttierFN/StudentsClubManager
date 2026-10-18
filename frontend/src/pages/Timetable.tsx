import { useState, useEffect } from 'react';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Box, CircularProgress, Alert, Fade } from '@mui/material';
import { Link } from 'react-router-dom';
import { SESSIONS } from '../entities/club/data';
import { SessionItem } from '../shared/types';

export default function Timetable() {
  const [timetable, setTimetable] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimetable(SESSIONS);
      setIsLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ color: '#4A2428', mb: 0.8 }}
        >
          Расписание занятий
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: '#806F70' }}
        >
          Предстоящие занятия студенческих кружков
        </Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress sx={{ color: '#76232F' }} />
        </Box>
      ) : timetable.length === 0 ? (
        <Alert severity="info">Расписание занятий пока не сформировано.</Alert>
      ) : (
        <Fade in timeout={500}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              border: '1px solid #E8DDD2',
              borderRadius: 1.5,
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: '#76232F',
                  }}
                >
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                    Дата
                  </TableCell>

                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                    Время
                  </TableCell>

                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                    Кружок
                  </TableCell>

                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>
                    Аудитория
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{ color: '#fff', fontWeight: 700 }}
                  >
                    Действие
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {timetable.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:nth-of-type(even)': {
                        backgroundColor: '#FBF6F0',
                      },

                      '&:hover': {
                        backgroundColor: '#F3E8DF',
                      },
                    }}
                  >
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.time}</TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: '#5F222C',
                      }}
                    >
                      {row.club}
                    </TableCell>

                    <TableCell>{row.room}</TableCell>

                    <TableCell align="right">
                      <Button
                        component={Link}
                        to={`/attendance/${row.id}`}
                        variant="outlined"
                        size="small"
                        sx={{
                          color: '#76232F',
                          borderColor: '#76232F',

                          '&:hover': {
                            borderColor: '#5A1823',
                            backgroundColor: '#F7ECE7',
                          },
                        }}
                      >
                        Журнал
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}
    </Box>
  );
}
