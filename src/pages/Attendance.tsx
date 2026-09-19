import { Typography, Paper, FormGroup, FormControlLabel, Checkbox, Button, Box } from '@mui/material';

const STUDENTS = ['Печерский Д. А.', 'Гутник Е. И.', 'Еременко Г. К.', 'Орлов А. А.', 'Гасанов К. У.'];

export default function Attendance() {
  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Журнал посещаемости</Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Занятие: Баскетбол (25.10.2026)
      </Typography>
      
      <Box sx={{ my: 3 }}>
        <FormGroup>
          {STUDENTS.map((student, idx) => (
            <FormControlLabel 
              key={idx} 
              control={<Checkbox defaultChecked={idx % 2 === 0} />} 
              label={student} 
            />
          ))}
        </FormGroup>
      </Box>

      <Button variant="contained" fullWidth>Сохранить отметки</Button>
    </Paper>
  );
}




