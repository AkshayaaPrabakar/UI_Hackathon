import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import LoginForm from '../components/auth/LoginForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const LoginPage: React.FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {showForgotPassword ? (
            <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />
          ) : (
            <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;