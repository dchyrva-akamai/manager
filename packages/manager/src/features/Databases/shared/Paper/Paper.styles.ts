import { omittedProps } from '@linode/ui';
import { styled } from '@mui/material/styles';

import type { PaperProps } from './Paper';

type StyledPaperProps = Pick<
  PaperProps,
  'marginBottom' | 'marginTop' | 'padding' | 'paddingBottom' | 'paddingTop'
>;

const propKeys = [
  'marginBottom',
  'marginTop',
  'padding',
  'paddingTop',
  'paddingBottom',
];

export const StyledPaper = styled('div', {
  label: 'StyledPaper',
  shouldForwardProp: omittedProps(propKeys),
})<StyledPaperProps>(({ theme, ...props }) => ({
  backgroundColor: theme.tokens.alias.Background.Normal,
  marginBottom: props.marginBottom ?? 0,
  marginTop: props.marginTop ?? 0,
  padding: props.padding ?? '1.5rem',
  paddingBottom: props.paddingBottom ?? '1.5rem',
  paddingTop: props.paddingTop ?? '1rem',
}));
