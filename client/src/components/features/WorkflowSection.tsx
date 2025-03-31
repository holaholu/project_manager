import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const workflowSteps: string[] = [
  'Create Project',
  'Plan & Assign Tasks',
  'AI Risk Analysis',
  'Track Progress',
  'Monitor & Improve',
];

const WorkflowSection = () => {
  return (
    <Box
      sx={{
        py: 12,
        mt: -1,
        background: 'linear-gradient(180deg, #7986cb 0%, #1a237e 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },

            gap: 6,
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              height: 400,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              p: 2,
            }}
          >
            {workflowSteps.map((step, index) => (
              <Box
                key={step}
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 28,
                    bottom: -16,
                    width: 2,
                    height: index === workflowSteps.length - 1 ? 0 : 16,
                    background: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  {index + 1}
                </Box>
                <Typography variant="h6">{step}</Typography>
              </Box>
            ))}
          </Box>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Smart Project Lifecycle
            </Typography>
            <Typography
              variant="h6"
              sx={{ 
                mb: 4, 
                opacity: 0.9,
                fontWeight: 'normal',
              }}
            >
              Guide your projects from inception to completion with our intelligent workflow.
              Create projects, plan tasks, analyze risks with AI, and monitor progress all in one place.
              tasks, set up approval chains, and ensure smooth project execution from
              start to finish.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default WorkflowSection;

