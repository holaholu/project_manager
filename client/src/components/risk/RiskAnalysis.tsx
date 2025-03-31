import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { analyzeProjectRisks, RiskAnalysis as RiskAnalysisType } from '../../utils/ai';

interface RiskAnalysisProps {
  projectData: {
    description: string;
    deadline: string;
    tasks: Array<{ description: string; status: string }>;
  };
}

const RiskAnalysis: React.FC<RiskAnalysisProps> = ({ projectData }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RiskAnalysisType | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await analyzeProjectRisks(projectData);
        
        if (!result.success) {
          throw new Error(result.error);
        }
        
        setAnalysis(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to analyze project risks');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [projectData]);

  const getRiskIcon = (riskLevel: 'high' | 'medium' | 'low') => {
    switch (riskLevel) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'low':
        return <CheckCircleIcon color="success" />;
    }
  };

  const getRiskColor = (riskLevel: 'high' | 'medium' | 'low') => {
    switch (riskLevel) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!analysis) {
    return <Alert severity="info">No risk analysis available</Alert>;
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Project Risk Analysis
          </Typography>
          <Chip
            icon={getRiskIcon(analysis.riskLevel)}
            label={`${analysis.riskLevel.toUpperCase()} RISK`}
            color={getRiskColor(analysis.riskLevel) as any}
            variant="outlined"
          />
        </Box>

        {analysis.riskFactors.length > 0 && (
          <>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Risk Factors
            </Typography>
            <List dense>
              {analysis.riskFactors.map((factor, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={factor} />
                </ListItem>
              ))}
            </List>
          </>
        )}

        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Mitigation Suggestions
        </Typography>
        <List dense>
          {analysis.mitigationSuggestions.map((suggestion, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <InfoIcon color="info" />
              </ListItemIcon>
              <ListItemText primary={suggestion} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default RiskAnalysis;
