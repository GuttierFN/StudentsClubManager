import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box } from '@mui/material';

const TIMETABLE = [
  { id: 1, date: '15.10.2026', time: '18:00', club: 'Баскетбол', room: 'Ауд. 301' },
  { id: 2, date: '16.10.2026', time: '16:00', club: 'Воллейбол', room: 'Ауд. 101' },
  { id: 3, date: '15.10.2026', time: '15:30', club: 'Шахматы', room: 'Ауд. 410' },
  { id: 4, date: '25.10.2026', time: '17:00', club: 'Лёгкая атлетика', room: 'Ауд. 201' },
  { id: 5, date: '20.10.2026', time: '20:00', club: 'Футбол', room: 'Ауд. 212' },
  { id: 6, date: '18.10.2026', time: '19:00', club: 'Пение', room: 'Ауд. 310' },
  { id: 7, date: '16.10.2026', time: '16:30', club: 'Танцы', room: 'Ауд. 202' },
];

export default function Timetable() {
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
            </TableRow>
          </TableHead>

          <TableBody>
            {TIMETABLE.map((row) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}




