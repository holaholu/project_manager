import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import Lottie from 'lottie-react';
import teamAnimation from '../../assets/animations/team-collaboration.json';

const TeamSection = () => {
  return (
    <Box
      sx={{
        py: 12,
        mt: -1,
        background: 'linear-gradient(180deg, #5c6bc0 0%, #7986cb 100%)',
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
              Task Management & Collaboration
            </Typography>
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9, fontWeight: 'normal' }}
            >
              Manage tasks efficiently with our intuitive interface. Create and assign tasks,
              track deadlines, and collaborate seamlessly with your team in real-time.
              Keep everyone aligned and productive.
            </Typography>
          </Box>
          <Box
            sx={{
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(104, 117, 245, 0.1) 100%)',
              backdropFilter: 'blur(8px)',
              borderRadius: 2,
              p: 2,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.1)',
            }}
          >
            <Lottie
              animationData={teamAnimation}
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TeamSection;
