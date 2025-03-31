import axios from 'axios';
import cache from './cache';

const HUGGING_FACE_API = 'https://api-inference.huggingface.co/models';

// You'll need to get a free API token from Hugging Face
const API_TOKEN = process.env.REACT_APP_HUGGING_FACE_TOKEN;

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export const predictTaskPriority = async (description: string): Promise<AIResponse> => {
  try {
    const response = await axios.post(
      `${HUGGING_FACE_API}/facebook/bart-large-mnli`,
      {
        inputs: description,
        parameters: {
          candidate_labels: ['high priority', 'medium priority', 'low priority']
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const prediction = response.data;
    return {
      success: true,
      data: prediction.labels[0] // Returns the highest probability label
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to predict priority'
    };
  }
};

export const suggestTaskCategory = async (description: string): Promise<AIResponse> => {
  try {
    const response = await axios.post(
      `${HUGGING_FACE_API}/facebook/bart-large-mnli`,
      {
        inputs: description,
        parameters: {
          candidate_labels: ['development', 'design', 'testing', 'documentation', 'planning']
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const prediction = response.data;
    return {
      success: true,
      data: prediction.labels[0]
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to suggest category'
    };
  }
};

export interface RiskAnalysis {
  riskLevel: 'high' | 'medium' | 'low';
  riskFactors: string[];
  mitigationSuggestions: string[];
}

export const analyzeProjectRisks = async (projectData: {
  description: string;
  deadline: string;
  tasks: Array<{ description: string; status: string }>;
}): Promise<AIResponse> => {
  try {
    // Generate cache key based on project data
    const cacheKey = `risk-analysis-${JSON.stringify(projectData)}`;
    const cachedResult = cache.get<RiskAnalysis>(cacheKey);
    
    if (cachedResult) {
      return {
        success: true,
        data: cachedResult
      };
    }
    // Create a comprehensive project summary for analysis
    const projectSummary = `
      Project Description: ${projectData.description}
      Deadline: ${projectData.deadline}
      Number of Tasks: ${projectData.tasks.length}
      Completed Tasks: ${projectData.tasks.filter(t => t.status === 'completed').length}
      Task Descriptions: ${projectData.tasks.map(t => t.description).join('. ')}
    `;

    const response = await axios.post(
      `${HUGGING_FACE_API}/facebook/bart-large-mnli`,
      {
        inputs: projectSummary,
        parameters: {
          candidate_labels: ['high risk', 'medium risk', 'low risk']
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Get risk factors and mitigation suggestions based on the analysis
    const riskLevel = response.data.labels[0].split(' ')[0] as 'high' | 'medium' | 'low';
    
    // Define risk factors and mitigation suggestions based on the analysis
    const riskAnalysis: RiskAnalysis = {
      riskLevel,
      riskFactors: generateRiskFactors(projectData, riskLevel),
      mitigationSuggestions: generateMitigationSuggestions(riskLevel)
    };

    // Cache the results before returning
    cache.set(cacheKey, riskAnalysis);
    
    return {
      success: true,
      data: riskAnalysis
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to analyze project risks'
    };
  }
};

const generateRiskFactors = (projectData: {
  description: string;
  deadline: string;
  tasks: Array<{ description: string; status: string }>;
}, riskLevel: 'high' | 'medium' | 'low'): string[] => {
  const factors: string[] = [];
  const completionRate = projectData.tasks.filter(t => t.status === 'completed').length / projectData.tasks.length;
  const deadlineDate = new Date(projectData.deadline);
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  if (completionRate < 0.3) factors.push('Low task completion rate');
  if (daysUntilDeadline < 7) factors.push('Approaching deadline');
  if (projectData.tasks.length > 20) factors.push('High number of tasks');

  return factors;
};

const generateMitigationSuggestions = (riskLevel: 'high' | 'medium' | 'low'): string[] => {
  const suggestions = {
    high: [
      'Consider breaking down complex tasks into smaller, manageable pieces',
      'Schedule daily progress reviews',
      'Allocate additional resources to critical path tasks',
      'Establish contingency plans for high-risk areas'
    ],
    medium: [
      'Review task dependencies and optimize workflow',
      'Implement regular checkpoints for task progress',
      'Identify potential bottlenecks early'
    ],
    low: [
      'Maintain current project management practices',
      'Continue monitoring progress regularly',
      'Document successful strategies for future reference'
    ]
  };

  return suggestions[riskLevel];
};

export const summarizeDescription = async (description: string): Promise<AIResponse> => {
  try {
    const response = await axios.post(
      `${HUGGING_FACE_API}/facebook/bart-large-cnn`,
      {
        inputs: description,
        parameters: {
          max_length: 50,
          min_length: 10
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return {
      success: true,
      data: response.data[0].summary_text
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to summarize description'
    };
  }
};
