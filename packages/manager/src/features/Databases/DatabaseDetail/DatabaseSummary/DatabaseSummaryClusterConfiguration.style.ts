import { Typography } from '@linode/ui';
import { styled } from '@mui/material/styles';

export const StyledLabelTypography = styled(Typography, {
  label: 'StyledLabelTypography',
})(({ theme }) => ({
  background: theme.tokens.alias.Background.Neutral,
  color: theme.palette.mode === 'dark' ? theme.color.grey6 : 'inherit',
  font: theme.font.bold,
  height: '100%',
  padding: `${theme.spacingFunction(4)} 15px`,
}));
