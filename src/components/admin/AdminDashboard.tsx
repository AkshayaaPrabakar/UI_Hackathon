import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  People,
  Assignment,
  TrendingUp,
  CheckCircle,
  Visibility,
  Edit,
  Send,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { adminApi } from '../../services/api';
import { User, Report } from '../../types';
import EmployeeGrid from './EmployeeGrid';
import ReportReview from './ReportReview';
import AnalyticsCharts from './AnalyticsCharts';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeesData, reportsData] = await Promise.all([
          adminApi.getEmployees(),
          adminApi.getReports(),
        ]);
        setEmployees(employeesData);
        setReports(reportsData);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = {
    totalEmployees: employees.length,
    pendingReports: reports.filter(r => r.status === 'pending').length,
    completionRate: employees.length > 0 ? Math.round((reports.length / employees.length) * 100) : 0,
    activeProjects: 8,
  };

  const adminStatsData = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: <People />,
      color: '#1976d2',
      subtitle: 'Active team members',
    },
    {
      title: 'Pending Reports',
      value: stats.pendingReports,
      icon: <Assignment />,
      color: '#f57c00',
      subtitle: 'Awaiting review',
    },
    {
      title: 'Completion Rate',
      value: `${stats.completionRate}%`,
      icon: <CheckCircle />,
      color: '#2e7d32',
      subtitle: 'This week',
      progress: stats.completionRate,
    },
    {
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: <TrendingUp />,
      color: '#dc004e',
      subtitle: 'In development',
    },
  ];

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard 📊
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage employees, review reports, and monitor team productivity
          </Typography>
        </Box>

        {/* Admin Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {adminStatsData.map((stat, index) => (
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
                          <Typography variant="h4">--</Typography>
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

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <EmployeeGrid employees={employees} loading={loading} />
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <AnalyticsCharts />
            </motion.div>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <ReportReview reports={reports} loading={loading} />
          </motion.div>
        </Box>
      </motion.div>
    </Box>
  );
};

export default AdminDashboard;