import { Typography, Paper, FormGroup, FormControlLabel, Checkbox, Button, Box, Divider } from '@mui/material';

const STUDENTS = ['Печерский Д. А.', 'Гутник Е. И.', 'Еременко Г. К.', 'Орлов А. А.', 'Гасанов К. У.'];

export default function Attendance() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        maxWidth: 700,
        mx: 'auto',
        border: '1px solid #E8DDD2',
        borderRadius: 1.5,
        backgroundColor: '#FFFCF7',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: '#4A2428',
          mb: 1,
        }}
      >
        Журнал посещаемости
      </Typography>

      <Typography
        variant="subtitle1"
        sx={{
          color: '#806F70',
          mb: 3,
        }}
      >
        Занятие: Баскетбол · 25.10.2026
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box sx={{ mb: 3 }}>
        <FormGroup>
          {STUDENTS.map((student, idx) => (
            <FormControlLabel
              key={idx}
              control={
                <Checkbox
                  defaultChecked={idx % 2 === 0}
                  sx={{
                    color: '#76232F',

                    '&.Mui-checked': {
                      color: '#76232F',
                    },
                  }}
                />
              }
              label={student}
              sx={{
                py: 0.7,
              }}
            />
          ))}
        </FormGroup>
      </Box>

      <Button
        variant="contained"
        fullWidth
        sx={{
          py: 1.3,
        }}
      >
        Сохранить отметки
      </Button>
    </Paper>
  );
}




