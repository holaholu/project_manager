import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { AppDispatch } from '../store';
import {
  fetchProjects,
  selectProjects,
  selectProjectsLoading,
  selectProjectsError,
} from '../store/slices/projectSlice';
import {
  fetchTasks,
  selectTasks,
  selectTasksLoading,
  selectTasksError,
} from '../store/slices/taskSlice';

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  dueDate: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  project: {
    _id: string;
    name: string;
  };
  assignedTo: {
    _id: string;
    name: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'in progress':
      return 'primary';
    case 'review':
      return 'warning';
    default:
      return 'default';
  }
};

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const projects = useSelector(selectProjects);
  const tasks = useSelector(selectTasks);
  const isProjectsLoading = useSelector(selectProjectsLoading);
  const isTasksLoading = useSelector(selectTasksLoading);
  const projectsError = useSelector(selectProjectsError);
  const tasksError = useSelector(selectTasksError);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchTasks());
  }, [dispatch]);

  if (isProjectsLoading || isTasksLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (projectsError || tasksError) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{projectsError || tasksError}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, bgcolor: '#3f51b508' }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#3f51b5', mb: 3 }}>
        Dashboard Overview
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
        {/* Recent Tasks */}
        <Paper sx={{ p: 2, borderTop: '4px solid #3f51b5' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5' }}>
            Recent Tasks
          </Typography>
          {tasks && tasks.length > 0 ? (
            <List>
              {tasks.filter(task => task && task.project).slice(0, 5).map((task: Task) => (
                <ListItem key={task._id} divider>
                  <ListItemText
                    primary={task.title}
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" component="span" color="text.secondary">
                          Project: {task.project?.name || 'Unassigned'}
                        </Typography>
                        <br />
                        <Typography variant="body2" component="span" color="text.secondary">
                          Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Chip
                      label={task.status}
                      sx={{ 
                        bgcolor: '#3f51b520',
                        color: '#3f51b5',
                        borderColor: '#3f51b5'
                      }}
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={task.priority}
                      color={task.priority.toLowerCase() === 'high' ? 'error' : task.priority.toLowerCase() === 'medium' ? 'warning' : 'default'}
                      size="small"
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No tasks found. Create your first task to get started!
            </Typography>
          )}
        </Paper>
        {/* Project Overview */}
        <Paper sx={{ p: 2, borderTop: '4px solid #3f51b5' }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#3f51b5' }}>
              Project Overview
            </Typography>
            {projects && projects.length > 0 ? (
              projects.map((project: Project) => (
                <Box key={project._id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">{project.name}</Typography>
                    <Chip
                      label={project.status}
                      color={getStatusColor(project.status) as any}
                      size="small"
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={project.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {project.progress}% Complete
                  </Typography>
              </Box>
            ))) : (
              <Typography variant="body1" color="text.secondary">
                No projects found. Create your first project to get started!
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Quick Stats */}
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr 1fr' } }}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Projects
              </Typography>
              <Typography variant="h4">{projects ? projects.length : 0}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Tasks
              </Typography>
              <Typography variant="h4">{tasks ? tasks.length : 0}</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};
