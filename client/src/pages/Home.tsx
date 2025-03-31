import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';
import { AuthFooter } from '../components/layout/AuthFooter';
import ProjectTrackingSection from '../components/features/ProjectTrackingSection';
import AnalyticsSection from '../components/features/AnalyticsSection';
import TeamSection from '../components/features/TeamSection';
import WorkflowSection from '../components/features/WorkflowSection';
import ImageSlideshow from '../components/common/ImageSlideshow';



const Home = () => {
  const theme = useTheme();

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          right: '10%',
          zIndex: 1000,
          p: 2,
          '@media (max-width: 600px)': {
            right: '5%',
          },
        }}
      >
        <Stack direction="row" spacing={3}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(104, 117, 245, 0.15) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(31, 38, 135, 0.2)',
              },
            }}
          >
            <Button
              onClick={scrollToFeatures}
              sx={{
                color: '#E3F2FD',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                px: 3,
                py: 1,
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Features
            </Button>
          </Box>
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(104, 117, 245, 0.15) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(31, 38, 135, 0.2)',
              },
            }}
          >
            <Button
              component={RouterLink}
              to="/register"
              sx={{
                color: '#E3F2FD',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                px: 3,
                py: 1,
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Get Started
            </Button>
          </Box>
          <Box
            sx={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(104, 117, 245, 0.15) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(31, 38, 135, 0.2)',
              },
            }}
          >
            <Button
              component={RouterLink}
              to="/login"
              sx={{
                color: '#E3F2FD',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                px: 3,
                py: 1,
                '&:hover': {
                  color: 'white',
                  backgroundColor: 'transparent',
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Stack>
      </Box>
      {/* Hero Section */}
      <Box
        sx={{
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ImageSlideshow
          images={[
            'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80',
            'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1920&q=80'
          ]}
        />
        <Container maxWidth="lg">
          <Box sx={{ display: 'grid', gap: 6, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, alignItems: 'center' }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(104, 117, 245, 0.15) 100%)',
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                p: 4,
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Smart Project Management with AI
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Modern project management enhanced with GPT-4 powered risk analysis, smart progress tracking, and intuitive task management.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.common.white, 0.9),
                    },
                  }}
                >
                  Get Started
                </Button>
              </Stack>
            </Box>
            <Box>
              {/* You can add an illustration or image here */}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Feature Sections */}
      <ProjectTrackingSection />
      <AnalyticsSection />
      <TeamSection />
      <WorkflowSection />
      <AuthFooter color="#2196f3" />
    </Box>
  );
};

export default Home;
