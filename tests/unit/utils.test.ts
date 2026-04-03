import { describe, it, expect } from 'vitest';
import { isValidAddress, cn } from '@/lib/utils';

describe('isValidAddress', () => {
  it('should validate XRPL addresses', () => {
    expect(isValidAddress('rPT1Sjq2YGrvBv2yZH2ndDGYJUCzPaoK7', 'XRPL')).toBe(true);
    expect(isValidAddress('invalid', 'XRPL')).toBe(false);
  });

  it('should validate EVM addresses', () => {
    expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 'ETHEREUM')).toBe(true);
    expect(isValidAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 'POLYGON')).toBe(true);
    expect(isValidAddress('0x123', 'ETHEREUM')).toBe(false);
  });

  it('should validate Solana addresses', () => {
    expect(isValidAddress('HN7cABqLq46Es1jh92dQQisEP66edQ6ST4ptzVCsZ417', 'SOLANA')).toBe(true);
    expect(isValidAddress('O0Il', 'SOLANA')).toBe(false);
  });
});

describe('cn', () => {
  it('should merge tailwind classes', () => {
    expect(cn('bg-red-500', 'p-4')).toBe('bg-red-500 p-4');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });
});
