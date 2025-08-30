import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Skeleton,
  Divider,
} from '@mui/material';
import {
  BugReport,
  Code,
  Edit,
  Schedule,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { JiraTicket, GitActivity, VSCodeActivity } from '../../types';

interface ActivityTimelineProps {
  jiraTickets: JiraTicket[];
  gitActivity: GitActivity[];
  vscodeActivity: VSCodeActivity[];
  loading: boolean;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  jiraTickets,
  gitActivity,
  vscodeActivity,
  loading,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'warning';
      case 'ready for review':
        return 'info';
      case 'done':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
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

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          {[...Array(5)].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton variant="circular" width={40} height={40} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="60%" />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Combine and sort all activities
  const allActivities = [
    ...jiraTickets.map(ticket => ({
      id: ticket.id,
      type: 'jira' as const,
      title: ticket.summary,
      subtitle: `${ticket.key} • ${ticket.status}`,
      timestamp: ticket.updated,
      data: ticket,
    })),
    ...gitActivity.map(commit => ({
      id: commit.id,
      type: 'git' as const,
      title: commit.message,
      subtitle: `${commit.repo} • +${commit.additions} -${commit.deletions}`,
      timestamp: commit.timestamp,
      data: commit,
    })),
    ...vscodeActivity.map(activity => ({
      id: activity.id,
      type: 'vscode' as const,
      title: activity.fileName,
      subtitle: `${activity.action} • ${Math.round(activity.duration / 60000)}min`,
      timestamp: activity.timestamp,
      data: activity,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'jira':
        return <BugReport />;
      case 'git':
        return <Code />;
      case 'vscode':
        return <Edit />;
      default:
        return <Schedule />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'jira':
        return '#1976d2';
      case 'git':
        return '#2e7d32';
      case 'vscode':
        return '#f57c00';
      default:
        return '#757575';
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        
        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
          {allActivities.slice(0, 10).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: getActivityColor(activity.type),
                      width: 32,
                      height: 32,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight="medium">
                      {activity.title}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {activity.subtitle}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        {new Date(activity.timestamp).toLocaleString()}
                      </Typography>
                      {activity.type === 'jira' && (
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            size="small"
                            label={(activity.data as JiraTicket).status}
                            color={getStatusColor((activity.data as JiraTicket).status)}
                          />
                          <Chip
                            size="small"
                            label={(activity.data as JiraTicket).priority}
                            color={getPriorityColor((activity.data as JiraTicket).priority)}
                            sx={{ ml: 0.5 }}
                          />
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < allActivities.length - 1 && <Divider />}
            </motion.div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;