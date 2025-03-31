import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Tooltip,
  Divider,
  alpha,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Email as EmailIcon,
  Javascript as JavaScriptIcon,
  Code as ReactIcon,
  Storage as MongoDBIcon,
  Language as ExpressIcon,
  CloudQueue as NodeIcon,
  SmartToy as SmartToyIcon,
} from '@mui/icons-material';

interface AuthFooterProps {
  color?: string;
}

export const AuthFooter: React.FC<AuthFooterProps> = ({ color = '#2196f3' }) => {
  const techStack = [
    { name: 'React', icon: <ReactIcon />, url: 'https://reactjs.org/' },
    { name: 'TypeScript', icon: <JavaScriptIcon />, url: 'https://www.typescriptlang.org/' },
    { name: 'Node.js', icon: <NodeIcon />, url: 'https://nodejs.org/' },
    { name: 'Express', icon: <ExpressIcon />, url: 'https://expressjs.com/' },
    { name: 'MongoDB', icon: <MongoDBIcon />, url: 'https://www.mongodb.com/' },
    { name: 'GPT-4 AI', icon: <SmartToyIcon />, url: 'https://openai.com/gpt-4' },
  ];

  const handleContact = () => {
    window.location.href = 'mailto:olaoluhimself@yahoo.com';
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 4,
        backgroundColor: (theme) => alpha(color, 0.03),
        borderTop: `1px solid ${alpha(color, 0.1)}`,
        width: '100%',
      }}
    >
      <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: color }}>
            Tech Stack
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            {techStack.map((tech) => (
              <Tooltip key={tech.name} title={tech.name}>
                <Link
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    color: alpha(color, 0.8),
                    textDecoration: 'none',
                    '&:hover': {
                      color: color,
                    },
                  }}
                >
                  {tech.icon}
                  <Typography variant="body2">{tech.name}</Typography>
                </Link>
              </Tooltip>
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ mb: 2 }}>
          <IconButton
            href="https://github.com/holaholu"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mx: 1 }}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            href="https://www.linkedin.com/in/olaoluadisa/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mx: 1 }}
          >
            <LinkedInIcon />
          </IconButton>
          <IconButton onClick={handleContact} sx={{ mx: 1 }}>
            <EmailIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Ola Adisa. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};
