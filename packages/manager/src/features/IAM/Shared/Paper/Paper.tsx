import React from 'react';

import { StyledPaper } from './Paper.styles';

import type { Spacing } from '@akamai/cds-tokens';

export type PaperSpacing = (typeof Spacing)[keyof typeof Spacing];

export interface PaperProps {
  children: React.ReactNode;
  dataTestId?: string;
  marginBottom?: PaperSpacing;
  marginTop?: PaperSpacing;
  outlined?: boolean;
  padding?: PaperSpacing;
  paddingBottom?: PaperSpacing;
  paddingTop?: PaperSpacing;
  sx?: React.CSSProperties;
}

export const Paper = ({
  marginBottom,
  marginTop,
  padding,
  paddingTop,
  paddingBottom,
  children,
  dataTestId,
  sx,
  outlined,
}: PaperProps) => {
  return (
    <StyledPaper
      data-testid={dataTestId ?? 'data-qa-paper'}
      marginBottom={marginBottom}
      marginTop={marginTop}
      outlined={outlined}
      padding={padding}
      paddingBottom={paddingBottom}
      paddingTop={paddingTop}
      style={sx}
    >
      {children}
    </StyledPaper>
  );
};
