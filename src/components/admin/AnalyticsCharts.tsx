import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';

const productivityData = [
  { week: 'Week 1', productivity: 85 },
  { week: 'Week 2', productivity: 88 },
  { week: 'Week 3', productivity: 92 },
  { week: 'Week 4', productivity: 87 },
  { week: 'Week 5', productivity: 94 },
];

const reportStatusData = [
  { name: 'Approved', value: 12, color: '#2e7d32' },
  { name: 'Pending', value: 5, color: '#f57c00' },
  { name: 'Rejected', value: 2, color: '#d32f2f' },
];

const AnalyticsCharts: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Team Productivity Trend
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="productivity"
                  stroke={theme.palette.primary.main}
                  strokeWidth={3}
                  dot={{ fill: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Report Status Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={reportStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {reportStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default AnalyticsCharts;