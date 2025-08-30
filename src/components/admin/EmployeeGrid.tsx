import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import { Visibility, Edit, Email } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { User } from '../../types';

interface EmployeeGridProps {
  employees: User[];
  loading: boolean;
}

const EmployeeGrid: React.FC<EmployeeGridProps> = ({ employees, loading }) => {
  const mockCompletionRates = [85, 92, 78, 95, 88]; // Mock data

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Employee Overview
          </Typography>
          <Grid container spacing={2}>
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Skeleton variant="circular" width={48} height={48} />
                      <Box flex={1}>
                        <Skeleton variant="text" width="70%" />
                        <Skeleton variant="text" width="50%" />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" fontWeight="bold">
            Employee Overview
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {employees.length} team members
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {employees.map((employee, index) => {
            const completionRate = mockCompletionRates[index] || 80;
            return (
              <Grid item xs={12} sm={6} md={6} key={employee.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Avatar
                          src={employee.avatar}
                          alt={employee.name}
                          sx={{ width: 48, height: 48 }}
                        >
                          {employee.name[0]}
                        </Avatar>
                        <Box flex={1}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {employee.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {employee.department}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <Chip
                              label={employee.role}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                        <Box display="flex" flexDirection="column" gap={1}>
                          <Tooltip title="View Profile">
                            <IconButton size="small">
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Send Email">
                            <IconButton size="small">
                              <Email fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Typography variant="body2" fontWeight="medium">
                            Weekly Progress
                          </Typography>
                          <Typography variant="body2" color="primary.main" fontWeight="bold">
                            {completionRate}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={completionRate}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor:
                                completionRate >= 90
                                  ? 'success.main'
                                  : completionRate >= 70
                                  ? 'warning.main'
                                  : 'error.main',
                            },
                          }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EmployeeGrid;