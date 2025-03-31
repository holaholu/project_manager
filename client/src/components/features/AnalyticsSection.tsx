import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const AnalyticsSection = () => {
  return (
    <Box
      sx={{
        py: 12,
        mt: -1,
        background: 'linear-gradient(180deg, #3949ab 0%, #5c6bc0 100%)',
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
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(104, 117, 245, 0.1) 100%)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              p: 2,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
              alt="Analytics visualization"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
              }}
            />
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
              AI-Powered Risk Analysis
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9, fontWeight: 'normal' }}
            >
              Get intelligent risk assessments powered by GPT-4. Identify potential issues early,
              receive smart mitigation strategies, and ensure project success with AI insights.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AnalyticsSection;
