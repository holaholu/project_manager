// Utility functions for consistent color handling across components

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'in progress':
      return 'primary';
    case 'not started':
      return 'default';
    default:
      return 'default';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'default';
  }
};
