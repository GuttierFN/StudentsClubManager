import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Container } from '@mui/material';
import Navbar from './components/Navbar';
import ClubsList from './pages/ClubsList';
import ClubDetails from './pages/ClubDetails';
import Timetable from './pages/Timetable';
import Attendance from './pages/Attendance';

const theme = createTheme({
  palette: {
    primary: {
      main: '#76232F',
      dark: '#5A1823',
      light: '#9A4652',
      contrastText: '#FFFFFF',
    },

    secondary: {
      main: '#C9A66B',
    },

    background: {
      default: '#F8F2E9',
      paper: '#FFFCF7',
    },

    text: {
      primary: '#342526',
      secondary: '#76686A',
    },
  },

  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),

    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },

    h5: {
      fontWeight: 650,
    },

    h6: {
      fontWeight: 650,
    },

    button: {
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.3px',
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F8F2E9',
        },

        '*': {
          boxSizing: 'border-box',
        },

        '::selection': {
          backgroundColor: '#76232F',
          color: '#FFFFFF',
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          boxShadow: 'none',
          padding: '9px 18px',

          '&:hover': {
            boxShadow: 'none',
          },
        },

        containedPrimary: {
          backgroundColor: '#76232F',

          '&:hover': {
            backgroundColor: '#5A1823',
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFCF7',
          border: '1px solid #E8DDD2',
          boxShadow: '0 2px 8px rgba(73, 42, 39, 0.08)',
          transition: 'all 0.2s ease',

          '&:hover': {
            boxShadow: '0 8px 24px rgba(73, 42, 39, 0.14)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container 
          maxWidth="lg"
          sx={{
            mt: { xs: 3, md: 5 },
            mb: 6,
          }}
        >
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




