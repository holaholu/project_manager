import React, { useState, useEffect } from 'react';
import { sanitizeInput, validateProjectInput } from '../utils/validation';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  LinearProgress,
  Chip,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import * as d3 from 'd3';

import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { api } from '../utils/api';
import ProjectDetails from '../components/project/ProjectDetails';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  selectProjects,
  selectProjectsLoading,
  selectProjectsError,
} from '../store/slices/projectSlice';

type ProjectStatusType = 'Not Started' | 'In Progress' | 'Completed';

interface ChartProjectStatus {
  name: string;
  value: number;
  color?: string;
}

interface CompletionData {
  name: string;
  completion: number;
}

interface PieArcDatum {
  data: ChartProjectStatus;
  value: number;
  startAngle: number;
  endAngle: number;
  padAngle: number;
  index: number;
}

type ProjectTask = {
  description: string;
  status: string;
};

type BaseProject = {
  name: string;
  description: string;
  status: ProjectStatusType;
  progress: number;
  dueDate: string;
};

interface ProjectFormData extends BaseProject {
  tasks: string[];
}

type Project = BaseProject & {
  _id: string;
  tasks: ProjectTask[];
  members?: string[];
  createdBy?: string;
};

type ProjectFromStore = BaseProject & {
  _id: string;
  tasks: string[];
  members?: string[];
  createdBy?: string;
};

type ProjectWithOptionalTasks = Omit<Project, 'tasks'> & {
  tasks?: ProjectTask[];
};

type StoreProject = BaseProject & {
  _id: string;
  tasks: string[];
  members?: string[];
  createdBy?: string;
};

type StoreProjectInput = Omit<StoreProject, '_id'>;
type StoreProjectUpdate = Partial<StoreProjectInput>;
type ProjectState = StoreProject;
type ProjectCreateInput = StoreProjectInput;
type ProjectUpdateInput = StoreProjectUpdate;

const Projects: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const projectsFromStore = useSelector(selectProjects);
  const projects = projectsFromStore.map(p => ({
    ...p,
    tasks: (p.tasks || []).map(t => ({ description: t, status: 'Not Started' }))
  })) as Project[];
  const isLoading = useSelector(selectProjectsLoading);
  const error = useSelector(selectProjectsError);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<Project | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const PROJECT_STATUS = ['Not Started', 'In Progress', 'Completed'] as const;
  type ProjectStatusEnum = (typeof PROJECT_STATUS)[number];
  const isValidStatus = (value: string): value is ProjectStatusEnum =>
    PROJECT_STATUS.includes(value as any);

  // Calculate average completion
  const avgCompletion = projects.length > 0
    ? projects.reduce((acc, curr) => acc + curr.progress, 0) / projects.length
    : 0;

  const initialFormData: ProjectFormData = {
    name: '',
    description: '',
    status: 'Not Started' as ProjectStatusType,
    progress: 0,
    dueDate: new Date().toISOString().split('T')[0],
    tasks: []
  };

  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const [formErrors, setFormErrors] = useState<{ field: string; message: string }[]>([]);

  const handleCreateProject = async () => {
    try {
      // Convert form data to store format
      const projectData: StoreProjectInput = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        progress: Number(formData.progress) || 0,
        dueDate: formData.dueDate,
        tasks: formData.tasks
      };
      // Reset previous errors
      setFormErrors([]);

      // Sanitize inputs
      const sanitizedData = {
        ...formData,
        name: sanitizeInput(formData.name),
        description: sanitizeInput(formData.description)
      };

      // Validate inputs
      const validationErrors = validateProjectInput(sanitizedData.name, sanitizedData.description);
      if (validationErrors.length > 0) {
        setFormErrors(validationErrors);
        return;
      }

      // Create or update project
      if (selectedProject) {
        await dispatch(updateProject({ id: selectedProject._id, data: projectData }));
      } else {
        await dispatch(createProject(projectData));
      }

      setOpenDialog(false);
      setSelectedProject(null);
      setFormData(initialFormData);
    } catch (error) {
      console.error('Error handling project:', error);
    }
  };

  const handleOpenDialog = (project: Project | null = null) => {
    if (project) {
      setSelectedProject(project);
      const newFormData: ProjectFormData = {
        name: project.name,
        description: project.description,
        status: project.status,
        progress: project.progress || 0,
        dueDate: project.dueDate ? project.dueDate.split('T')[0] : new Date().toISOString().split('T')[0],
        tasks: project.tasks.map(task => task.description)
      };
      setFormData(newFormData);
    } else {
      setSelectedProject(null);
      setFormData(initialFormData);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProject(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedProject) {
        await dispatch(updateProject({ id: selectedProject._id, data: formData }));
      } else {
        await dispatch(createProject(formData));
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await dispatch(deleteProject(id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'in progress':
        return 'primary';
      case 'not started':
        return 'default';
      default:
        return 'default';
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography>Loading projects...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  // Calculate chart data
  const statusData: ChartProjectStatus[] = [
    {
      name: 'Not Started',
      value: projects.filter(p => p.status === 'Not Started').length,
      color: '#ff9800'
    },
    {
      name: 'In Progress',
      value: projects.filter(p => p.status === 'In Progress').length,
      color: '#2196f3'
    },
    {
      name: 'Completed',
      value: projects.filter(p => p.status === 'Completed').length,
      color: '#4caf50'
    }
  ];

  const completionData = [
    {
      name: 'Overall Progress',
      completion: projects.length > 0
        ? Math.round(projects.reduce((acc, proj) => acc + (proj.progress || 0), 0) / projects.length)
        : 0
    }
  ];

  return (
    <Container maxWidth="lg">
      {selectedProjectForDetails && (
        <Box sx={{ mb: 4 }}>
          <Button
            variant="text"
            onClick={() => setSelectedProjectForDetails(null)}
            sx={{ mb: 2 }}
          >
            ← Back to Projects
          </Button>
          <ProjectDetails project={selectedProjectForDetails} />
        </Box>
      )}
      <Box sx={{ mt: 4, mb: 4, bgcolor: '#00968808', p: 3, borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#009688' }}>
            Overview
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#009688',
              '&:hover': {
                bgcolor: '#00796b'
              }
            }}
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Project
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4, mb: 4 }}>
          <Card sx={{ p: 2, bgcolor: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#009688' }}>
                Project Status Distribution
              </Typography>
              <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                <div style={{ width: '100%', height: '100%' }} ref={(el) => {
                  if (el) {
                    // Clear previous SVG
                    d3.select(el).selectAll('svg').remove();

                    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
                    const width = el.clientWidth - margin.left - margin.right;
                    const height = el.clientHeight - margin.top - margin.bottom;

                    const svg = d3.select(el)
                      .append('svg')
                      .attr('width', width + margin.left + margin.right)
                      .attr('height', height + margin.top + margin.bottom)
                      .append('g')
                      .attr('transform', `translate(${width / 2},${height / 2})`);

                    // Create pie chart
                    const radius = Math.min(width, height) / 2 * 0.95; // Increased size to 95% of container

                    const pie = d3.pie<ChartProjectStatus>()
                      .value(d => d.value);

                    const arc = d3.arc<d3.PieArcDatum<ChartProjectStatus>>()
                      .innerRadius(0)
                      .outerRadius(radius);

                    const labelArc = d3.arc<d3.PieArcDatum<ChartProjectStatus>>()
                      .innerRadius(radius * 0.45) // Adjusted for better label positioning
                      .outerRadius(radius * 0.45);

                    const arcs = svg.selectAll('.arc')
                      .data(pie(statusData))
                      .enter()
                      .append('g')
                      .attr('class', 'arc');

                    // Add slices
                    arcs.append('path')
                      .attr('d', arc)
                      .style('fill', d => d.data.color || '#ccc')
                      .style('stroke', 'white')
                      .style('stroke-width', '2px');

                    // Add labels directly in the slices
                    arcs.append('text')
                      .attr('transform', d => {
                        const [x, y] = labelArc.centroid(d);
                        // Move the label based on the slice's angle
                        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                        // Adjust label distance from center based on text length
                        const offset = radius * (midAngle < Math.PI ? 0.3 : -0.3);
                        return `translate(${x + offset * 0.5}, ${y})`;
                      })
                      .style('text-anchor', 'middle')
                      .style('font-size', '11px')
                      .style('fill', 'white')
                      .style('font-weight', 'bold')
                      .each(function(d) {
                        const text = d3.select(this);
                        const label = `${d.data.name} (${d.data.value})`;
                        // Split label into two lines if it's too long
                        if (label.length > 15) {
                          text.append('tspan')
                            .attr('x', 0)
                            .attr('dy', '-0.5em')
                            .text(d.data.name);
                          text.append('tspan')
                            .attr('x', 0)
                            .attr('dy', '1.2em')
                            .text(`(${d.data.value})`);
                        } else {
                          text.text(label);
                        }
                      });
                  }
                }} />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ p: 2, bgcolor: 'white', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#009688' }}>
                Total Projects
              </Typography>
              <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                <div style={{ width: '100%', height: '100%' }} ref={(el) => {
                  if (el) {
                    // Clear previous SVG
                    d3.select(el).selectAll('svg').remove();

                    const margin = { top: 40, right: 20, bottom: 40, left: 40 };
                    const width = el.clientWidth - margin.left - margin.right;
                    const height = el.clientHeight - margin.top - margin.bottom;

                    const svg = d3.select(el)
                      .append('svg')
                      .attr('width', width + margin.left + margin.right)
                      .attr('height', height + margin.top + margin.bottom)
                      .append('g')
                      .attr('transform', `translate(${margin.left},${margin.top})`);

                    // Create bar chart data
                    const barData = [{ name: 'Projects', value: projects.length }];

                    const x = d3.scaleBand()
                      .range([0, width])
                      .domain(barData.map(d => d.name))
                      .padding(0.4);

                    const y = d3.scaleLinear()
                      .range([height, 0])
                      .domain([0, Math.max(barData[0].value, 5)]); // Set minimum domain to 5 for better visualization

                    // Add bar
                    svg.selectAll('.bar')
                      .data(barData)
                      .enter().append('rect')
                      .attr('class', 'bar')
                      .attr('x', d => x(d.name) || 0)
                      .attr('width', x.bandwidth())
                      .attr('y', d => y(d.value))
                      .attr('height', d => height - y(d.value))
                      .attr('fill', '#009688');

                    // Add X axis
                    svg.append('g')
                      .attr('transform', `translate(0,${height})`)
                      .call(d3.axisBottom(x))
                      .selectAll('text')
                      .style('text-anchor', 'middle');

                    // Add Y axis
                    svg.append('g')
                      .call(d3.axisLeft(y).ticks(5));

                    // Add value label
                    svg.selectAll('.label')
                      .data(barData)
                      .enter().append('text')
                      .attr('class', 'label')
                      .attr('x', d => (x(d.name) || 0) + x.bandwidth() / 2)
                      .attr('y', d => y(d.value) - 10)
                      .attr('text-anchor', 'middle')
                      .style('fill', '#009688')
                      .style('font-size', '16px')
                      .style('font-weight', 'bold')
                      .text(d => d.value);
                  }
                }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {projects && projects.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', m: -1 }}>
            {projects.map((project) => (
              project ? (
            <Box key={project._id} sx={{ width: { xs: '100%', md: '50%', lg: '33.33%' }, p: 1 }}>
              <Card sx={{ borderTop: '4px solid #009688' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {project.name || 'Untitled Project'}
                    </Typography>
                    <Chip
                      label={project.status}
                      size="small"
                      sx={{ 
                        bgcolor: '#00968820',
                        color: '#009688',
                        borderColor: '#009688'
                      }}
                      variant="outlined"
                    />
                  </Box>
                  <Typography color="textSecondary" gutterBottom>
                    Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {project.description || 'No description'}
                  </Typography>
                  <Box sx={{ width: '100%', mb: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress || 0}
                      sx={{
                        '& .MuiLinearProgress-bar': {
                          bgcolor: project.progress === 100 ? '#2e7d32' : '#009688'
                        },
                        bgcolor: '#00968820'
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Progress: {project.progress || 0}%
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => setSelectedProjectForDetails(project)}
                    sx={{ color: '#009688' }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(project)}
                    sx={{ color: '#009688' }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(project._id)}
                    sx={{ color: '#d32f2f' }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Box>
            ) : null
            ))}
          </Box>
        ) : (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography color="text.secondary">No projects found. Create your first project to get started!</Typography>
          </Box>
        )}

        <Dialog
          open={!!selectedProjectForDetails}
          onClose={() => setSelectedProjectForDetails(null)}
          maxWidth="lg"
          fullWidth
        >
          <DialogContent>
            {selectedProjectForDetails && (
              <ProjectDetails project={selectedProjectForDetails} />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedProjectForDetails(null)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {selectedProject ? 'Edit Project' : 'New Project'}
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Project Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: sanitizeInput(e.target.value) })
                  }
                  error={!!formErrors.find(err => err.field === 'name')}
                  helperText={formErrors.find(err => err.field === 'name')?.message}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: sanitizeInput(e.target.value) })
                  }
                  error={!!formErrors.find(err => err.field === 'description')}
                  helperText={formErrors.find(err => err.field === 'description')?.message}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e: SelectChangeEvent) => {
                      const value = e.target.value;
                      if (isValidStatus(value)) {
                        const newProgress = value === 'Completed' ? 100 : value === 'Not Started' ? 0 : formData.progress;
                        setFormData(prev => ({ ...prev, status: value, progress: newProgress }));
                      }
                    }}
                  >
                    {PROJECT_STATUS.map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ mt: 2 }}>
                  <Typography gutterBottom>Progress (%)</Typography>
                  <Slider
                    value={formData.progress}
                    onChange={(_, value) => {
                      if (formData.status === 'In Progress') {
                        setFormData({ ...formData, progress: value as number });
                      }
                    }}
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={0}
                    max={100}
                    disabled={formData.status !== 'In Progress'}
                    sx={{
                      '& .MuiSlider-thumb': {
                        color: formData.status === 'Completed' ? '#2e7d32' : '#009688',
                      },
                      '& .MuiSlider-track': {
                        color: formData.status === 'Completed' ? '#2e7d32' : '#009688',
                      },
                      '& .MuiSlider-rail': {
                        color: '#00968820',
                      },
                    }}
                  />
                </Box>
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
              <Button type="submit" variant="contained" color="primary">
                {selectedProject ? 'Save Changes' : 'Create Project'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Projects;
