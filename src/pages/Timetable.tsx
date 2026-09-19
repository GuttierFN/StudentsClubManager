import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

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
    <div>
      <Typography variant="h4" gutterBottom>Расписание занятий</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Дата</b></TableCell>
              <TableCell><b>Время</b></TableCell>
              <TableCell><b>Кружок</b></TableCell>
              <TableCell><b>Аудитория</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TIMETABLE.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.time}</TableCell>
                <TableCell>{row.club}</TableCell>
                <TableCell>{row.room}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}




