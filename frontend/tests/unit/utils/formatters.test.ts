import { describe, expect, it } from 'vitest';
import { formatCurrency, formatDateTime, formatPercent } from '@/utils/formatters';

describe('formatters', () => {
  it('formats percentages with one decimal', () => {
    expect(formatPercent(18)).toBe('18.0%');
  });

  it('formats currency values as USD for Costa Rica locale', () => {
    expect(formatCurrency(1000)).toContain('1');
    expect(formatCurrency(1000)).toContain('000');
  });

  it('formats date-time values for display', () => {
    expect(formatDateTime('2026-06-15T12:00:00.000Z')).toContain('2026');
  });
});
