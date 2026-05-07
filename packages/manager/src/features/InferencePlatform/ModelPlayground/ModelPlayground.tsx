import { Stack } from '@linode/ui';
import React from 'react';

import { InputBox } from './InputBox';
import { ModelPlaygroundProvider } from './ModelPlaygroundProvider';
import { OutputBox } from './OutputBox';
import { TuningSidebar } from './TuningSidebar';

export const ModelPlayground = () => {
  return (
    <ModelPlaygroundProvider>
      <Stack
        direction="row"
        gap={3}
        sx={{ height: 'calc(100vh - 300px)', minHeight: 400 }}
      >
        <Stack sx={{ flex: 1, minWidth: 0 }}>
          <OutputBox />
          <InputBox />
        </Stack>
        <TuningSidebar />
      </Stack>
    </ModelPlaygroundProvider>
  );
};
