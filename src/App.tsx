import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Container } from '@mui/material';
import Navbar from './components/Navbar';
import ClubsList from './pages/ClubsList';
import ClubDetails from './pages/ClubDetails';
import Timetable from './pages/Timetable';
import Attendance from './pages/Attendance';

const theme = createTheme({
  palette: { primary: { main: '#1976d2' } },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<ClubsList />} />
            <Route path="/clubs/:id" element={<ClubDetails />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}




