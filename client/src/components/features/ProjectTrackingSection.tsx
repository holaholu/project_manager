import React from 'react';
import { Box, Container, Typography, useTheme } from '@mui/material';

const ProjectTrackingSection = () => {
  const theme = useTheme();

  return (
    <Box
      id="features"
      sx={{
        py: 12,
        mt: -1,
        background: 'linear-gradient(180deg, #1a237e 0%, #3949ab 100%)',
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
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Visual Progress Tracking
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9, fontWeight: 'normal' }}
            >
              Track project completion with intuitive progress bars and visual analytics.
              Organize tasks efficiently and get real-time status updates on your projects.
            </Typography>
          </Box>
          <Box
            sx={{
              height: 400,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(104, 117, 245, 0.1) 100%)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              p: 2,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1542626991-cbc4e32524cc?auto=format&fit=crop&w=800&q=80"
              alt="Project tracking visualization"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ProjectTrackingSection;
