import { useTheme } from '../../hooks/useTheme';

export function useSpacing() {
  const { theme } = useTheme();
  return theme.spacing;
}

export function useTypography() {
  const { theme } = useTheme();
  return theme.typography;
}

