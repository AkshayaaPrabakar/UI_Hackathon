import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { employeeApi } from '../../services/api';
import { JiraTicket, GitActivity, VSCodeActivity, ActivitySummary } from '../../types';
import ActivityTimeline from './ActivityTimeline';
import WeeklyQuestionnaire from './WeeklyQuestionnaire';
import StatsCards from './StatsCards';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activity, setActivity] = useState<{
    jira: JiraTicket[];
    git: GitActivity[];
    vscode: VSCodeActivity[];
  }>({ jira: [], git: [], vscode: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await employeeApi.getActivity();
        setActivity(data);
      } catch (error) {
        console.error('Failed to fetch activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const activitySummary: ActivitySummary = {
    jiraTickets: activity.jira.length,
    gitCommits: activity.git.length,
    vscodeHours: activity.vscode.reduce((total, item) => total + (item.duration / 3600000), 0),
    completionRate: 85,
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your weekly overview and current activities
          </Typography>
        </Box>

        <StatsCards summary={activitySummary} loading={loading} />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <WeeklyQuestionnaire />
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ActivityTimeline
                jiraTickets={activity.jira}
                gitActivity={activity.git}
                vscodeActivity={activity.vscode}
                loading={loading}
              />
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default EmployeeDashboard;