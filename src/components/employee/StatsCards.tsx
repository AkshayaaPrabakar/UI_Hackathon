import React from 'react';
import { Grid, Card, CardContent, Typography, Box, LinearProgress, Skeleton } from '@mui/material';
import { Assignment, Code, Schedule, TrendingUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ActivitySummary } from '../../types';

interface StatsCardsProps {
  summary: ActivitySummary;
  loading: boolean;
}

const StatsCards: React.FC<StatsCardsProps> = ({ summary, loading }) => {
  const statsData = [
    {
      title: 'Jira Tickets',
      value: summary.jiraTickets,
      icon: <Assignment />,
      color: '#1976d2',
      subtitle: 'Active this week',
    },
    {
      title: 'Git Commits',
      value: summary.gitCommits,
      icon: <Code />,
      color: '#2e7d32',
      subtitle: 'Pushed today',
    },
    {
      title: 'VS Code Hours',
      value: `${summary.vscodeHours.toFixed(1)}h`,
      icon: <Schedule />,
      color: '#f57c00',
      subtitle: 'Coding time',
    },
    {
      title: 'Completion Rate',
      value: `${summary.completionRate}%`,
      icon: <TrendingUp />,
      color: '#dc004e',
      subtitle: 'Weekly progress',
      progress: summary.completionRate,
    },
  ];

  return (
    <Grid container spacing={3}>
      {statsData.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={stat.title}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -4 }}
          >
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    {loading ? (
                      <Skeleton variant="text" width={80} height={32} />
                    ) : (
                      <Typography variant="h4" fontWeight="bold" color={stat.color}>
                        {stat.value}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: `${stat.color}15`,
                      borderRadius: '50%',
                      p: 1,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
                {stat.progress !== undefined && (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={stat.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: `${stat.color}20`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: stat.color,
                        },
                      }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsCards;