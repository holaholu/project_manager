
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material';
import { store } from './store';
import { MainLayout } from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/Home';
import { Settings } from './pages/Settings';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Team from './pages/Team';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

declare module '@mui/material/styles' {
  interface Palette {
    sections: {
      dashboard: string;
      projects: string;
      tasks: string;
      team: string;
      settings: string;
    };
  }
  interface PaletteOptions {
    sections?: {
      dashboard?: string;
      projects?: string;
      tasks?: string;
      team?: string;
      settings?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    sections: {
      dashboard: '#3f51b5', // Indigo - Professional and trustworthy
      projects: '#009688', // Teal - Growth and stability
      tasks: '#ff5722', // Deep Orange - Energy and productivity
      team: '#8e24aa', // Purple - Creativity and collaboration
      settings: '#455a64', // Blue Grey - Technical and reliable
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/app" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="team" element={<Team />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
