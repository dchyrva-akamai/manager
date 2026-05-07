import { Box, IconButton, InputAdornment, TextField } from '@linode/ui';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import React, { useContext } from 'react';

import { ModelPlaygroundContext } from './ModelPlaygroundContext';

export const InputBox = () => {
  const { inputValue, isLoading, onInputChange, onSend } = useContext(
    ModelPlaygroundContext
  );

  const hasInput = Boolean(inputValue.trim());
  const canSend = hasInput && !isLoading;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && canSend) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        disabled={isLoading}
        fullWidth
        hideLabel
        label="Prompt"
        minRows={1}
        multiline
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a prompt..."
        slotProps={{
          htmlInput: {
            style: { minHeight: 'unset' },
          },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  disabled={!canSend}
                  onClick={onSend}
                  size="small"
                  sx={{
                    bgcolor: canSend
                      ? 'primary.main'
                      : 'action.disabledBackground',
                    borderRadius: '4px',
                    color: 'primary.contrastText',
                    height: 32,
                    mb: 0.6,
                    width: 32,
                    '&:hover': {
                      bgcolor: canSend ? 'primary.dark' : undefined,
                    },
                  }}
                >
                  <ArrowUpward style={{ height: 20, width: 20 }} />
                </IconButton>
              </InputAdornment>
            ),
            sx: {
              alignItems: 'flex-end',
              borderRadius: '4px',
              height: 'auto',
              maxWidth: 'unset',
              px: 1.5,
              py: 1,
            },
          },
        }}
        value={inputValue}
      />
    </Box>
  );
};
