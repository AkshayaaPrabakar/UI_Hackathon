import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Mic,
  MicOff,
  Save,
  Send,
  AutoAwesome,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';

interface QuestionnaireData {
  accomplishments: string;
  challenges: string;
  goals: string;
  feedback: string;
  blockers: string;
}

const questions = [
  {
    key: 'accomplishments' as keyof QuestionnaireData,
    label: 'What did you accomplish this week?',
    placeholder: 'Describe your key achievements and completed tasks...',
  },
  {
    key: 'challenges' as keyof QuestionnaireData,
    label: 'What challenges did you face?',
    placeholder: 'Share any obstacles or difficulties you encountered...',
  },
  {
    key: 'goals' as keyof QuestionnaireData,
    label: 'What are your goals for next week?',
    placeholder: 'Outline your priorities and objectives...',
  },
  {
    key: 'feedback' as keyof QuestionnaireData,
    label: 'Any feedback or suggestions?',
    placeholder: 'Share your thoughts on processes, tools, or team dynamics...',
  },
  {
    key: 'blockers' as keyof QuestionnaireData,
    label: 'What blockers need attention?',
    placeholder: 'Identify any issues that need management support...',
  },
];

const WeeklyQuestionnaire: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentField, setCurrentField] = useState<keyof QuestionnaireData | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, string[]>>({});
  const [autoSaved, setAutoSaved] = useState(false);
  const [progress, setProgress] = useState(0);

  const { control, handleSubmit, watch, setValue, getValues } = useForm<QuestionnaireData>({
    defaultValues: {
      accomplishments: '',
      challenges: '',
      goals: '',
      feedback: '',
      blockers: '',
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    const filledFields = Object.values(watchedValues).filter(value => value.trim() !== '').length;
    const newProgress = (filledFields / questions.length) * 100;
    setProgress(newProgress);
  }, [watchedValues]);

  useEffect(() => {
    const timer = setInterval(() => {
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 2000);
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const startListening = (field: keyof QuestionnaireData) => {
    setCurrentField(field);
    setIsListening(true);
    
    setTimeout(() => {
      const mockText = `This is a mock voice input for ${field}. In production, this would use the Web Speech API.`;
      setValue(field, mockText);
      setIsListening(false);
      setCurrentField(null);
    }, 3000);
  };

  const generateAISuggestions = (field: keyof QuestionnaireData, text: string) => {
    const suggestions = [
      'Consider adding more specific metrics',
      'This could be more concise',
      'Great detail! Maybe add timeline information',
    ];
    
    setAiSuggestions(prev => ({
      ...prev,
      [field]: suggestions,
    }));
  };

  const onSubmit = (data: QuestionnaireData) => {
    console.log('Submitting questionnaire:', data);
  };

  const onSave = () => {
    const data = getValues();
    console.log('Saving draft:', data);
    setAutoSaved(true);
    setTimeout(() => setAutoSaved(false), 2000);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">
            Weekly Questionnaire
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={`${Math.round(progress)}% Complete`}
              color={progress === 100 ? 'success' : 'primary'}
              size="small"
            />
            <AnimatePresence>
              {autoSaved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Chip label="Auto-saved" color="success" size="small" />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mb: 3, height: 6, borderRadius: 3 }}
        />

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          {questions.map((question, index) => (
            <motion.div
              key={question.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Box sx={{ mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="h6" fontWeight="medium">
                    {question.label}
                  </Typography>
                  <Tooltip title="Voice input">
                    <IconButton
                      onClick={() => startListening(question.key)}
                      disabled={isListening && currentField !== question.key}
                      color={currentField === question.key && isListening ? 'secondary' : 'default'}
                      size="small"
                    >
                      {currentField === question.key && isListening ? (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                        >
                          <MicOff />
                        </motion.div>
                      ) : (
                        <Mic />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="AI suggestions">
                    <IconButton
                      onClick={() => generateAISuggestions(question.key, watchedValues[question.key])}
                      size="small"
                      color="primary"
                    >
                      <AutoAwesome />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Controller
                  name={question.key}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      multiline
                      rows={4}
                      placeholder={question.placeholder}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          transition: 'all 0.3s ease',
                        },
                      }}
                    />
                  )}
                />

                {aiSuggestions[question.key] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" color="primary" fontWeight="medium">
                        AI Suggestions:
                      </Typography>
                      {aiSuggestions[question.key].map((suggestion, idx) => (
                        <Chip
                          key={idx}
                          label={suggestion}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1, mt: 0.5 }}
                          onClick={() => {
                            console.log('Applying suggestion:', suggestion);
                          }}
                        />
                      ))}
                    </Box>
                  </motion.div>
                )}
              </Box>
            </motion.div>
          ))}

          <Box display="flex" gap={2} sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Save />}
              onClick={onSave}
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              disabled={progress < 100}
            >
              Submit Report
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WeeklyQuestionnaire;