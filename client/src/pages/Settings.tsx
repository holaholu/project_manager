import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Grid,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { api } from '../utils/api';

export const Settings = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    try {
      await api.post('/users/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4, bgcolor: '#455a6408', p: 3, borderRadius: 1 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#455a64', mb: 3 }}>
          Account Settings
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Paper sx={{ p: 3, mb: 3, borderTop: '4px solid #455a64' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#455a64' }}>
                Profile Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1">
                  {user?.name}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">
                  {user?.email}
                </Typography>
              </Box>
            </Paper>
          </Box>

          <Box>
            <Paper sx={{ p: 3, borderTop: '4px solid #455a64' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#455a64' }}>
                Change Password
              </Typography>
              {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                  {message.text}
                </Alert>
              )}
              <Box component="form" onSubmit={handlePasswordChange}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="password"
                  label="Current Password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="password"
                  label="New Password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                />
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 2,
                    bgcolor: '#455a64',
                    '&:hover': {
                      bgcolor: '#37474f'
                    }
                  }}
                >
                  Update Password
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Settings;
