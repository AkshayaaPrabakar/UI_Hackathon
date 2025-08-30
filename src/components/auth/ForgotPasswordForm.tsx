import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
});

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBackToLogin }) => {
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);
    setError(null);

    try {
      await resetPassword(data.email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom color="success.main">
              Check Your Email
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              We've sent a password reset link to your email address.
            </Typography>
            <Button
              variant="outlined"
              onClick={onBackToLogin}
              startIcon={<ArrowBack />}
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Reset Password
          </Typography>
          
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a link to reset your password.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('email')}
              fullWidth
              label="Email Address"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Send Reset Link'
              )}
            </Button>

            <Box textAlign="center">
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={onBackToLogin}
              >
                Back to login
              </Link>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ForgotPasswordForm;