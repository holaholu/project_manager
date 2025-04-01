import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectReducer from './slices/projectSlice';
import taskReducer from './slices/taskSlice';
import teamReducer from './slices/teamSlice';

//configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    team: teamReducer,
  },
});



// Define the RootState type which represents the complete state tree
export type RootState = ReturnType<typeof store.getState>;

// Define the AppDispatch type for dispatching actions
// This enables proper typing when using dispatch in components
export type AppDispatch = typeof store.dispatch;
