import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from 'store';
import type { TeamMember } from 'store/slices/teamSlice';
import {
  fetchTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  selectTeamMembers,
  selectTeamMembersLoading,
  selectTeamMembersError,
} from 'store/slices/teamSlice';

const Team: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const teamMembers = useSelector(selectTeamMembers);
  const isLoading = useSelector(selectTeamMembersLoading);
  const error = useSelector(selectTeamMembersError);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    dispatch(fetchTeamMembers());
  }, [dispatch]);

  const handleOpenDialog = (member?: TeamMember) => {
    if (member) {
      setSelectedMember(member);
      setFormData({
        name: member.name || '',
        email: member.email || '',
        role: member.role || '',
      });
    } else {
      setSelectedMember(null);
      setFormData({
        name: '',
        email: '',
        role: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMember(null);
    setFormData({
      name: '',
      email: '',
      role: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedMember) {
        await dispatch(updateTeamMember({ id: selectedMember._id, data: formData }));
      } else {
        await dispatch(createTeamMember(formData));
      }
      await dispatch(fetchTeamMembers());
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await dispatch(deleteTeamMember(id));
        await dispatch(fetchTeamMembers());
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body1">Loading team members...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body1" color="error">{error || 'An error occurred while loading team members'}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4, bgcolor: '#8e24aa08', p: 3, borderRadius: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ color: '#8e24aa' }}>
            Team Members
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#8e24aa',
              '&:hover': {
                bgcolor: '#6a1b9a'
              }
            }}
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Team Member
          </Button>
        </Box>

        {!teamMembers?.length ? (
          <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography color="text.secondary" gutterBottom>
              No team members found
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Get started by adding your first team member
            </Typography>
          </Box>
        ) : (
          <Paper sx={{ borderTop: '4px solid #8e24aa' }}>
            <List sx={{ bgcolor: '#8e24aa10', borderRadius: 1 }}>
            {teamMembers.map((member: TeamMember) => member ? (
              <ListItem
                key={member._id}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleOpenDialog(member)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(member._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar src={member.avatar}>
                    {member.name?.charAt(0) || '?'}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={member.name || 'Unnamed Member'}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {member.email || 'No email'}
                      </Typography>
                      <br />
                      <Chip
                        label={member.role || 'No role'}
                        size="small"
                        sx={{ color: '#8e24aa', borderColor: '#8e24aa' }}
                        variant="outlined"
                      />
                    </>
                  }
                />
              </ListItem>
            ) : null)}
            </List>
          </Paper>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: '#8e24aa' }}>
            {selectedMember ? 'Edit Team Member' : 'Add Team Member'}
          </DialogTitle>
          <Box component="form" onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {selectedMember ? 'Save Changes' : 'Add Member'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Team;
