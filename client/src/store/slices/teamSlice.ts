import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';
import { RootState } from '../';

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface TeamState {
  members: TeamMember[];
  loading: boolean;
  error: string | null;
}

const initialState: TeamState = {
  members: [],
  loading: true,
  error: null,
};

export const fetchTeamMembers = createAsyncThunk(
  'team/fetchTeamMembers',
  async () => {
    const response = await api.get('/teams');
    return response.data;
  }
);

export const createTeamMember = createAsyncThunk(
  'team/createTeamMember',
  async (memberData: Partial<TeamMember>) => {
    const response = await api.post('/teams', memberData);
    return response.data;
  }
);

export const updateTeamMember = createAsyncThunk(
  'team/updateTeamMember',
  async ({ id, data }: { id: string; data: Partial<TeamMember> }) => {
    const response = await api.put(`/teams/${id}`, data);
    return response.data;
  }
);

export const deleteTeamMember = createAsyncThunk(
  'team/deleteTeamMember',
  async (id: string) => {
    await api.delete(`/teams/${id}`);
    return id;
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeamMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload || [];
        state.error = null;
      })
      .addCase(fetchTeamMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch team members';
      })
      .addCase(createTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create team member';
      })
      .addCase(updateTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update team member';
      })
      .addCase(deleteTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteTeamMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete team member';
      });
  },
});

// Selectors
export const selectTeamMembers = (state: RootState) => state.team.members;
export const selectTeamMembersLoading = (state: RootState) => state.team.loading;
export const selectTeamMembersError = (state: RootState) => state.team.error;

export default teamSlice.reducer;
