import React, { useState, useEffect } from 'react';
import { predictTaskPriority, suggestTaskCategory } from '../utils/ai';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { api } from '../utils/api';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
  selectTasks,
  selectTasksLoading,
  selectTasksError,
} from '../store/slices/taskSlice';
import {
  fetchProjects,
  selectProjects,
} from '../store/slices/projectSlice';

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

interface Project {
  _id: string;
  name: string;
}

interface TeamMember {
  _id: string;
  name: string;
}

export const Tasks = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tasks = useSelector(selectTasks);
  const projects = useSelector(selectProjects);
  const isLoading = useSelector(selectTasksLoading);
  const error = useSelector(selectTasksError);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  // Valid enum values for status and priority
  const STATUS_OPTIONS = ['todo', 'in-progress', 'completed'] as const;
  const PRIORITY_OPTIONS = ['low', 'medium', 'high'] as const;

  // For display purposes
  const STATUS_LABELS: Record<typeof STATUS_OPTIONS[number], string> = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'completed': 'Completed'
  };

  const PRIORITY_LABELS: Record<typeof PRIORITY_OPTIONS[number], string> = {
    'low': 'Low',
    'medium': 'Medium',
    'high': 'High'
  };

  const [aiSuggestions, setAiSuggestions] = useState<{
    priority?: string;
    category?: string;
  }>({});

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    status: typeof STATUS_OPTIONS[number];
    priority: typeof PRIORITY_OPTIONS[number];
    dueDate: string;
    project: string;
    assignedTo: string;
  }>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    project: '',
    assignedTo: '',
  });

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
    fetchTeamMembers();
  }, [dispatch]);



  const fetchTeamMembers = async () => {
    try {
      const response = await api.get('/teams');
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleOpenDialog = (task?: Task) => {
    console.log('Opening dialog with task:', task);
    if (task) {
      setSelectedTask(task);
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status as typeof STATUS_OPTIONS[number],
        priority: task.priority as typeof PRIORITY_OPTIONS[number],
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        project: task.project?._id || '',
        assignedTo: task.assignedTo?._id || '',
      });
    } else {
      setSelectedTask(null);
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        project: '',
        assignedTo: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    console.log('Closing dialog');
    setOpenDialog(false);
    setSelectedTask(null);
    const defaultStatus: typeof STATUS_OPTIONS[number] = 'todo';
    const defaultPriority: typeof PRIORITY_OPTIONS[number] = 'medium';
    
    setFormData({
      title: '',
      description: '',
      status: defaultStatus,
      priority: defaultPriority,
      dueDate: new Date().toISOString().split('T')[0],
      project: '',
      assignedTo: '',
    });
  };

  const handleDescriptionChange = async (description: string) => {
    setFormData(prev => ({ ...prev, description }));
    
    // Only trigger AI when description is substantial
    if (description.length > 20) {
      const [priority, category] = await Promise.all([
        predictTaskPriority(description),
        suggestTaskCategory(description)
      ]);

      if (priority.success || category.success) {
        setAiSuggestions({
          priority: priority.success ? priority.data : undefined,
          category: category.success ? category.data : undefined
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = {
      title: formData.title,
      project: formData.project,
      assignedTo: formData.assignedTo
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return;
    }

    // Validate required fields
    if (!formData.title.trim() || !formData.description.trim() || !formData.project || !formData.assignedTo || !formData.dueDate) {
      console.error('Missing required fields');
      return;
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      dueDate: formData.dueDate,
      project: formData.project,  // Changed from projectId
      assignedTo: formData.assignedTo,  // Changed from assignedToId
      createdBy: '65f8f3c1e32f6c266c9b7c9d' // TODO: Get from auth context
    };

    console.log('Form data:', formData);
    console.log('Task data to be sent:', taskData);

    console.log('Submitting task data:', taskData);

    try {
      if (selectedTask) {
        const result = await dispatch(updateTask({ 
          id: selectedTask._id, 
          data: {
            ...taskData,
            project: { _id: taskData.project, name: '' },
            assignedTo: { _id: taskData.assignedTo, name: '' }
          }
        })).unwrap();
        console.log('Task updated:', result);
      } else {
        const result = await dispatch(createTask(taskData)).unwrap();
        console.log('Task created:', result);
      }
      handleCloseDialog();
    } catch (error: any) {
      console.error('Error saving task:', error);
      console.error('Server response:', error.response?.data);
      // Keep the dialog open on error
      return;
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(id)).unwrap();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'to do':
        return 'default';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body1">Loading tasks...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body1" color="error">{error || 'An error occurred while loading tasks'}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4, bgcolor: '#ff572208', p: 3, borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#ff5722' }}>
            Tasks Overview
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#ff5722',
              '&:hover': {
                bgcolor: '#f4511e'
              }
            }}
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Task
          </Button>
        </Box>

        {tasks && tasks.length > 0 ? (
          <TableContainer component={Paper} sx={{ borderTop: '4px solid #ff5722' }}>
            <Table>
              <TableHead>
              <TableRow sx={{ bgcolor: '#ff572208' }}>
                <TableCell sx={{ color: '#ff5722', fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ color: '#ff5722', fontWeight: 'bold' }}>Project</TableCell>
                <TableCell sx={{ color: '#ff5722', fontWeight: 'bold' }}>Assigned To</TableCell>
                <TableCell sx={{ color: '#ff5722', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: '#ff5722', fontWeight: 'bold' }}>Priority</TableCell>
                <TableCell sx={{ color: '#ff5722', fontWeight: 'bold' }}>Due Date</TableCell>
                <TableCell sx={{ color: '#ff5722', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks && tasks.map((task: Task) => task && (
                <TableRow key={task._id}>
                  <TableCell>{task.title || 'Untitled'}</TableCell>
                  <TableCell>{task.project?.name || 'No Project'}</TableCell>
                  <TableCell>{task.assignedTo?.name || 'Unassigned'}</TableCell>
                  <TableCell>
                    <Chip
                      label={task.status}
                      size="small"
                      sx={{ 
                        bgcolor: '#ff572220',
                        color: '#ff5722',
                        borderColor: '#ff5722'
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      size="small"
                      sx={{ 
                        bgcolor: task.priority.toLowerCase() === 'high' ? '#d32f2f20' : 
                               task.priority.toLowerCase() === 'medium' ? '#ed6c0220' : '#2e7d3220',
                        color: task.priority.toLowerCase() === 'high' ? '#d32f2f' : 
                              task.priority.toLowerCase() === 'medium' ? '#ed6c02' : '#2e7d32',
                        borderColor: task.priority.toLowerCase() === 'high' ? '#d32f2f' : 
                                    task.priority.toLowerCase() === 'medium' ? '#ed6c02' : '#2e7d32'
                      }}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleOpenDialog(task)}
                      sx={{ color: '#ff5722' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(task._id)}
                      sx={{ color: '#d32f2f' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        ) : (
          <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#ff572208', borderRadius: 1, border: '1px dashed #ff5722' }}>
            <Typography color="text.secondary" gutterBottom>
              No tasks found
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Get started by creating your first task
            </Typography>
          </Box>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: '#ff5722' }}>
            {selectedTask ? 'Edit Task' : 'New Task'}
          </DialogTitle>
          <DialogContent>
            <Box component="form" id="task-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="title"
                label="Task Title"
                value={formData.title}
                onChange={(e) => {
                  console.log('Title changed:', e.target.value);
                  setFormData({ ...formData, title: e.target.value });
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
              />
              {aiSuggestions.priority && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  🤖 AI Suggests: {aiSuggestions.priority.split(' ')[0]} priority
                  <Button
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      priority: aiSuggestions.priority!.split(' ')[0] as typeof PRIORITY_OPTIONS[number]
                    }))}
                  >
                    Apply
                  </Button>
                </Alert>
              )}
              {aiSuggestions.category && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  🤖 Suggested Category: {aiSuggestions.category}
                  <Button
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => {
                      // Find a project that matches the suggested category
                      const matchingProject = projects.find(p => 
                        p.name.toLowerCase().includes(aiSuggestions.category!.toLowerCase())
                      );
                      if (matchingProject) {
                        setFormData(prev => ({
                          ...prev,
                          project: matchingProject._id
                        }));
                      }
                    }}
                  >
                    Apply
                  </Button>
                </Alert>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                select
                label="Project"
                value={formData.project}
                onChange={(e) =>
                  setFormData({ ...formData, project: e.target.value })
                }
              >
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="normal"
                required
                fullWidth
                select
                label="Assigned To"
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
              >
                {teamMembers.map((member) => (
                  <MenuItem key={member._id} value={member._id}>
                    {member.name}
                  </MenuItem>
                ))}
              </TextField>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e: SelectChangeEvent) =>
                    setFormData({ ...formData, status: e.target.value as typeof STATUS_OPTIONS[number] })
                  }
                >
                  {STATUS_OPTIONS.map((status) => (
                    <MenuItem key={status} value={status}>{STATUS_LABELS[status]}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  onChange={(e: SelectChangeEvent) =>
                    setFormData({ ...formData, priority: e.target.value as typeof PRIORITY_OPTIONS[number] })
                  }
                >
                  {PRIORITY_OPTIONS.map((priority) => (
                    <MenuItem key={priority} value={priority}>{PRIORITY_LABELS[priority]}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="normal"
                required
                fullWidth
                type="date"
                label="Due Date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              type="submit"
              form="task-form"
              variant="contained" 
              color="primary"
              sx={{
                bgcolor: '#ff5722',
                '&:hover': {
                  bgcolor: '#f4511e'
                }
              }}
            >
              {selectedTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Tasks;
