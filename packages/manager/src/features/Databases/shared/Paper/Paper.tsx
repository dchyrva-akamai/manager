import React from 'react';

import { StyledPaper } from './Paper.styles';

import type { Spacing } from '@akamai/cds-tokens';

export type PaperSpacing = (typeof Spacing)[keyof typeof Spacing];

export interface PaperProps {
  children: React.ReactNode;
  dataTestId?: string;
  marginBottom?: PaperSpacing;
  marginTop?: PaperSpacing;
  padding?: PaperSpacing;
  paddingBottom?: PaperSpacing;
  paddingTop?: PaperSpacing;
}

export const Paper = ({
  marginBottom,
  marginTop,
  padding,
  paddingTop,
  paddingBottom,
  children,
  dataTestId,
}: PaperProps) => {
  return (
    <StyledPaper
      data-testid={dataTestId ?? 'data-qa-paper'}
      marginBottom={marginBottom}
      marginTop={marginTop}
      padding={padding}
      paddingBottom={paddingBottom}
      paddingTop={paddingTop}
    >
      {children}
    </StyledPaper>
  );
};
