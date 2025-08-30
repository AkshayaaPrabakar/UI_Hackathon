import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Skeleton,
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  Cancel,
  Comment,
  Send,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Report } from '../../types';

interface ReportReviewProps {
  reports: Report[];
  loading: boolean;
}

const ReportReview: React.FC<ReportReviewProps> = ({ reports, loading }) => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
  };

  const handleReviewAction = (action: 'approve' | 'reject', report: Report) => {
    setSelectedReport(report);
    setReviewAction(action);
    setReviewDialog(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedReport || !reviewAction) return;

    try {
      if (reviewAction === 'approve') {
        // await adminApi.approveReport(selectedReport.id, feedback);
        console.log('Approving report:', selectedReport.id, feedback);
      } else {
        // await adminApi.rejectReport(selectedReport.id, feedback);
        console.log('Rejecting report:', selectedReport.id, feedback);
      }
      
      setReviewDialog(false);
      setFeedback('');
      setSelectedReport(null);
      setReviewAction(null);
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Report Review Queue
          </Typography>
          {[...Array(3)].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" width="100%" height={80} />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" fontWeight="bold">
              Report Review Queue
            </Typography>
            <Chip
              label={`${reports.filter(r => r.status === 'pending').length} pending`}
              color="warning"
              size="small"
            />
          </Box>

          <List>
            {reports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" gap={2} flex={1}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Assignment />
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            Weekly Report - Week of {report.weekOf}
                          </Typography>
                          <Chip
                            label={report.status}
                            size="small"
                            color={getStatusColor(report.status)}
                          />
                          <Chip
                            label={report.type}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          Employee ID: {report.employeeId} • 
                          Submitted: {new Date(report.createdAt).toLocaleDateString()}
                        </Typography>
                      }
                    />
                  </Box>
                  <ListItemSecondaryAction>
                    <Box display="flex" gap={1}>
                      <Tooltip title="View Report">
                        <IconButton
                          onClick={() => handleViewReport(report)}
                          size="small"
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      {report.status === 'pending' && (
                        <>
                          <Tooltip title="Approve">
                            <IconButton
                              onClick={() => handleReviewAction('approve', report)}
                              color="success"
                              size="small"
                            >
                              <CheckCircle />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <IconButton
                              onClick={() => handleReviewAction('reject', report)}
                              color="error"
                              size="small"
                            >
                              <Cancel />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </motion.div>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Report View Dialog */}
      <Dialog
        open={!!selectedReport && !reviewDialog}
        onClose={() => setSelectedReport(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Report Details - Week of {selectedReport?.weekOf}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {selectedReport?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedReport(null)}>Close</Button>
          {selectedReport?.status === 'pending' && (
            <>
              <Button
                onClick={() => handleReviewAction('approve', selectedReport)}
                color="success"
                variant="contained"
                startIcon={<CheckCircle />}
              >
                Approve
              </Button>
              <Button
                onClick={() => handleReviewAction('reject', selectedReport)}
                color="error"
                variant="contained"
                startIcon={<Cancel />}
              >
                Reject
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Review Action Dialog */}
      <Dialog
        open={reviewDialog}
        onClose={() => setReviewDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {reviewAction === 'approve' ? 'Approve Report' : 'Reject Report'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Feedback (optional)"
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder={
              reviewAction === 'approve'
                ? 'Provide positive feedback or suggestions for improvement...'
                : 'Please explain the reasons for rejection...'
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSubmitReview}
            color={reviewAction === 'approve' ? 'success' : 'error'}
            variant="contained"
            startIcon={reviewAction === 'approve' ? <CheckCircle /> : <Cancel />}
          >
            {reviewAction === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ReportReview;