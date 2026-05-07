import { Box, Paper, Stack } from '@linode/ui';
import React, { useContext, useEffect, useRef } from 'react';

import AI from 'src/assets/icons/entityIcons/ai.svg';
import CoreUser from 'src/assets/icons/entityIcons/coreuser.svg';
import { Markdown } from 'src/components/Markdown/Markdown';

import { ModelPlaygroundContext } from './ModelPlaygroundContext';

const ICON_BOX_SX = {
  alignItems: 'center',
  bgcolor: 'action.selected',
  borderRadius: 1,
  display: 'flex',
  flexShrink: 0,
  height: 40,
  justifyContent: 'center',
  width: 40,
} as const;

const MARKDOWN_SX = {
  '& p': { lineHeight: 1.8 },
  '& p:first-of-type': { mt: 0 },
  '& p:last-of-type': { mb: 0 },
} as const;

export const OutputBox = () => {
  const { messages } = useContext(ModelPlaygroundContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.bg.offWhite,
        flex: 1,
        overflowY: 'auto',
        p: 2,
      })}
    >
      {messages.map((message) =>
        message.role === 'user' ? (
          <Stack
            alignItems="flex-start"
            direction="row"
            gap={1.5}
            key={message.id}
            sx={{ mb: 4 }}
          >
            <Box sx={ICON_BOX_SX}>
              <CoreUser />
            </Box>
            <Paper
              sx={{
                borderRadius: 2,
                maxWidth: '80%',
                px: 1.5,
                py: 0.75,
              }}
              variant="outlined"
            >
              <Box sx={MARKDOWN_SX}>
                <Markdown textOrMarkdown={message.content} />
              </Box>
            </Paper>
          </Stack>
        ) : (
          <Stack
            alignItems="flex-start"
            direction="row"
            gap={1.5}
            key={message.id}
            sx={{ mb: 4 }}
          >
            <Box sx={{ ...ICON_BOX_SX, '& svg': { height: 24, width: 24 } }}>
              <AI />
            </Box>
            <Box sx={{ ...MARKDOWN_SX, flex: 1, minWidth: 0 }}>
              <Markdown textOrMarkdown={message.content} />
            </Box>
          </Stack>
        )
      )}
      <div ref={messagesEndRef} />
    </Box>
  );
};
