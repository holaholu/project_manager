import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  LinearProgress,
} from '@mui/material';
import RiskAnalysis from '../risk/RiskAnalysis';

interface ProjectDetailsProps {
  project: {
    _id: string;
    name: string;
    description: string;
    status: string;
    progress: number;
    dueDate: string;
    tasks?: Array<{ description: string; status: string }>;
  };
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'In Progress':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ width: '100%' }}>
      <Box sx={{ flex: { xs: '1', md: '2' } }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {project.name}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={project.status}
                color={getStatusColor(project.status) as any}
                sx={{ mr: 1 }}
              />
              <Chip
                label={`Due: ${new Date(project.dueDate).toLocaleDateString()}`}
                variant="outlined"
              />
            </Box>
            <Typography color="text.secondary" paragraph>
              {project.description}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Progress
              </Typography>
              <LinearProgress
                variant="determinate"
                value={project.progress}
                sx={{ height: 8, borderRadius: 2 }}
              />
              <Typography variant="body2" color="text.secondary" align="right" sx={{ mt: 0.5 }}>
                {project.progress}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      <Box sx={{ flex: '1' }}>
        <RiskAnalysis
          projectData={{
            description: project.description,
            deadline: project.dueDate,
            tasks: project.tasks || []
          }}
        />
      </Box>
    </Stack>
  );
};

export default ProjectDetails;
